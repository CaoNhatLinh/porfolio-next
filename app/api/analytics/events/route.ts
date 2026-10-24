import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { analyticsEventSchema } from "../../../features/analytics/schema";
import { getServerEnv } from "../../../lib/env/server";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export const runtime = "nodejs";

function deviceFamily(userAgent: string) {
  if (/bot|crawler|spider|preview/i.test(userAgent)) return "bot";
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(input);
  if (!parsed.success) return new NextResponse(null, { status: 202 });
  const data = parsed.data;
  if (["/admin", "/login", "/api", "/preview"].some((prefix) => data.path.startsWith(prefix))) return new NextResponse(null, { status: 202 });
  const userAgent = request.headers.get("user-agent") ?? "";
  if (deviceFamily(userAgent) === "bot") return new NextResponse(null, { status: 202 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) return new NextResponse(null, { status: 202 });

  try {
    const env = getServerEnv();
    if (!env.SUPABASE_SERVICE_ROLE_KEY) return new NextResponse(null, { status: 202 });
    const daySalt = `${env.ANALYTICS_SALT ?? env.SUPABASE_SERVICE_ROLE_KEY}:${new Date().toISOString().slice(0, 10)}`;
    const visitorHash = createHmac("sha256", daySalt).update(data.visitorToken).digest("hex");
    const referrerDomain = data.referrer ? new URL(data.referrer).hostname.slice(0, 180) : null;
    const supabase = createSupabaseAdminClient();
    if (data.viewId && data.eventName === "page_view") {
      const { error } = await supabase.from("analytics_events").upsert({ view_id: data.viewId, event_name: data.eventName, visitor_hash: visitorHash, path: data.path, referrer_domain: referrerDomain, viewport: data.viewport, device_family: deviceFamily(userAgent), country_code: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null, engaged_ms: data.engagedMs ?? 0 }, { onConflict: "view_id" });
      if (error) console.error("analytics_event_persist_failed", error.message);
      return new NextResponse(null, { status: 202 });
    }
    const recentCutoff = new Date(Date.now() - 45_000).toISOString();
    const { data: recent } = await supabase.from("analytics_events").select("id").eq("visitor_hash", visitorHash).eq("path", data.path).eq("event_name", data.eventName).gte("created_at", recentCutoff).limit(1).maybeSingle();
    const { error } = recent?.id
      ? await supabase.from("analytics_events").update({ engaged_ms: data.engagedMs ?? null }).eq("id", recent.id)
      : await supabase.from("analytics_events").insert({ event_name: data.eventName, visitor_hash: visitorHash, path: data.path, referrer_domain: referrerDomain, viewport: data.viewport, device_family: deviceFamily(userAgent), country_code: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null, engaged_ms: data.engagedMs ?? null });
    if (error) console.error("analytics_event_persist_failed", error.message);
  } catch (error) {
    console.error("analytics_event_failed", error instanceof Error ? error.message : "unknown");
  }
  return new NextResponse(null, { status: 202 });
}
