import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";
import { MarkdownArticle } from "../../../components/site/markdown-article";

export const dynamic = "force-dynamic";
export const metadata = { title: "Article preview", robots: { index: false, follow: false } };

async function loadArticle(id: string) {
  const user = await requireAdmin();
  try {
    const { data } = await createSupabaseAdminClient().from("articles").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

function localized(value: unknown, locale: "vi" | "en") {
  return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : "";
}

export default async function ArticlePreview({ params }: { params: Promise<{ id: string }> }) {
  const article = await loadArticle((await params).id);
  if (!article) notFound();
  return <main className="min-h-screen bg-[var(--paper)] px-5 py-10 text-[var(--ink)] md:px-10 md:py-16"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-center justify-between gap-4"><Link href={`/admin/articles/${article.id}`} className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-black/55 hover:text-black"><ArrowLeft size={15} /> Back to editor</Link><span className="mono rounded-full border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-[var(--accent-ink)]">Private draft preview</span></div><header className="mt-20 border-b border-black/15 pb-12"><p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent-ink)]">{article.topic ?? "Notes"} / {article.status}</p><h1 className="display mt-6 max-w-5xl text-6xl font-bold leading-[.82] md:text-9xl">{localized(article.title, "en")}</h1><p className="mt-8 max-w-2xl text-xl leading-relaxed text-black/60">{localized(article.excerpt, "en")}</p><p className="mono mt-7 text-xs uppercase text-black/45">{article.reading_time ?? "5 min read"}</p>{typeof article.cover_url === "string" && article.cover_url && <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-[10px] bg-black/5"><Image src={article.cover_url} alt="Article cover" fill sizes="(max-width: 767px) 100vw, 80vw" className="object-cover" priority /></div>}</header><article className="mt-16"><MarkdownArticle source={localized(article.body, "en")} /></article><footer className="mt-16 flex flex-wrap gap-4 border-t border-black/15 pt-6"><Link href={`/admin/articles/${article.id}`} className="button-accent">Edit content <ArrowUpRight size={18} /></Link><span className="mono self-center text-xs text-black/40">Preview is never indexed or publicly linked.</span></footer></div></main>;
}
