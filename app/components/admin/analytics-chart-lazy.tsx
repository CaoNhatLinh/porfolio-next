"use client";

import dynamic from "next/dynamic";
import type { AnalyticsPoint } from "./analytics-chart";

const Chart = dynamic(() => import("./analytics-chart").then((module) => module.AnalyticsChart), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-xl bg-black/5" />,
});

export function AnalyticsChartLazy({ data }: { data: AnalyticsPoint[] }) {
  return <Chart data={data} />;
}
