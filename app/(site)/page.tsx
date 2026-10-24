import Image from "next/image";
import { OrangeClue } from "../components/site/orange-clue";
import {
  ArrowDown,
  ArrowUpRight,
  GithubLogo,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "../components/site/site-footer";
import { SiteHeader } from "../components/site/site-header";
import { ProjectCard } from "../components/site/project-card";
import { ProjectSignalBoard } from "../components/site/project-signal-board";
import { Reveal } from "../components/site/reveal";
import { getLocale } from "../features/content/data";
import {
  getPublicArticles,
  getPublicProfile,
  getPublicProjects,
} from "../features/content/repository";
import { localized } from "../features/content/types";

export const revalidate = 60;

const workPracticesByLocale = {
  vi: [
    {
      title: "Chốt đúng vấn đề",
      description:
        "Tôi làm rõ người dùng, luồng chính, dữ liệu và các trạng thái cần xử lý. Câu hỏi chưa có đáp án được ghi lại, không âm thầm biến thành giả định.",
    },
    {
      title: "Giải quyết phần khó trước",
      description:
        "Tôi kiểm tra sớm những phần dễ làm trễ dự án: quyền truy cập, tích hợp, hiệu năng và dữ liệu. Mỗi thay đổi được chia đủ nhỏ để cả nhóm xem xét kỹ.",
    },
    {
      title: "Bàn giao để người khác tiếp tục",
      description:
        "Tôi hoàn thiện cả trạng thái lỗi, kiểm thử và ghi chú kỹ thuật cần thiết. Người tiếp theo có thể hiểu quyết định mà không phải đọc lại toàn bộ lịch sử dự án.",
    },
  ],
  en: [
    {
      title: "Define the actual problem",
      description:
        "I clarify the user, main flow, data, and states the product needs. Open questions are recorded instead of quietly turned into assumptions.",
    },
    {
      title: "Test the risky parts early",
      description:
        "I validate the parts most likely to delay delivery: permissions, integrations, performance, and data. Changes stay small enough for a proper review.",
    },
    {
      title: "Hand off work others can continue",
      description:
        "I finish the failure states, tests, and useful technical notes. The next person can understand the decisions without reconstructing the project history.",
    },
  ],
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const [profile, projects, articles] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicArticles(),
  ]);
  const featured =
    projects.find((project) => project.isFeatured) ?? projects[0];
  const copy = locale === "vi";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: localized(profile.title, locale),
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    email: profile.email,
    sameAs: (profile.socials ?? []).map((social) => social.href),
  };
  return (
    <div className="site-shell-dark">
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <section className="relative isolate min-h-[100dvh] overflow-hidden">
          <SiteHeader locale={locale} dark />
          <div className="orbit -right-40 top-20 h-[42rem] w-[42rem]" />
          <div className="orbit -bottom-64 left-1/3 h-[34rem] w-[34rem]" />
          <div className="page-width relative grid min-h-[calc(100dvh-88px)] items-center gap-12 pb-16 pt-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-[1] max-w-3xl">
              <Reveal>
                <p className="mono mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[.16em] text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />{" "}
                  {localized(profile.title, locale)}{" "}
                  <span className="text-white/35">/</span><OrangeClue folio="home" locale={locale} />{" "}
                  {localized(
                    profile.availability ?? { vi: "", en: "" },
                    locale,
                  )}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="display max-w-4xl text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.86]">
                  {copy ? "Lập trình viên." : "Full-stack developer."}
                  <br />
                  <span className="text-white/45">{copy ? "Web và mobile." : "Web and mobile."}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-9 max-w-lg text-lg leading-relaxed text-[var(--muted-dark)]">
                  {localized(profile.intro, locale)}{" "}
                  {localized(profile.bio, locale)}
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    className="button-accent focus-ring"
                    href={`/work?lang=${locale}`}
                  >
                    {copy ? "Xem dự án" : "View the work"}
                    <ArrowUpRight size={18} weight="bold" />
                  </a>
                  <a
                    className="button-quiet focus-ring"
                    href={`/resume?lang=${locale}`}
                  >
                    {copy ? "Xem CV" : "View my CV"}
                    <ArrowDown size={18} />
                  </a>
                  <a
                    className="button-quiet focus-ring"
                    href="https://github.com/CaoNhatLinh"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubLogo size={19} weight="fill" />
                    {copy ? "Xem GitHub" : "View GitHub"}
                    <ArrowUpRight size={16} weight="bold" />
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal
              delay={0.18}
              className="relative min-h-[30rem] lg:min-h-[38rem]"
            >
              <div className="absolute right-[8%] top-[8%] h-[72%] w-[67%] overflow-hidden rounded-[46%_54%_50%_48%/45%_38%_62%_55%] border border-white/20 bg-[var(--ink-soft)]">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover grayscale contrast-125"
                />
              </div>
              <div className="absolute bottom-[4%] left-[4%] h-48 w-48 rounded-full border border-white/20 bg-gradient-to-br from-white/15 to-transparent backdrop-blur-sm" />
              <div className="absolute bottom-[12%] left-[17%] h-36 w-36 rotate-12 rounded-[42%] border border-[var(--accent)]/70 bg-[var(--accent)]/10" />
              <p className="mono absolute bottom-[3%] right-[3%] max-w-[14rem] text-[10px] uppercase leading-relaxed tracking-[.18em] text-white/50">
                {copy
                  ? "Web / backend / mobile"
                  : "Digital products / systems / experience"}
              </p>
            </Reveal>
          </div>
        </section>
        <div className="marquee">
          <div className="marquee-track mono text-xs uppercase tracking-[.22em] text-white/55">
            <span>React</span>
            <span>TypeScript</span>
            <span>Next.js</span>
            <span>Systems</span>
            <span>Motion</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>Next.js</span>
            <span>Systems</span>
            <span>Motion</span>
          </div>
        </div>
        <ProjectSignalBoard projects={projects} locale={locale} />
        <section className="page-width py-28 md:py-40">
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <p className="mono mb-4 text-xs uppercase tracking-[.18em] text-[var(--accent)]">
                {copy ? "Dự án nổi bật" : "Featured work"}
              </p>
              <h2 className="display max-w-2xl text-5xl font-bold leading-[.9] md:text-7xl">
                {copy
                  ? "Một số dự án tôi đã làm."
                  : "Selected projects."}
              </h2>
            </div>
            <a
              href={`/work?lang=${locale}`}
              className="accent-link hidden text-sm md:block"
            >
              {copy ? "Xem tất cả" : "See all work"}{" "}
              <ArrowUpRight className="inline" size={15} />
            </a>
          </div>
          <Reveal>
            <div className="max-w-6xl">
              {featured && <ProjectCard project={featured} locale={locale} featured />}
            </div>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <Reveal delay={0.08}>
              {projects[1] && (
                <ProjectCard project={projects[1]} locale={locale} />
              )}
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex flex-col justify-end border-t border-white/15 pt-5">
                <p className="mono text-xs uppercase tracking-[.18em] text-white/45">
                  {copy ? "Tôi quan tâm đến" : "I care about"}
                </p>
                <p className="mt-6 max-w-md text-3xl leading-tight text-white/80">
                  {copy
                    ? "cách người dùng hoàn thành công việc: nhập dữ liệu, xử lý lỗi và biết thao tác của mình đã được lưu."
                    : "how people complete a task: entering data, recovering from errors, and knowing their changes were saved."}
                </p>
                <a
                  href={`/about?lang=${locale}`}
                  className="accent-link mt-8 text-sm"
                >
                  {copy ? "Cách tôi làm việc" : "How I work"}{" "}
                  <ArrowUpRight className="inline" size={15} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
        <section className="bg-[var(--paper)] text-[var(--ink)]">
          <div className="page-width py-20 md:py-28">
            <div className="grid gap-10 border-b border-black/15 pb-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-20">
              <div>
                <p className="mono flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-black/55">
                  <span className="h-2 w-2 bg-[var(--accent)]" />
                  {copy ? "Cách tôi làm việc" : "How I work"}
                </p>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-black/60">
                  {copy
                    ? "Ba việc tôi làm từ lúc nhận yêu cầu đến khi bàn giao."
                    : "Three practices I keep throughout a project, from the first brief to handoff."}
                </p>
              </div>
              <div>
                <h2 className="display max-w-4xl text-[clamp(2.75rem,5.5vw,5.5rem)] font-bold leading-[.9] tracking-[-0.035em]">
                  {copy
                    ? "Làm rõ việc cần làm. Sau đó mới viết code."
                    : "Understand the work. Then write the code."}
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
                  {copy
                    ? "Trước khi bắt đầu, tôi chốt phạm vi, tìm phần có rủi ro và thống nhất thế nào là hoàn thành."
                    : "Before implementation, I align on scope, identify the risky parts, and agree on what done looks like."}
                </p>
              </div>
            </div>

            <div className="border-b border-black/15">
              {workPracticesByLocale[locale].map((practice, index) => (
                <article
                  key={practice.title}
                  className="grid gap-4 border-t border-black/15 py-8 first:border-t-0 md:grid-cols-[4rem_.7fr_1.3fr] md:gap-8 md:py-10"
                >
                  <span className="mono text-[10px] text-black/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold leading-tight md:text-2xl">
                    {practice.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-7 text-black/60 md:text-base">
                    {practice.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="page-width py-28 md:py-40">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="mono text-xs uppercase tracking-[.18em] text-[var(--accent)]">
                {copy ? "Bài viết mới" : "From the journal"}
              </p>
              <h2 className="display mt-5 text-5xl font-bold leading-[.9] md:text-7xl">
                {copy ? "Ghi chép khi làm dự án." : "Notes from building."}
              </h2>
            </div>
            <div className="space-y-1">
              {articles.map((article, index) => (
                <Reveal key={article.slug} delay={index * 0.08}>
                  <a
                    href={`/journal/${article.slug}?lang=${locale}`}
                    className="group flex items-start justify-between gap-6 border-b border-white/15 py-6"
                  >
                    <div>
                      <p className="mono text-[10px] uppercase text-white/45">
                        {article.date} / {article.topic}
                      </p>
                      <h3 className="mt-2 text-xl transition-colors group-hover:text-[var(--accent)]">
                        {localized(article.title, locale)}
                      </h3>
                    </div>
                    <ArrowUpRight
                      className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      size={20}
                    />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="page-width pb-14">
          <div className="relative overflow-hidden rounded-[16px] bg-[var(--ink-soft)] px-7 py-12 md:px-14 md:py-16">
            <Sparkle
              className="absolute right-8 top-8 text-[var(--accent)]"
              size={28}
            />
            <p className="mono relative text-xs uppercase tracking-[.18em] text-[var(--accent)]">
              {copy ? "Trao đổi công việc" : "Get in touch"}
            </p>
            <h2 className="display relative mt-5 max-w-3xl text-5xl font-bold leading-[.92] md:text-8xl">
              {copy
                ? "Bạn đang tìm developer?"
                : "Looking for a developer?"}
            </h2>
            <a
              href={`/contact?lang=${locale}`}
              className="button-accent focus-ring relative mt-10"
            >
              {copy ? "Liên hệ" : "Let’s talk"}
              <ArrowUpRight size={18} weight="bold" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} dark />
    </div>
  );
}
