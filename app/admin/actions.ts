"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { safeMediaUrl } from "../features/content/resume-entry";
import { getAdminUser } from "../lib/auth/admin";
import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { ActionConflictError, ActionNotFoundError, ActionValidationError, runAction, type ActionResult } from "../lib/errors/action-result";

const idSchema = z.string().uuid();
const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.").max(120);
const categorySchema = z.enum(["Web application", "Mobile application", "Backend system", "Experiment"]);
const localizedSchema = z.object({ vi: z.string().trim().min(1).max(20_000), en: z.string().trim().min(1).max(20_000) });
const optionalLocalizedSchema = z.object({ vi: z.string().trim().max(1000), en: z.string().trim().max(1000) });
const httpUrlSchema = z.string().trim().url().regex(/^https?:\/\//, "Use an HTTP or HTTPS URL.").max(500);
const linksSchema = z.array(z.object({ label: z.string().trim().min(1).max(40), href: httpUrlSchema })).max(20);
const proofLinksSchema = z.array(z.object({ label: z.string().trim().min(1).max(40), href: z.string().trim().refine((value) => /^https?:\/\//.test(value) || /^\/(?![\/\\])/.test(value), "Use an https URL or an internal path.").max(500) })).max(20);
const gallerySchema = z.array(z.object({ src: safeMediaUrl.refine((value) => !!value, "Chọn một ảnh."), alt: z.string().trim().min(1).max(240) })).max(30);
const sectionsSchema = z.array(z.object({ heading: localizedSchema.extend({ vi: z.string().trim().min(1).max(180), en: z.string().trim().min(1).max(180) }), body: localizedSchema, tone: z.enum(["light", "dark", "accent"]) })).max(20);
const socialsSchema = linksSchema;
const labStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const labUrlSchema = z.string().trim().refine((value) => !value || /^https?:\/\//.test(value) || value.startsWith("#"), "Use an https URL or an anchor.").max(500);

async function actor() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

async function audit(action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
  const user = await actor();
  try { await createSupabaseAdminClient().from("audit_logs").insert({ actor_id: user.id, action, entity_type: entityType, entity_id: entityId, metadata }); } catch { /* audit failure must not break the edit */ }
}

function text(formData: FormData, name: string, max: number, required = true) {
  const schema = required ? z.string().trim().min(1).max(max) : z.string().trim().max(max);
  return schema.parse(formData.get(name) ?? "");
}

function json<T>(formData: FormData, name: string, schema: z.ZodType<T>, fallback: T) {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return fallback;
  try {
    return schema.parse(JSON.parse(raw));
  } catch (error) {
    if (error instanceof z.ZodError) throw error;
    throw new ActionValidationError(`Invalid JSON in ${name}.`);
  }
}

function order(formData: FormData, name = "sortOrder") { return z.coerce.number().int().min(0).max(9999).parse(formData.get(name) ?? 0); }

async function ensureSlugAvailable(table: "projects" | "articles" | "lab_items", slug: string, currentId?: string) {
  const query = createSupabaseAdminClient().from(table).select("id").eq("slug", slug).maybeSingle();
  const { data, error } = await query;
  if (error) throw new Error("Unable to validate slug.");
  if (data?.id && data.id !== currentId) throw new ActionConflictError();
}

export async function setProjectFeaturedAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const featured = formData.get("featured") === "true";
    const featuredOrder = order(formData, "order");
    const user = await actor();
    const { data, error } = await createSupabaseAdminClient().from("projects").update({ is_featured: featured, featured_order: featured ? featuredOrder : 0, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) throw new Error("Unable to update project.");
    if (!data) throw new ActionNotFoundError();
    await audit(featured ? "feature" : "unfeature", "project", id);
    revalidatePath("/admin/projects");
    revalidatePath("/work", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

export async function setProjectFeaturedFormAction(formData: FormData): Promise<void> { await setProjectFeaturedAction(formData); }

export async function setProjectSortOrderAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const sortOrder = order(formData);
    const user = await actor();
    const { data, error } = await createSupabaseAdminClient().from("projects").update({ sort_order: sortOrder, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) throw new Error("Unable to update project order.");
    if (!data) throw new ActionNotFoundError();
    await audit("reorder", "project", id, { sortOrder });
    revalidatePath("/admin/projects");
    revalidatePath("/work", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

export async function setProjectSortOrderFormAction(formData: FormData): Promise<void> { await setProjectSortOrderAction(formData); }

export async function archiveProjectAction(formData: FormData): Promise<ActionResult<void>> { return updateProjectStatus(formData, "ARCHIVED"); }
export async function restoreProjectAction(formData: FormData): Promise<ActionResult<void>> { return updateProjectStatus(formData, "DRAFT"); }
export async function archiveProjectFormAction(formData: FormData): Promise<void> { await archiveProjectAction(formData); }
export async function restoreProjectFormAction(formData: FormData): Promise<void> { await restoreProjectAction(formData); }

async function updateProjectStatus(formData: FormData, status: "ARCHIVED" | "DRAFT") {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const user = await actor();
    const { data, error } = await createSupabaseAdminClient().from("projects").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) throw new Error("Unable to update project status.");
    if (!data) throw new ActionNotFoundError();
    await audit(status === "ARCHIVED" ? "archive" : "restore", "project", id);
    revalidatePath("/admin/projects");
    revalidatePath("/work", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

export async function publishProjectAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const published = formData.get("published") === "true";
    const user = await actor();
    const { data, error } = await createSupabaseAdminClient().from("projects").update({ status: published ? "PUBLISHED" : "DRAFT", updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) throw new Error("Unable to update project publication.");
    if (!data) throw new ActionNotFoundError();
    await audit(published ? "publish" : "unpublish", "project", id);
    revalidatePath("/admin/projects");
    revalidatePath("/work", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

export async function publishProjectFormAction(formData: FormData): Promise<void> { await publishProjectAction(formData); }

export async function createProjectAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const user = await actor();
    const slug = slugSchema.parse(formData.get("slug"));
    await ensureSlugAvailable("projects", slug);
    const payload = projectPayload(formData, user.id);
    const { data, error } = await createSupabaseAdminClient().from("projects").insert({ slug, ...payload, status: "DRAFT" }).select("id").single();
    if (error || !data) throw new Error("Unable to create project.");
    await audit("create", "project", data.id);
    revalidatePath("/admin/projects");
  });
}

export async function saveProjectAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const user = await actor();
    const slug = slugSchema.parse(formData.get("slug"));
    await ensureSlugAvailable("projects", slug, id);
    const expectedUpdatedAt = z.string().datetime().parse(formData.get("expectedUpdatedAt"));
    const payload = projectPayload(formData, user.id);
    const { data, error } = await createSupabaseAdminClient().from("projects").update({ slug, ...payload, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("updated_at", expectedUpdatedAt).select("id").maybeSingle();
    if (error) throw new Error("Unable to save project.");
    if (!data) throw new ActionConflictError();
    await audit("update", "project", id);
    revalidatePath("/admin/projects");
    revalidatePath(`/work/${slug}`);
    revalidatePath("/work", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

function projectPayload(formData: FormData, ownerId: string) {
  return { owner_id: ownerId, title: text(formData, "title", 160), category: categorySchema.parse(formData.get("category")), year: text(formData, "year", 20), duration: text(formData, "duration", 80, false) || null, summary: localizedSchema.parse({ vi: text(formData, "summaryVi", 500), en: text(formData, "summaryEn", 500) }), role: localizedSchema.parse({ vi: text(formData, "roleVi", 180), en: text(formData, "roleEn", 180) }), team_context: optionalLocalizedSchema.parse({ vi: text(formData, "teamContextVi", 180, false), en: text(formData, "teamContextEn", 180, false) }), stack: text(formData, "stack", 500).split(",").map((item) => item.trim()).filter(Boolean).slice(0, 20), image_url: safeMediaUrl.parse(text(formData, "imageUrl", 500, false)) || null, image_fit: z.enum(["cover", "contain"]).parse(formData.get("imageFit") ?? "cover"), outcome: localizedSchema.parse({ vi: text(formData, "outcomeVi", 500), en: text(formData, "outcomeEn", 500) }), links: json(formData, "linksJson", linksSchema, []), proof_links: json(formData, "proofLinksJson", proofLinksSchema, []), gallery: json(formData, "galleryJson", gallerySchema, []), content: json(formData, "sectionsJson", sectionsSchema, []), featured_order: order(formData, "featuredOrder"), sort_order: order(formData), is_featured: formData.get("isFeatured") === "true" };
}

export async function updateMessageStatusAction(formData: FormData): Promise<ActionResult<void>> { return runAction(async () => { const id = idSchema.parse(formData.get("id")); const status = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]).parse(formData.get("status")); await actor(); const { error } = await createSupabaseAdminClient().from("contact_messages").update({ status }).eq("id", id); if (error) throw new Error("Unable to update message."); await audit("status_change", "contact_message", id, { status }); revalidatePath("/admin/messages"); }); }
export async function updateMessageStatusFormAction(formData: FormData): Promise<void> { await updateMessageStatusAction(formData); }

export async function saveLabItemAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id"));
    const user = await actor();
    const expectedUpdatedAt = z.string().datetime().optional().parse(formData.get("expectedUpdatedAt") || undefined);
    const payload = labPayload(formData, user.id);
    let query = createSupabaseAdminClient().from("lab_items").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id);
    if (expectedUpdatedAt) query = query.eq("updated_at", expectedUpdatedAt);
    const { data, error } = await query.select("id").maybeSingle();
    if (error) throw new Error("Unable to save Lab item.");
    if (!data) throw new ActionConflictError();
    await audit("update", "lab_item", id);
    revalidatePath("/admin/lab"); revalidatePath("/about");
  });
}

export async function createLabItemAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const user = await actor();
    const slug = slugSchema.parse(formData.get("slug"));
    await ensureSlugAvailable("lab_items", slug);
    const payload = labPayload(formData, user.id);
    const { data, error } = await createSupabaseAdminClient().from("lab_items").insert({ slug, ...payload, owner_id: user.id, status: "DRAFT" }).select("id").single();
    if (error || !data) throw new Error("Unable to create Lab item.");
    await audit("create", "lab_item", data.id);
    revalidatePath("/admin/lab");
  });
}

function labPayload(formData: FormData, ownerId: string) {
  return { owner_id: ownerId, title: localizedSchema.parse({ vi: text(formData, "titleVi", 180), en: text(formData, "titleEn", 180) }), summary: localizedSchema.parse({ vi: text(formData, "summaryVi", 500), en: text(formData, "summaryEn", 500) }), status: labStatusSchema.parse(formData.get("status") ?? "DRAFT"), cover_image: text(formData, "coverImage", 500, false) || null, demo_url: labUrlSchema.parse(text(formData, "demoUrl", 500, false)) || null, repo_url: labUrlSchema.parse(text(formData, "repoUrl", 500, false)) || null, sort_order: order(formData) };
}

export async function saveProfileAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const user = await actor();
    const engagementModes = text(formData, "engagementModes", 300, false).split(",").map((item) => item.trim()).filter(Boolean).slice(0, 10);
    const payload = { owner_id: user.id, name: text(formData, "name", 120), title: localizedSchema.parse({ vi: text(formData, "titleVi", 180), en: text(formData, "titleEn", 180) }), intro: localizedSchema.parse({ vi: text(formData, "introVi", 500), en: text(formData, "introEn", 500) }), bio: localizedSchema.parse({ vi: text(formData, "bioVi", 1000), en: text(formData, "bioEn", 1000) }), email: z.string().email().parse(formData.get("email")), image_url: text(formData, "imageUrl", 500, false) || null, location: text(formData, "location", 180, false) || null, availability: localizedSchema.parse({ vi: text(formData, "availabilityVi", 180), en: text(formData, "availabilityEn", 180) }), response_time: optionalLocalizedSchema.parse({ vi: text(formData, "responseTimeVi", 180, false), en: text(formData, "responseTimeEn", 180, false) }), engagement_modes: engagementModes, socials: json(formData, "socialsJson", socialsSchema, []), seo: { title: text(formData, "seoTitle", 180, false), description: text(formData, "seoDescription", 300, false) }, updated_at: new Date().toISOString() };
    const supabase = createSupabaseAdminClient();
    const { data: current, error: lookupError } = await supabase.from("site_profile").select("id").eq("owner_id", user.id).maybeSingle();
    if (lookupError) throw new Error("Unable to load the profile before saving.");
    const result = current?.id ? await supabase.from("site_profile").update(payload).eq("id", current.id).eq("owner_id", user.id).select("id").maybeSingle() : await supabase.from("site_profile").insert(payload).select("id").single();
    if (result.error || !result.data) throw new Error("Unable to save profile.");
    await audit("update", "site_profile", result.data.id);
    revalidatePath("/admin/profile"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/resume"); revalidatePath("/hire"); revalidatePath("/contact");
  });
}

export async function publishArticleAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id")); const published = formData.get("published") === "true"; const user = await actor();
    const { data, error } = await createSupabaseAdminClient().from("articles").update({ status: published ? "PUBLISHED" : "DRAFT", published_at: published ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) throw new Error("Unable to update article."); if (!data) throw new ActionNotFoundError(); await audit(published ? "publish" : "unpublish", "article", id); revalidatePath("/admin/articles"); revalidatePath("/journal", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}
export async function publishArticleFormAction(formData: FormData): Promise<void> { await publishArticleAction(formData); }

export async function archiveArticleAction(formData: FormData): Promise<ActionResult<void>> { return updateArticleStatus(formData, "ARCHIVED"); }
export async function restoreArticleAction(formData: FormData): Promise<ActionResult<void>> { return updateArticleStatus(formData, "DRAFT"); }
export async function archiveArticleFormAction(formData: FormData): Promise<void> { await archiveArticleAction(formData); }
export async function restoreArticleFormAction(formData: FormData): Promise<void> { await restoreArticleAction(formData); }

async function updateArticleStatus(formData: FormData, status: "ARCHIVED" | "DRAFT") { return runAction(async () => { const id = idSchema.parse(formData.get("id")); const user = await actor(); const { data, error } = await createSupabaseAdminClient().from("articles").update({ status, published_at: null, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle(); if (error) throw new Error("Unable to update article status."); if (!data) throw new ActionNotFoundError(); await audit(status === "ARCHIVED" ? "archive" : "restore", "article", id); revalidatePath("/admin/articles"); revalidatePath("/journal", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml"); }); }

export async function createArticleAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const user = await actor(); const slug = slugSchema.parse(formData.get("slug")); await ensureSlugAvailable("articles", slug);
    const payload = articlePayload(formData);
    const { data, error } = await createSupabaseAdminClient().from("articles").insert({ owner_id: user.id, slug, ...payload, status: "DRAFT" }).select("id").single();
    if (error || !data) throw new Error("Unable to create article."); await audit("create", "article", data.id); revalidatePath("/admin/articles");
  });
}

export async function saveArticleAction(formData: FormData): Promise<ActionResult<void>> {
  return runAction(async () => {
    const id = idSchema.parse(formData.get("id")); const user = await actor(); const slug = slugSchema.parse(formData.get("slug")); await ensureSlugAvailable("articles", slug, id); const expectedUpdatedAt = z.string().datetime().parse(formData.get("expectedUpdatedAt"));
    const { data, error } = await createSupabaseAdminClient().from("articles").update({ slug, ...articlePayload(formData), updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("updated_at", expectedUpdatedAt).select("id").maybeSingle();
    if (error) throw new Error("Unable to save article."); if (!data) throw new ActionConflictError(); await audit("update", "article", id); revalidatePath("/admin/articles"); revalidatePath(`/journal/${slug}`); revalidatePath("/journal", "layout"); revalidatePath("/"); revalidatePath("/sitemap.xml");
  });
}

function articlePayload(formData: FormData) { return { title: localizedSchema.parse({ vi: text(formData, "titleVi", 240), en: text(formData, "titleEn", 240) }), excerpt: localizedSchema.parse({ vi: text(formData, "excerptVi", 500), en: text(formData, "excerptEn", 500) }), body: localizedSchema.parse({ vi: text(formData, "bodyVi", 20_000), en: text(formData, "bodyEn", 20_000) }), topic: text(formData, "topic", 80), reading_time: text(formData, "readingTime", 30), cover_url: safeMediaUrl.parse(text(formData, "coverUrl", 500, false)) || null }; }
