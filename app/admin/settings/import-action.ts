"use server";
import { createHash } from "node:crypto";
import { profile, projects } from "../../features/content/data";
import { resumeExperience, resumeCapabilities } from "../../features/content/resume";
import { cmsActor, recordCmsAudit, refreshPortfolio } from "../cms-access";
import { ActionValidationError, runAction } from "../../lib/errors/action-result";

function stableId(owner: string, key: string) { const hash = createHash("sha256").update(`${owner}:${key}`).digest("hex"); return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`; }
export async function importSourceContentAction(form: FormData) {
  return runAction(async () => {
    if (form.get("confirmation") !== "NHẬP") throw new ActionValidationError("Nhập NHẬP để xác nhận. Nội dung đã chỉnh sẽ không bị ghi đè.");
    const { user, database } = await cmsActor();
    const initialProfile = { owner_id: user.id, name: profile.name, title: profile.title, intro: profile.intro, bio: profile.bio, email: profile.email, image_url: profile.image, location: profile.location, availability: profile.availability, response_time: profile.responseTime, engagement_modes: profile.engagementModes, socials: profile.socials, seo: profile.seo };
    const initialProjects = projects.map((item, index) => ({ owner_id: user.id, slug: item.slug, title: item.title, category: item.category, year: item.year, duration: item.duration, team_context: item.teamContext, summary: item.summary, role: item.role, stack: item.stack, image_url: item.image, image_fit: item.imageFit ?? "cover", outcome: item.outcome, links: item.links, proof_links: item.proofLinks ?? [], gallery: item.gallery ?? [], content: item.sections, is_featured: item.isFeatured, featured_order: index, sort_order: index, status: "DRAFT" }));
    const initialResume = [
      ...resumeExperience.map((item, index) => ({ owner_id: user.id, id: stableId(user.id, `experience-${index}`), kind: "EXPERIENCE", title: item.title, subtitle: item.context, body: item.description, start_date: index === 0 ? "2025-12" : `${item.period.en}-01`, end_date: null, is_current: index === 0, project_slug: item.projectSlug ?? null, evidence_url: item.evidenceUrl ?? null, sort_order: index, status: "DRAFT" })),
      ...resumeCapabilities.map((item, index) => ({ owner_id: user.id, id: stableId(user.id, `skill-${index}`), kind: "SKILL", title: item.title, body: item.detail, tools: item.tools, sort_order: index, status: "DRAFT" })),
    ];
    const batches: { table: string; rows: Record<string, unknown>[]; conflict: string }[] = [{ table: "site_profile", rows: [initialProfile], conflict: "owner_id" }, { table: "projects", rows: initialProjects, conflict: "slug" }, { table: "resume_entries", rows: initialResume, conflict: "id" }];
    for (const batch of batches) {
      const { error } = await database.from(batch.table).upsert(batch.rows, { onConflict: batch.conflict, ignoreDuplicates: true });
      if (error) throw new Error(`Unable to import ${batch.table}.`);
    }
    await recordCmsAudit("import_missing_source", "portfolio", user.id, user.id); refreshPortfolio();
  });
}
