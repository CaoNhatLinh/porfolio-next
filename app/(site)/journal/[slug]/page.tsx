import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/site/site-footer";
import { SiteHeader } from "../../../components/site/site-header";
import { MarkdownArticle } from "../../../components/site/markdown-article";
import { articles as fixtureArticles, getLocale } from "../../../features/content/data";
import { getPublicArticle, getPublicArticles } from "../../../features/content/repository";
import { localized } from "../../../features/content/types";

export function generateStaticParams() { return fixtureArticles.map((article) => ({ slug: article.slug })); }

export default async function ArticlePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const locale = getLocale((await searchParams).lang);
  const articles = await getPublicArticles();
  const article = await getPublicArticle(slug);
  if (!article) notFound();
  const copy = locale === "vi";
  const position = articles.findIndex((item) => item.slug === slug);
  const next = articles[(position + 1) % articles.length] ?? articles[0];

  return <div className="site-shell-light">
    <SiteHeader locale={locale} />
    <main>
      <section className="page-width pb-20 pt-14 md:pb-28 md:pt-24"><Link href={`/journal?lang=${locale}`} className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.16em] text-black/55 hover:text-black"><ArrowLeft size={15} /> {copy ? "Tất cả bài viết" : "All journal notes"}</Link><div className="mt-14 grid gap-10 md:grid-cols-[.38fr_1.62fr]"><div className="mono text-xs uppercase tracking-[.14em] text-[var(--accent-ink)]">{article.date}<br />{article.topic}<br />{article.readingTime}</div><div><h1 className="display max-w-5xl text-5xl font-bold leading-[.84] md:text-8xl">{localized(article.title, locale)}</h1><p className="mt-8 max-w-2xl text-xl leading-relaxed text-black/60 md:text-2xl">{localized(article.excerpt, locale)}</p></div></div>{article.cover && <figure className="mt-14 md:ml-[38%] md:w-[62%]"><div className="relative aspect-[16/8] overflow-hidden rounded-[10px] bg-black/5"><Image src={article.cover.src} alt={localized(article.cover.alt, locale)} fill sizes="(max-width: 767px) 100vw, 62vw" className="object-cover" priority /></div>{article.cover.caption && <figcaption className="mono mt-3 max-w-xl text-[10px] uppercase leading-relaxed tracking-[.08em] text-black/45">{localized(article.cover.caption, locale)}</figcaption>}</figure>}</section>
      <section className="border-y border-black/15 bg-[#e9ebe2]"><div className="page-width grid gap-10 py-16 md:grid-cols-[.38fr_1.62fr] md:py-24"><p className="mono text-xs uppercase tracking-[.16em] text-black/50">{copy ? "Góc nhìn" : "A point of view"}</p><article><MarkdownArticle source={localized(article.body, locale)} /></article></div></section>
      <section className="page-width py-20 md:py-28"><Link href={`/journal/${next.slug}?lang=${locale}`} className="group grid gap-5 border-t border-black/20 pt-5 md:grid-cols-[.38fr_1.62fr]"><p className="mono text-xs uppercase tracking-[.16em] text-black/50">{copy ? "Đọc tiếp" : "Read next"}</p><div className="flex items-end justify-between gap-8"><h2 className="display max-w-4xl text-4xl font-bold leading-[.88] md:text-7xl">{localized(next.title, locale)}</h2><ArrowUpRight size={28} className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></Link></section>
    </main>
    <SiteFooter locale={locale} />
  </div>;
}
