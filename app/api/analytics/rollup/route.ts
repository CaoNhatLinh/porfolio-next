import { NextResponse } from "next/server";
import { getServerEnv } from "../../../lib/env/server";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export const runtime = "nodejs";

type EventRow = { event_name?: string | null; path: string; visitor_hash: string; engaged_ms: number | null; referrer_domain: string | null; created_at: string };

function authorized(request: Request, secret: string) {
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function rollup(request: Request) {
  let env;
  try { env = getServerEnv(); } catch { return NextResponse.json({ error: "Analytics is not configured." }, { status: 503 }); }
  if (!env.CRON_SECRET || !authorized(request, env.CRON_SECRET)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Analytics is not configured." }, { status: 503 });
  try {
    const supabase = createSupabaseAdminClient();
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const data: EventRow[] = [];
    const until = new Date().toISOString();
    for (let offset = 0; ; offset += 1000) {
      const { data: batch, error } = await supabase.from("analytics_events").select("event_name, path, visitor_hash, engaged_ms, referrer_domain, created_at").gte("created_at", cutoff.toISOString()).lt("created_at", until).order("id", { ascending: true }).range(offset, offset + 999);
      if (error) throw error;
      data.push(...(batch as EventRow[] ?? []));
      if (!batch || batch.length < 1000) break;
    }
    const byDay = new Map<string, EventRow[]>();
    for (const row of data) {
      const day = row.created_at.slice(0, 10);
      const events = byDay.get(day) ?? [];
      events.push(row);
      byDay.set(day, events);
    }
    for (const [day, events] of byDay) {
      const pageEvents = events.filter((event) => !event.event_name || event.event_name === "page_view");
      if (pageEvents.length === 0) continue;
      const engaged = pageEvents.reduce((total, event) => total + (event.engaged_ms ?? 0), 0);
      const { error: upsertError } = await supabase.from("analytics_daily").upsert({ day, page_views: pageEvents.length, unique_visitors: new Set(pageEvents.map((event) => event.visitor_hash)).size, engaged_ms_total: engaged, top_pages: top(pageEvents.map((event) => event.path)), top_referrers: top(pageEvents.map((event) => event.referrer_domain).filter((value): value is string => Boolean(value))), updated_at: new Date().toISOString() }, { onConflict: "day" });
      if (upsertError) throw upsertError;
    }
    const { error: deleteError } = await supabase.from("analytics_events").delete().lt("created_at", cutoff.toISOString());
    if (deleteError) throw deleteError;
    return NextResponse.json({ ok: true, days: byDay.size, retainedSince: cutoff.toISOString() });
  } catch (error) {
    console.error("analytics_rollup_failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Unable to roll up analytics." }, { status: 500 });
  }
}

export async function GET(request: Request) { return rollup(request); }
export async function POST(request: Request) { return rollup(request); }

function top(values: string[]) { const counts = new Map<string, number>(); values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)); return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([value, count]) => ({ value, count })); }
