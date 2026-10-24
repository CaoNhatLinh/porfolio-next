import Link from "next/link";
import { ArrowLeft, Eye } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { saveProjectAction } from "../../actions";
import { ProjectEditorForm, type ProjectEditorValues } from "../../../components/admin/project-editor-form";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";
import { getAdminUser } from "../../../lib/auth/admin";

export const dynamic = "force-dynamic";

async function loadProject(id: string) {
  try {
    const user = await getAdminUser();
    if (!user) return null;
    const { data } = await createSupabaseAdminClient().from("projects").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

function localized(value: unknown, locale: "vi" | "en") {
  return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : "";
}

function arrayOf<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export default async function AdminProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  const project = await loadProject((await params).id);
  if (!project) notFound();

  const values: ProjectEditorValues = {
    id: project.id,
    updatedAt: project.updated_at,
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    duration: project.duration ?? "",
    summary: { vi: localized(project.summary, "vi"), en: localized(project.summary, "en") },
    role: { vi: localized(project.role, "vi"), en: localized(project.role, "en") },
    teamContext: { vi: localized(project.team_context, "vi"), en: localized(project.team_context, "en") },
    stack: arrayOf<string>(project.stack),
    image: project.image_url ?? "",
    imageFit: project.image_fit === "contain" ? "contain" : "cover",
    links: arrayOf<{ label: string; href: string }>(project.links),
    proofLinks: arrayOf<{ label: string; href: string }>(project.proof_links),
    gallery: arrayOf<{ src: string; alt: string }>(project.gallery),
    outcome: { vi: localized(project.outcome, "vi"), en: localized(project.outcome, "en") },
    sections: arrayOf<ProjectEditorValues["sections"] extends (infer T)[] ? T : never>(project.content),
    isFeatured: project.is_featured === true,
    featuredOrder: project.featured_order ?? 0,
    sortOrder: project.sort_order ?? 0,
  };

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/admin/projects" className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-black/50 hover:text-black"><ArrowLeft size={15} /> Projects</Link>
      <Link href={`/preview/projects/${project.id}`} className="focus-ring mono inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-xs uppercase tracking-[.12em] hover:bg-black/5"><Eye size={15} /> Preview draft</Link>
    </div>
    <h1 className="display mt-8 text-6xl font-bold leading-[.8] md:text-8xl">Edit project</h1>
    <ProjectEditorForm values={values} action={saveProjectAction} />
  </div>;
}
