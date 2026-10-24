import Link from "next/link";
import { ArrowLeft, Eye } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { saveArticleAction } from "../../actions";
import { ArticleEditorForm, type ArticleEditorValues } from "../../../components/admin/article-editor-form";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";
import { getAdminUser } from "../../../lib/auth/admin";

export const dynamic = "force-dynamic";

async function loadArticle(id: string) {
  try {
    const user = await getAdminUser();
    if (!user) return null;
    const { data } = await createSupabaseAdminClient().from("articles").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

function localized(value: unknown, locale: "vi" | "en") {
  return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : "";
}

export default async function AdminArticleEditor({ params }: { params: Promise<{ id: string }> }) {
  const article = await loadArticle((await params).id);
  if (!article) notFound();
  const values: ArticleEditorValues = {
    id: article.id,
    updatedAt: article.updated_at,
    slug: article.slug,
    title: { vi: localized(article.title, "vi"), en: localized(article.title, "en") },
    topic: article.topic ?? "Notes",
    readingTime: article.reading_time ?? "5 min read",
    coverUrl: typeof article.cover_url === "string" ? article.cover_url : "",
    excerpt: { vi: localized(article.excerpt, "vi"), en: localized(article.excerpt, "en") },
    body: { vi: localized(article.body, "vi"), en: localized(article.body, "en") },
  };
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4"><Link href="/admin/articles" className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-black/50 hover:text-black"><ArrowLeft size={15} /> Articles</Link><Link href={`/preview/articles/${article.id}`} className="focus-ring mono inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-xs uppercase tracking-[.12em] hover:bg-black/5"><Eye size={15} /> Preview draft</Link></div>
    <h1 className="display mt-8 text-6xl font-bold leading-[.8] md:text-8xl">Edit article</h1>
    <ArticleEditorForm values={values} action={saveArticleAction} />
  </div>;
}
