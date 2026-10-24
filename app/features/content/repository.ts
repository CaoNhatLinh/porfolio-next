import { createClient } from "@supabase/supabase-js";
import { articles as fixtureArticles, profile as fixtureProfile, projects as fixtureProjects } from "./data";
import type { Article, LabItem, LocalizedText, Profile, Project } from "./types";

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function localized(value: unknown, fallback: LocalizedText): LocalizedText {
  if (!isRecord(value)) return fallback;
  return { vi: typeof value.vi === "string" ? value.vi : fallback.vi, en: typeof value.en === "string" ? value.en : fallback.en };
}

function links(value: unknown, fallback: Project["links"]): Project["links"] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is Project["links"][number] => isRecord(item) && typeof item.label === "string" && typeof item.href === "string" && /^https?:\/\//.test(item.href));
}

function optionalLinks(value: unknown, fallback: Project["proofLinks"]): Project["proofLinks"] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is NonNullable<Project["proofLinks"]>[number] => isRecord(item) && typeof item.label === "string" && typeof item.href === "string" && (/^https?:\/\//.test(item.href) || item.href.startsWith("/")));
}

function gallery(value: unknown, fallback: Project["gallery"]): Project["gallery"] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is NonNullable<Project["gallery"]>[number] => isRecord(item) && typeof item.src === "string" && typeof item.alt === "string");
}

function sections(value: unknown, fallback: Project["sections"]): Project["sections"] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is Project["sections"][number] => isRecord(item) && isRecord(item.heading) && isRecord(item.body) && (item.tone === "light" || item.tone === "dark" || item.tone === "accent")).map((item, index) => {
    const source = fallback[index] ?? fallback[0];
    return { ...item, heading: localized(item.heading, source?.heading ?? { vi: "", en: "" }), body: localized(item.body, source?.body ?? { vi: "", en: "" }) };
  });
}

function mapProject(row: Record<string, unknown>, fallback: Project): Project {
  return {
    ...fallback,
    slug: typeof row.slug === "string" ? row.slug : fallback.slug,
    title: typeof row.title === "string" ? row.title : fallback.title,
    category: typeof row.category === "string" ? row.category as Project["category"] : fallback.category,
    summary: localized(row.summary, fallback.summary),
    role: localized(row.role, fallback.role),
    duration: typeof row.duration === "string" ? row.duration : fallback.duration,
    teamContext: localized(row.team_context, { vi: "", en: "" }),
    year: typeof row.year === "string" ? row.year : fallback.year,
    stack: Array.isArray(row.stack) ? row.stack.filter((item): item is string => typeof item === "string") : fallback.stack,
    image: typeof row.image_url === "string" && row.image_url ? row.image_url : fallback.image,
    imageFit: row.image_fit === "contain" ? "contain" : row.image_fit === "cover" ? "cover" : fallback.imageFit,
    isFeatured: row.is_featured === true,
    links: links(row.links, fallback.links),
    gallery: gallery(row.gallery, fallback.gallery),
    outcome: localized(row.outcome, fallback.outcome),
    proofLinks: optionalLinks(row.proof_links, fallback.proofLinks),
    sections: sections(row.content, fallback.sections),
  };
}

function mapArticle(row: Record<string, unknown>, fallback: Article): Article {
  const coverUrl = typeof row.cover_url === "string" && row.cover_url ? row.cover_url : fallback.cover?.src;
  return { ...fallback, slug: typeof row.slug === "string" ? row.slug : fallback.slug, title: localized(row.title, fallback.title), excerpt: localized(row.excerpt, fallback.excerpt), body: localized(row.body, fallback.body), topic: typeof row.topic === "string" ? row.topic : fallback.topic, readingTime: typeof row.reading_time === "string" ? row.reading_time : fallback.readingTime, date: typeof row.published_at === "string" ? row.published_at.slice(0, 10) : fallback.date, cover: coverUrl ? { src: coverUrl, alt: fallback.cover?.alt ?? { vi: "Ảnh bìa bài viết", en: "Article cover" }, caption: fallback.cover?.caption } : undefined };
}

