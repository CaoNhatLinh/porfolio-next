"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type AnalyticsPoint = { day: string; views: number; unique: number };

export function AnalyticsChart({ data }: { data: AnalyticsPoint[] }) {
  if (!data.length) return <div className="grid h-72 place-items-center rounded-xl border border-dashed border-black/15 text-sm text-black/45">No daily chart data yet.</div>;
  return <div className="h-72 w-full" role="img" aria-label="Daily page views and unique visitors chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}><defs><linearGradient id="views-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(0,0,0,.1)" vertical={false} /><XAxis dataKey="day" tickFormatter={formatDay} tickLine={false} axisLine={false} tick={{ fill: "rgba(0,0,0,.45)", fontSize: 11 }} minTickGap={28} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "rgba(0,0,0,.45)", fontSize: 11 }} /><Tooltip labelFormatter={(label) => String(label)} formatter={(value, name) => [value, name === "views" ? "Page views" : "Unique visitors"]} contentStyle={{ borderRadius: 12, borderColor: "rgba(0,0,0,.12)", background: "var(--paper)", color: "var(--ink)" }} /><Area type="monotone" dataKey="views" stroke="var(--accent-ink)" strokeWidth={2} fill="url(#views-fill)" /><Area type="monotone" dataKey="unique" stroke="var(--ink)" strokeWidth={1.5} fill="transparent" /></AreaChart></ResponsiveContainer></div>;
}

function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }).format(date);
}
