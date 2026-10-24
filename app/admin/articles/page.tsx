import Link from "next/link";
import { ArrowUpRight, Check, FileText, Plus } from "@phosphor-icons/react/dist/ssr";
import { ContentControls } from "../../components/admin/content-controls";
import { ListToolbar, Pagination } from "../../components/admin/list-toolbar";
import { listParams, searchPattern } from "../list-query";
import { Button } from "../../components/ui/button";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";
import { getAdminUser } from "../../lib/auth/admin";

export const dynamic = "force-dynamic";

async function loadArticles(params: ReturnType<typeof listParams>) {
    const user = await getAdminUser();
    if (!user) throw new Error("Unauthorized");
    let query = createSupabaseAdminClient().from("articles").select("id, slug, title, topic, status, published_at, updated_at", { count: "exact" }).eq("owner_id", user.id).order("updated_at", { ascending: false }).order("id");
    if (params.status) query = query.eq("status", params.status);
    if (params.q) query = query.ilike("title->>vi", searchPattern(params.q));
    const { data, count, error } = await query.range((params.page - 1) * 20, params.page * 20 - 1);
    if (error) throw new Error("Unable to load articles.");
    return { articles: data ?? [], total: count ?? 0 };
}

function titleOf(value: unknown, fallback: string) {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).en === "string" ? String((value as Record<string, unknown>).en) : fallback;
}

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; status?: string }> }) {
  const params = listParams(await searchParams);
  const { articles, total } = await loadArticles(params);
  return <div>
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="mono text-xs uppercase tracking-[.15em] text-black/60">Nội dung / Journal</p><h1 className="text-4xl font-semibold">Bài viết</h1></div><Link href="/admin/articles/new" className="button-accent"><Plus size={16} /> Viết bài mới</Link></header>
    <ListToolbar q={params.q} status={params.status} />
    <div className="mt-12 overflow-hidden rounded-[14px] border border-black/10 bg-[var(--paper)]">
      {articles.length === 0 ? <div className="p-8"><FileText size={20} className="text-[var(--accent-ink)]" /><p className="mt-4 max-w-md text-sm text-black/60">Chưa có bài viết phù hợp. Thêm bản nháp hoặc điều chỉnh bộ lọc.</p></div> : articles.map((article) => <ArticleRow key={article.id} article={article} />)}
    </div>
    <Pagination page={params.page} total={total} base="/admin/articles" params={{ q: params.q, status: params.status }} />
  </div>;
}

function ArticleRow({ article }: { article: { id: string; slug: string; title: unknown; topic: string | null; status: string; published_at: string | null; updated_at: string } }) {
  return <div className="grid gap-4 border-b border-black/10 p-5 last:border-b-0 md:grid-cols-[1.3fr_.65fr_auto] md:items-center">
    <div><Link href={`/admin/articles/${article.id}`} className="group inline-flex items-center gap-2 text-lg font-medium">{titleOf(article.title, article.slug)}<ArrowUpRight size={15} className="opacity-0 transition-opacity group-hover:opacity-100" /></Link><p className="mono mt-1 text-[10px] uppercase text-black/45">{article.topic ?? "Notes"} / {article.status}</p></div>
    <p className="text-sm text-black/50">{article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB") : "Not published"}</p>
    <ContentControls table="articles" id={article.id} status={article.status} updatedAt={article.updated_at} />
  </div>;
}
