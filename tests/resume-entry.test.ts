import { describe, expect, it } from "vitest";
import { resumeEntrySchema, formatEntryPeriod } from "../app/features/content/resume-entry";

const entry = { kind: "EXPERIENCE", title: { vi: "Lập trình viên", en: "Engineer" }, subtitle: { vi: "Skipli", en: "Skipli" }, body: { vi: "Phát triển sản phẩm", en: "Product development" }, startDate: "2025-12", endDate: "", current: true, tools: [], logoUrl: "", evidenceUrl: "", projectSlug: "", sortOrder: 0 };
describe("resume entries", () => {
  it("formats current employment in both languages", () => {
    expect(formatEntryPeriod(entry)).toEqual({ vi: "12/2025 — hiện tại", en: "12/2025 — present" });
  });
  it("rejects reversed dates and unsafe evidence URLs", () => {
    expect(resumeEntrySchema.safeParse({ ...entry, current: false, endDate: "2024-01" }).success).toBe(false);
    expect(resumeEntrySchema.safeParse({ ...entry, evidenceUrl: "javascript:alert(1)" }).success).toBe(false);
  });
  it("requires a start date for current experience and valid months", () => {
    expect(resumeEntrySchema.safeParse({ ...entry, startDate: "" }).success).toBe(false);
    expect(resumeEntrySchema.safeParse({ ...entry, startDate: "2025-13" }).success).toBe(false);
  });
  it("accepts skill groups without invented percentages", () => {
    expect(resumeEntrySchema.parse({ ...entry, kind: "SKILL", current: false, startDate: "", tools: ["React", "Next.js"] }).tools).toEqual(["React", "Next.js"]);
  });
});
