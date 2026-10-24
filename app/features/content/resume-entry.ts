import { z } from "zod";
import type { LocalizedText } from "./types";

export const entryKinds = ["EXPERIENCE", "SKILL", "EDUCATION", "CERTIFICATION", "SERVICE"] as const;
export type EntryKind = typeof entryKinds[number];
export const entryLabels: Record<EntryKind, string> = { EXPERIENCE: "Kinh nghiệm", SKILL: "Kỹ năng", EDUCATION: "Học vấn", CERTIFICATION: "Chứng chỉ", SERVICE: "Dịch vụ" };
export const contentStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const safeMediaUrl = z.string().trim().max(500).refine((value) => !value || /^https:\/\//.test(value) || /^\/(?![\/\\])/.test(value), "Dùng URL HTTPS hoặc đường dẫn nội bộ.");
const localizedRequired = z.object({ vi: z.string().trim().min(1).max(240), en: z.string().trim().min(1).max(240) });
const localizedOptional = z.object({ vi: z.string().trim().max(5000), en: z.string().trim().max(5000) });
const month = z.string().regex(/^(?:\d{4}-(?:0[1-9]|1[0-2]))?$/, "Dùng tháng/năm hợp lệ.");
export const resumeEntrySchema = z.object({
  kind: z.enum(entryKinds), title: localizedRequired, subtitle: localizedOptional, body: localizedOptional,
  startDate: month, endDate: month, current: z.boolean(),
  tools: z.array(z.string().trim().min(1).max(80)).max(30),
  logoUrl: safeMediaUrl, evidenceUrl: z.string().trim().max(500).refine((value) => !value || /^https?:\/\//.test(value), "Dùng URL HTTP/HTTPS."),
  projectSlug: z.string().regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/).max(120),
  sortOrder: z.number().int().min(0).max(9999),
}).superRefine((entry, context) => {
  if (entry.current && !entry.startDate) context.addIssue({ code: "custom", path: ["startDate"], message: "Cần tháng bắt đầu." });
  if (entry.current && entry.endDate) context.addIssue({ code: "custom", path: ["endDate"], message: "Bỏ ngày kết thúc khi đang làm." });
  if (entry.endDate && (!entry.startDate || entry.endDate < entry.startDate)) context.addIssue({ code: "custom", path: ["endDate"], message: "Ngày kết thúc phải sau ngày bắt đầu." });
});
export type ResumeEntryInput = z.infer<typeof resumeEntrySchema>;
export type ResumeEntry = ResumeEntryInput & { id: string; status: z.infer<typeof contentStatusSchema>; updatedAt: string };

export function formatEntryPeriod(entry: Pick<ResumeEntryInput, "startDate" | "endDate" | "current">): LocalizedText {
  const format = (value: string) => value ? `${value.slice(5)}/${value.slice(0, 4)}` : "";
  const start = format(entry.startDate);
  if (entry.current) return { vi: `${start} — hiện tại`, en: `${start} — present` };
  const period = entry.endDate ? `${start} — ${format(entry.endDate)}` : start;
  return { vi: period, en: period };
}

export function entryFromRow(row: Record<string, unknown>): ResumeEntry {
  const input = resumeEntrySchema.parse({ kind: row.kind, title: row.title, subtitle: row.subtitle, body: row.body, startDate: row.start_date ?? "", endDate: row.end_date ?? "", current: row.is_current, tools: row.tools, logoUrl: row.logo_url ?? "", evidenceUrl: row.evidence_url ?? "", projectSlug: row.project_slug ?? "", sortOrder: row.sort_order });
  return { ...input, id: String(row.id), status: contentStatusSchema.parse(row.status), updatedAt: String(row.updated_at) };
}
