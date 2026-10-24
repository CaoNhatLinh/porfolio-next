import { ChartLineUp, Check, Info } from "@phosphor-icons/react/dist/ssr";
import { AnalyticsRange } from "../../components/admin/analytics-range";
import type { AnalyticsPoint } from "../../components/admin/analytics-chart";
import { AnalyticsChartLazy } from "../../components/admin/analytics-chart-lazy";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export const dynamic = "force-dynamic";

type EventRow = { event_name?: string | null; path: string; visitor_hash: string; engaged_ms: number | null; device_family: string | null; referrer_domain: string | null; created_at: string };

async function loadEvents(days: number) {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const supabase = createSupabaseAdminClient();
    const events: EventRow[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.from("analytics_events").select("event_name, path, visitor_hash, engaged_ms, device_family, referrer_domain, created_at").gte("created_at", since).order("id", { ascending: true }).range(offset, offset + 999);
      if (error) throw new Error("Unable to load analytics.");
      events.push(...(data as EventRow[] ?? []));
      if (!data || data.length < 1000) return events;
    }
  } catch {
    return [];
  }
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const days = params.range === "7" || params.range === "90" ? Number(params.range) : 30;
  const events = await loadEvents(days);
  const pageEvents = events.filter((event) => !event.event_name || event.event_name === "page_view");
  const unique = new Set(pageEvents.map((event) => `${event.created_at.slice(0, 10)}:${event.visitor_hash}`)).size;
  const engaged = pageEvents.filter((event) => typeof event.engaged_ms === "number");
  const average = engaged.length ? Math.round(engaged.reduce((total, event) => total + (event.engaged_ms ?? 0), 0) / engaged.length / 1000) : 0;
  const pages = top(pageEvents.map((event) => event.path));
  const referrers = top(pageEvents.map((event) => event.referrer_domain).filter((value): value is string => Boolean(value)));
  const conversionEvents = top(events.filter((event) => event.event_name && event.event_name !== "page_view").map((event) => event.event_name as string));
  const chartData = daily(pageEvents);

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mono text-xs uppercase tracking-[.15em] text-black/45">Traffic overview</p><h1 className="display mt-3 text-6xl font-bold leading-[.8] md:text-8xl">Analytics</h1></div><div className="flex items-center gap-4"><AnalyticsRange value={days} /><ChartLineUp size={40} className="text-[var(--accent-ink)]" /></div></div>
    <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Page views" value={pageEvents.length} /><Metric label="Daily unique visitors (sum)" value={unique} /><Metric label="Avg. engaged" value={average ? `${average}s` : "n/a"} /><Metric label="Tracked days" value={chartData.length} /></div>
    {events.length === 0 ? <div className="mt-10 rounded-[14px] border border-black/10 bg-[var(--paper)] p-8"><Info size={22} className="text-[var(--accent-ink)]" /><h2 className="mt-5 text-xl font-medium">No analytics data yet.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55">The tracker is active on public pages, but metrics stay empty until Supabase service credentials and the analytics migration are configured.</p></div> : <><section className="mt-10 rounded-[14px] border border-black/10 bg-[var(--paper)] p-5 md:p-7"><div className="flex flex-wrap items-baseline justify-between gap-4"><div><p className="mono text-[10px] uppercase tracking-[.14em] text-black/45">Daily signal</p><h2 className="mt-2 text-xl font-medium">Views and unique visitors</h2></div><p className="text-xs text-black/45">{days} day window</p></div><div className="mt-7"><AnalyticsChartLazy data={chartData} /></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[28rem] text-left text-xs"><caption className="sr-only">Daily analytics data</caption><thead className="mono text-[10px] uppercase tracking-[.12em] text-black/45"><tr><th className="pb-3 font-normal">Day</th><th className="pb-3 text-right font-normal">Page views</th><th className="pb-3 text-right font-normal">Unique visitors</th></tr></thead><tbody>{chartData.map((point) => <tr key={point.day} className="border-t border-black/10"><th className="py-3 font-normal">{point.day}</th><td className="py-3 text-right">{point.views}</td><td className="py-3 text-right">{point.unique}</td></tr>)}</tbody></table></div></section><div className="mt-10 grid gap-4 md:grid-cols-3"><Ranked title="Top pages" items={pages} /><Ranked title="Referrer domains" items={referrers} /><Ranked title="Conversion events" items={conversionEvents} /></div></>}
    <p className="mt-8 flex items-center gap-2 text-xs text-black/50"><Check size={15} className="text-[var(--accent-ink)]" /> No raw IP addresses are stored. Visitor IDs rotate daily; the period total is visitor-days, not distinct people across the period.</p>
  </div>;
}

function daily(events: EventRow[]): AnalyticsPoint[] {
  const days = new Map<string, { views: number; visitors: Set<string> }>();
  events.forEach((event) => { const day = event.created_at.slice(0, 10); const current = days.get(day) ?? { views: 0, visitors: new Set<string>() }; current.views += 1; current.visitors.add(event.visitor_hash); days.set(day, current); });
  return [...days.entries()].map(([day, value]) => ({ day, views: value.views, unique: value.visitors.size }));
}

function top(values: string[]) { const counts = new Map<string, number>(); values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)); return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6); }
function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-[14px] border border-black/10 bg-[var(--paper)] p-6"><p className="mono text-[10px] uppercase tracking-[.14em] text-black/45">{label}</p><p className="display mt-8 text-5xl font-bold">{value}</p></div>; }
function Ranked({ title, items }: { title: string; items: [string, number][] }) { return <section className="rounded-[14px] border border-black/10 bg-[var(--paper)] p-6"><h2 className="text-lg font-medium">{title}</h2>{items.length === 0 ? <p className="mt-8 text-sm text-black/45">No data</p> : <ol className="mt-6 space-y-4">{items.map(([item, count], index) => <li key={item} className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm"><span><span className="mono mr-3 text-[10px] text-black/35">0{index + 1}</span>{item}</span><span className="mono text-xs text-black/50">{count}</span></li>)}</ol>}</section>; }
