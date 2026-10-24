import Link from "next/link";
import { OrangeClue } from "../../components/site/orange-clue";
import Image from "next/image";
import { ArrowUpRight, BookOpenText } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "../../components/site/site-footer";
import { SiteHeader } from "../../components/site/site-header";
import { Reveal } from "../../components/site/reveal";
import { getLocale } from "../../features/content/data";
import { getPublicArticles } from "../../features/content/repository";
import { localized } from "../../features/content/types";

export const metadata = { title: "Journal" };

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; topic?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocale(params.lang);
  const articles = await getPublicArticles();
  const topics = ["All", ...new Set(articles.map((article) => article.topic))];
  const copy = locale === "vi";
  const topic = params.topic ?? "All";
  const visible =
    topic === "All"
      ? articles
      : articles.filter((article) => article.topic === topic);
  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <div className="site-shell-light">
      <SiteHeader locale={locale} />
      <main>
        <section className="page-width pb-20 pt-14 md:pb-28 md:pt-28">
          <div className="grid items-end gap-10 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="mono flex items-center gap-3 text-xs uppercase tracking-[.18em] text-black/50">
                <BookOpenText size={16} /> {copy ? "Ghi chép" : "Notes"}
                <OrangeClue folio="journal" locale={locale} />
              </p>
              <h1 className="display mt-6 text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.84]">
                {copy ? "Bài viết" : "Journal"}
              </h1>
            </div>
            <p className="max-w-sm pb-2 text-lg leading-relaxed text-black/65">
              {copy
                ? "Ghi chép về những vấn đề tôi gặp khi làm dự án, kèm ví dụ code và cách xử lý."
                : "Notes on problems I work through while building projects, with code examples and practical explanations."}
            </p>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-y border-black/15 py-4 text-sm">
            {topics.map((item) => (
              <Link
                key={item}
                href={
                  item === "All"
                    ? `/journal?lang=${locale}`
                    : `/journal?lang=${locale}&topic=${encodeURIComponent(item)}`
                }
                className={`focus-ring transition-opacity hover:opacity-60 ${item === topic ? "font-semibold underline decoration-[var(--accent-ink)] decoration-4 underline-offset-8" : "opacity-55"}`}
              >
                {copy && item === "All" ? "Tất cả" : item}
              </Link>
            ))}
          </div>
        </section>
        {!featured && <p role="status" className="page-width pb-16 text-black/60">{copy ? "Chưa có bài viết trong mục này." : "No articles in this category yet."}</p>}
        {featured && (
          <section className="page-width pb-24 md:pb-32">
            <Reveal>
              <Link
                href={`/journal/${featured.slug}?lang=${locale}`}
                className="group grid gap-8 border-t border-black/20 pt-6 md:grid-cols-[.32fr_1.08fr_.9fr] md:gap-12"
              >
                <div className="mono text-xs uppercase tracking-[.16em] text-[var(--accent-ink)]">
                  {featured.date}
                  <br />
                  {featured.topic} / {featured.readingTime}
                </div>
                <div>
                  <h2 className="display max-w-4xl text-5xl font-bold leading-[.86] md:text-7xl">
                    {localized(featured.title, locale)}
                  </h2>
                  <p className="mt-7 max-w-2xl text-xl leading-relaxed text-black/60">
                    {localized(featured.excerpt, locale)}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                    {copy ? "Đọc bài" : "Read note"}
                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </div>
                {featured.cover && (
                  <figure className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-black/5">
                    <Image
                      src={featured.cover.src}
                      alt={localized(featured.cover.alt, locale)}
                      fill
                      sizes="(max-width: 767px) 100vw, 32vw"
                      className="object-cover grayscale-[.15] transition duration-500 group-hover:scale-[1.03]"
                    />
                  </figure>
                )}
              </Link>
            </Reveal>
          </section>
        )}
        <section className="page-width pb-28 md:pb-40">
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {rest.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.08}>
                <Link
                  href={`/journal/${article.slug}?lang=${locale}`}
                  className="group block border-t border-black/20 pt-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="mono text-[10px] uppercase tracking-[.12em] text-black/50">
                      {article.date} / {article.topic}
                    </p>
                    <ArrowUpRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  {article.cover && (
                    <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[10px] bg-black/5">
                      <Image
                        src={article.cover.src}
                        alt={localized(article.cover.alt, locale)}
                        fill
                        sizes="(max-width: 767px) 100vw, 45vw"
                        className="object-cover grayscale-[.15] transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <h2 className="mt-8 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                    {localized(article.title, locale)}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/60">
                    {localized(article.excerpt, locale)}
                  </p>
                  <p className="mono mt-7 text-[10px] uppercase text-black/45">
                    {article.readingTime}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="bg-[var(--ink)] text-[var(--paper)]">
          <div className="page-width grid gap-8 py-20 md:grid-cols-[.7fr_1.3fr] md:py-28">
            <p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent)]">
              {copy ? "Về các bài viết" : "About these notes"}
            </p>
            <div>
              <h2 className="display max-w-4xl text-5xl font-bold leading-[.9] md:text-8xl">
                {copy ? "Ghi lại cách tôi xử lý vấn đề." : "Writing down how I solve things."}
              </h2>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60">
                {copy
                  ? "Tôi ghi lại cách làm, những chỗ dễ sai và lý do chọn một giải pháp. Để lần sau gặp lại còn có chỗ xem, và người đọc có thể thử áp dụng vào dự án của mình."
                  : "I write down the approach, the mistakes to watch for, and why I chose a solution. It gives me something to revisit and readers something to try in their own projects."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
