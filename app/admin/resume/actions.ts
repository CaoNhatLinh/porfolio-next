"use server";
import { z } from "zod";
import { resumeEntrySchema } from "../../features/content/resume-entry";
import { ActionConflictError, runAction } from "../../lib/errors/action-result";
import { cmsActor, recordCmsAudit, refreshPortfolio } from "../cms-access";

export async function saveResumeEntryAction(form: FormData) {
  return runAction(async () => {
    const { user, database } = await cmsActor();
    const input = resumeEntrySchema.parse({ kind: form.get("kind"), title: { vi: form.get("titleVi"), en: form.get("titleEn") }, subtitle: { vi: form.get("subtitleVi") ?? "", en: form.get("subtitleEn") ?? "" }, body: { vi: form.get("bodyVi") ?? "", en: form.get("bodyEn") ?? "" }, startDate: form.get("startDate") ?? "", endDate: form.get("endDate") ?? "", current: form.get("current") === "true", tools: String(form.get("tools") ?? "").split(",").map((item) => item.trim()).filter(Boolean), logoUrl: form.get("logoUrl") ?? "", evidenceUrl: form.get("evidenceUrl") ?? "", projectSlug: form.get("projectSlug") ?? "", sortOrder: Number(form.get("sortOrder") ?? 0) });
    const payload = { owner_id: user.id, kind: input.kind, title: input.title, subtitle: input.subtitle, body: input.body, tools: input.tools, start_date: input.startDate || null, end_date: input.endDate || null, is_current: input.current, logo_url: input.logoUrl || null, evidence_url: input.evidenceUrl || null, project_slug: input.projectSlug || null, sort_order: input.sortOrder, updated_at: new Date().toISOString() };
    const rawId = form.get("id");
    const id = rawId ? z.string().uuid().parse(rawId) : undefined;
    const result = id
      ? await database.from("resume_entries").update(payload).eq("id", id).eq("owner_id", user.id).eq("updated_at", z.string().datetime().parse(form.get("expectedUpdatedAt"))).select("id").maybeSingle()
      : await database.from("resume_entries").insert({ ...payload, status: "DRAFT" }).select("id").single();
    if (result.error) throw new Error("Unable to save resume entry.");
    if (!result.data) throw new ActionConflictError();
    await recordCmsAudit(id ? "update" : "create", "resume_entry", result.data.id, user.id);
    refreshPortfolio();
  });
}
