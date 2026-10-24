import { createClient } from "@supabase/supabase-js";
import { resumeExperience, resumeCapabilities, type ResumeExperience } from "./resume";
import { entryFromRow, formatEntryPeriod, type ResumeEntry } from "./resume-entry";
import type { LocalizedText } from "./types";

type Capability = { name: string; title: LocalizedText; detail: LocalizedText; tools: string[] };
export async function getPublicResume(): Promise<{ experiences: ResumeExperience[]; capabilities: Capability[]; education: ResumeEntry[]; certifications: ResumeEntry[]; services: ResumeEntry[] }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { experiences: resumeExperience, capabilities: resumeCapabilities, education: [], certifications: [], services: [] };
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.from("resume_entries").select("id, kind, title, subtitle, body, start_date, end_date, is_current, tools, logo_url, evidence_url, project_slug, sort_order, status, updated_at").eq("status", "PUBLISHED").order("sort_order").order("id");
  if (error) throw new Error("Unable to load published resume entries.");
  const entries = (data ?? []).map(entryFromRow);
  return {
    experiences: entries.filter((item) => item.kind === "EXPERIENCE").map((item) => ({ id: item.id, title: item.title, context: item.subtitle, description: item.body, period: formatEntryPeriod(item), projectSlug: item.projectSlug || undefined, evidenceUrl: item.evidenceUrl || undefined, logoUrl: item.logoUrl || undefined })),
    capabilities: entries.filter((item) => item.kind === "SKILL").map((item) => ({ name: item.id, title: item.title, detail: item.body, tools: item.tools })),
    education: entries.filter((item) => item.kind === "EDUCATION"), certifications: entries.filter((item) => item.kind === "CERTIFICATION"), services: entries.filter((item) => item.kind === "SERVICE"),
  };
}
