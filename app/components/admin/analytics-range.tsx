"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function AnalyticsRange({ value }: { value: number }) {
  const router = useRouter();
  return <Select value={String(value)} onValueChange={(next) => router.push(`/admin/analytics?range=${next}`)}><SelectTrigger className="w-40 bg-[var(--paper)]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem></SelectContent></Select>;
}
