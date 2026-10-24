import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Project preview", robots: { index: false, follow: false } };

async function loadProject(id: string) {
  const user = await requireAdmin();
  try {
    const { data } = await createSupabaseAdminClient().from("projects").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

function localized(value: unknown, locale: "vi" | "en") {
  return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : "";
}

type PreviewSection = { heading: unknown; body: unknown };
type PreviewGalleryItem = { src: unknown; alt: unknown };

export default async function ProjectPreview({ params }: { params: Promise<{ id: string }> }) {
  const project = await loadProject((await params).id);
  if (!project) notFound();
  const sections: PreviewSection[] = Array.isArray(project.content) ? project.content as PreviewSection[] : [];
  const gallery: PreviewGalleryItem[] = Array.isArray(project.gallery) ? project.gallery as PreviewGalleryItem[] : [];
  return <main className="min-h-screen bg-[var(--ink)] px-5 py-10 text-[var(--paper)] md:px-10 md:py-16">
    <div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><Link href={`/admin/projects/${project.id}`} className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-white/55 hover:text-white"><ArrowLeft size={15} /> Back to editor</Link><span className="mono rounded-full border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-[var(--accent)]">Private draft preview</span></div>
      <header className="mt-16 grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><p className="mono text-xs uppercase tracking-[.18em] text-[var(--accent)]">{project.category} / {project.year} / {project.status}</p><h1 className="display mt-6 max-w-4xl text-6xl font-bold leading-[.78] md:text-9xl">{project.title}</h1><p className="mt-8 max-w-xl text-xl leading-relaxed text-white/65">{localized(project.summary, "en")}</p></div><div className="media-frame aspect-[16/10] overflow-hidden rounded-[14px] bg-white/10">{project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center mono text-xs uppercase text-white/45">No cover image</div>}</div></header>
      <section className="mt-16 grid gap-12 border-t border-white/15 pt-6 md:grid-cols-[.4fr_1.6fr]"><p className="mono text-xs uppercase tracking-[.16em] text-white/45">Case study / English</p><div className="space-y-12">{sections.length ? sections.map((section, index) => <article key={index} className="border-b border-white/15 pb-10"><p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent)]">{localized(section.heading, "en")}</p><p className="mt-5 max-w-3xl text-3xl leading-tight text-white/85">{localized(section.body, "en")}</p></article>) : <p className="text-white/50">No narrative sections yet.</p>}</div></section>
      {gallery.length > 0 && <section className="mt-16 border-t border-white/15 pt-6"><p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent)]">Gallery</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{gallery.map((item, index) => <figure key={index} className="overflow-hidden rounded-[12px] bg-white/10"><img src={String(item.src)} alt={String(item.alt)} className="aspect-[4/3] w-full object-cover" /><figcaption className="p-4 text-sm text-white/55">{String(item.alt)}</figcaption></figure>)}</div></section>}
      <footer className="mt-16 flex flex-wrap gap-4 border-t border-white/15 pt-6"><Link href={`/admin/projects/${project.id}`} className="button-accent">Edit content <ArrowUpRight size={18} /></Link><span className="mono self-center text-xs text-white/40">Preview is never indexed or publicly linked.</span></footer>
    </div>
  </main>;
}