export async function getPublicProfile(): Promise<Profile> {
  const client = publicClient();
  if (!client) return fixtureProfile;
  try {
    const { data } = await client.from("site_profile").select("name, title, intro, bio, email, image_url, location, availability, resume_url, resume_updated_at, response_time, engagement_modes, socials, seo").limit(1).maybeSingle();
    if (!data) return fixtureProfile;
    const fallbackAvailability = fixtureProfile.availability ?? { vi: "", en: "" };
    return { ...fixtureProfile, name: typeof data.name === "string" ? data.name : fixtureProfile.name, title: localized(data.title, fixtureProfile.title), intro: localized(data.intro, fixtureProfile.intro), bio: localized(data.bio, fixtureProfile.bio), email: typeof data.email === "string" ? data.email : fixtureProfile.email, image: typeof data.image_url === "string" && data.image_url ? data.image_url : fixtureProfile.image, location: typeof data.location === "string" ? data.location : fixtureProfile.location, availability: localized(data.availability, fallbackAvailability), resumeUrl: typeof data.resume_url === "string" ? data.resume_url : fixtureProfile.resumeUrl, resumeUpdatedAt: typeof data.resume_updated_at === "string" ? data.resume_updated_at : fixtureProfile.resumeUpdatedAt, responseTime: localized(data.response_time, fixtureProfile.responseTime ?? { vi: "", en: "" }), engagementModes: Array.isArray(data.engagement_modes) ? data.engagement_modes.filter((item): item is string => typeof item === "string") : fixtureProfile.engagementModes, socials: links(data.socials, fixtureProfile.socials ?? []), seo: isRecord(data.seo) ? { title: typeof data.seo.title === "string" ? data.seo.title : fixtureProfile.seo?.title, description: typeof data.seo.description === "string" ? data.seo.description : fixtureProfile.seo?.description } : fixtureProfile.seo };
  } catch { return fixtureProfile; }
}

export async function getPublicProjects(): Promise<Project[]> {
  const client = publicClient();
  if (!client) return fixtureProjects;
  try {
    const { data, error } = await client.from("projects").select("slug, title, category, summary, role, duration, team_context, year, stack, image_url, image_fit, is_featured, featured_order, sort_order, links, proof_links, gallery, outcome, content").eq("status", "PUBLISHED").order("is_featured", { ascending: false }).order("featured_order").order("sort_order");
    if (error) throw new Error("Unable to load published projects.");
    return (data ?? []).map((row) => mapProject(row as Record<string, unknown>, fixtureProjects.find((item) => item.slug === row.slug) ?? emptyProject)).filter((project) => project.slug);
  } catch { throw new Error("Unable to load published projects."); }
}

export async function getPublicArticles(): Promise<Article[]> {
  const client = publicClient();
  if (!client) return fixtureArticles;
  try {
    const { data, error } = await client.from("articles").select("slug, title, excerpt, body, topic, reading_time, published_at, cover_url").eq("status", "PUBLISHED").order("published_at", { ascending: false });
    if (error) throw new Error("Unable to load published articles.");
    return (data ?? []).map((row) => mapArticle(row as Record<string, unknown>, fixtureArticles.find((item) => item.slug === row.slug) ?? emptyArticle));
  } catch { throw new Error("Unable to load published articles."); }
}

const emptyText: LocalizedText = { vi: "", en: "" };
const emptyProject: Project = {
  slug: "", title: "", category: "Web application", summary: emptyText,
  role: emptyText, year: "", stack: [], image: "/profile-placeholder.svg",
  isFeatured: false, links: [], outcome: emptyText, sections: [],
};
const emptyArticle: Article = {
  slug: "", title: emptyText, excerpt: emptyText, body: emptyText,
  topic: "", date: "", readingTime: "",
};

export async function getPublicProject(slug: string) { return (await getPublicProjects()).find((project) => project.slug === slug); }
export async function getPublicArticle(slug: string) { return (await getPublicArticles()).find((article) => article.slug === slug); }

export async function getPublicLabItems(): Promise<LabItem[]> {
  const client = publicClient();
  if (!client) return [];
  const { data, error } = await client.from("lab_items").select("slug, title, summary, cover_image, demo_url, repo_url, sort_order").eq("status", "PUBLISHED").order("sort_order");
  if (error) throw new Error("Unable to load published experiments.");
  return (data ?? []).map((row) => ({
    slug: row.slug, title: localized(row.title, emptyText), summary: localized(row.summary, emptyText),
    status: "Live" as const, coverImage: row.cover_image || undefined,
    demoUrl: row.demo_url || undefined, repoUrl: row.repo_url || undefined, sortOrder: row.sort_order,
  }));
}
