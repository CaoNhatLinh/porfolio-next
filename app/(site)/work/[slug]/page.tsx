import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/site/site-footer";
import { SiteHeader } from "../../../components/site/site-header";
import { CaseStudyGallery } from "../../../components/site/case-study-gallery";
import { CaseStudyProgress } from "../../../components/site/case-study-progress";
import { Reveal } from "../../../components/site/reveal";
import { ProjectPlatforms } from "../../../components/site/project-platforms";
import { ProjectStack } from "../../../components/site/project-stack";
import { TrackedLink } from "../../../components/site/tracked-link";
import {
  getLocale,
  projects as fixtureProjects,
} from "../../../features/content/data";
import {
  getPublicProject,
  getPublicProjects,
} from "../../../features/content/repository";
import { localized } from "../../../features/content/types";

export function generateStaticParams() {
  return fixtureProjects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const locale = getLocale((await searchParams).lang);
  const copy = locale === "vi";
  const [project, projects] = await Promise.all([
    getPublicProject(slug),
    getPublicProjects(),
  ]);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((item) => item.slug === project.slug) + 1) %
        projects.length
    ] ?? projects[0];
  const sections =
    project.sections.length > 0
      ? project.sections
      : [
          {
            heading: { vi: "Cách làm", en: "The approach" },
            body: project.outcome,
            tone: "accent" as const,
          },
        ];
  const primaryLink = project.links[0];
  const chapterLinks = sections.map((section, index) => ({
    id: `chapter-${index + 1}`,
    heading: section.heading,
  }));

  return (
    <div className="site-shell-dark">
      <SiteHeader locale={locale} dark />
      <main>
        <section className="page-width pb-20 pt-12 md:pb-32 md:pt-20">
          <Link
            href={`/work?lang=${locale}`}
            className="focus-ring editorial-kicker inline-flex items-center gap-2 text-white/55 hover:text-white"
          >
            <ArrowLeft size={15} /> {copy ? "Tất cả dự án" : "All work"}
          </Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Case study / dự án" : "Case study / project"}
              </p>
              <h1 className="display mt-7 max-w-3xl break-words text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[.9]">
                {project.title}
              </h1>
              <p className="mt-9 max-w-lg text-xl leading-relaxed text-white/65">
                {localized(project.summary, locale)}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {primaryLink && (
                  <a
                    href={primaryLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="button-accent focus-ring"
                  >
                    {primaryLink.label}
                    <ArrowUpRight size={18} />
                  </a>
                )}
                <TrackedLink
                  eventName="case_study_cta"
                  href={`/hire?lang=${locale}`}
                  className="button-quiet focus-ring"
                >
                  {copy ? "Trao đổi công việc" : "Discuss a project"}
                  <ArrowUpRight size={16} />
                </TrackedLink>
              </div>
            </div>
            <Reveal className="case-hero-image media-frame aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 68vw, 100vw"
                className={
                  project.imageFit === "contain"
                    ? "object-contain p-6"
                    : "object-cover"
                }
              />
            </Reveal>
          </div>
          <div className="mt-16 grid gap-8 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="editorial-kicker text-white/45">
                {copy ? "Vai trò" : "Role"}
              </p>
              <p className="mt-3 text-base">
                {localized(project.role, locale)}
              </p>
            </div>
            <div>
              <p className="editorial-kicker text-white/45">
                {copy ? "Thời lượng" : "Duration"}
              </p>
              <p className="mt-3 text-base">
                {project.duration ?? project.year}
              </p>
            </div>
            <div>
              <p className="editorial-kicker text-white/45">
                {copy ? "Bối cảnh" : "Context"}
              </p>
              <p className="mt-3 text-base">
                {project.teamContext
                  ? localized(project.teamContext, locale)
                  : copy
                    ? "Dự án độc lập"
                    : "Independent project"}
              </p>
            </div>
            <div>
              <p className="editorial-kicker text-white/45">
                {copy ? "Mã nguồn và tài liệu" : "Source and documentation"}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/75">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="accent-link focus-ring"
                  >
                    {link.label}
                    <ArrowUpRight className="ml-1 inline" size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-width pb-24 md:pb-36">
          <div className="grid gap-8 rounded-[16px] border border-white/15 bg-white/[.035] p-7 sm:p-10 md:grid-cols-[.4fr_1fr] md:gap-14 md:p-14">
            <div>
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Tóm lại" : "In brief"}
              </p>
              <h2 className="display mt-5 text-4xl font-bold leading-[.88] md:text-5xl">
                {copy ? "Tôi đã làm gì?" : "What I worked on."}
              </h2>
            </div>
            <div className="border-l-2 border-[var(--accent)] pl-6 md:pl-9">
              <p className="max-w-3xl text-2xl leading-tight text-white/85 md:text-4xl">
                {localized(project.outcome, locale)}
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
                {copy
                  ? "Phần dưới đi sâu hơn vào những quyết định về trải nghiệm và kỹ thuật đã tạo nên dự án."
                  : "The sections below unpack the product and technical decisions behind this work."}
              </p>
            </div>
          </div>
        </section>

        {project.slug === "social-publishing-platform" && (
          <ProjectPlatforms locale={locale} />
        )}

        {project.highlights && project.highlights.length > 0 && (
          <section className="page-width pb-24 pt-4 md:pb-36 md:pt-8">
            <div className="border-t border-white/15 pt-6">
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Các phần chính" : "Key parts of the project"}
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_.8fr_.8fr]">
                {project.highlights.map((highlight, index) => (
                  <Reveal
                    key={highlight.title.en}
                    delay={index * 0.07}
                    className={index === 0 ? "md:row-span-2" : ""}
                  >
                    <article className="h-full rounded-[16px] border border-white/15 bg-white/[.035] p-7 md:p-9">
                      <p className="editorial-kicker text-white/45">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="display mt-10 max-w-sm text-4xl font-bold leading-[.9] md:text-5xl">
                        {localized(highlight.title, locale)}
                      </h3>
                      <p className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
                        {localized(highlight.detail, locale)}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="page-width py-24 md:py-36">
          <div className="grid gap-16 lg:grid-cols-[.5fr_1.5fr]">
            <div>
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Chi tiết triển khai" : "Implementation details"}
              </p>
              <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.84] md:text-7xl">
                {copy
                  ? "Quá trình làm dự án."
                  : "Building the project."}
              </h2>
              <CaseStudyProgress locale={locale} sections={chapterLinks} />
            </div>
            <div className="space-y-14">
              {sections.map((section, index) => (
                <Reveal
                  key={`${section.heading.en}-${index}`}
                  delay={index * 0.08}
                >
                  <article
                    id={chapterLinks[index]?.id}
                    className="scroll-mt-28 grid gap-5 border-t border-white/15 pt-5 md:grid-cols-[.35fr_1fr]"
                  >
                    <p className="editorial-kicker text-white/45">
                      {localized(section.heading, locale)}
                    </p>
                    <div>
                      <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-white/85 md:text-lg">
                        {localized(section.body, locale)}
                      </p>
                      {section.tone === "accent" && (
                        <div className="mt-7 flex items-center gap-3 text-sm text-[var(--accent)]">
                          <Check size={18} />{" "}
                          {copy
                            ? "Ghi chú của tôi."
                            : "My notes."}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <CaseStudyGallery items={project.gallery} locale={locale} />
        )}

        <ProjectStack stack={project.stack} locale={locale} />

        <section className="page-width pb-14">
          <div className="grid gap-10 border-t border-white/15 pt-6 md:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Bước tiếp theo" : "A useful next step"}
              </p>
              <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.84] md:text-7xl">
                {copy
                  ? "Trao đổi về dự án của bạn."
                  : "Let's discuss your project."}
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  eventName="case_study_cta"
                  href={`/resume?lang=${locale}`}
                  className="button-quiet"
                >
                  {copy ? "Xem CV" : "View CV"}
                  <ArrowUpRight size={16} />
                </TrackedLink>
                <TrackedLink
                  eventName="case_study_cta"
                  href={`/hire?lang=${locale}`}
                  className="button-accent"
                >
                  {copy ? "Gửi brief" : "Send a brief"}
                  <ArrowUpRight size={16} />
                </TrackedLink>
              </div>
            </div>
            <Link
              href={`/work/${next.slug}?lang=${locale}`}
              className="group block rounded-[16px] bg-white/5 p-7 transition-colors hover:bg-white/10 md:p-12"
            >
              <p className="editorial-kicker text-white/45">
                {copy ? "Dự án tiếp theo" : "Next project"}
              </p>
              <div className="mt-5 flex items-end justify-between gap-6">
                <h3 className="display min-w-0 break-words text-3xl font-bold md:text-6xl">
                  {next.title}
                </h3>
                <ArrowUpRight
                  size={30}
                  className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} dark />
    </div>
  );
}
