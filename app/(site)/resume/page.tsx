import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "../../components/site/site-footer";
import { SiteHeader } from "../../components/site/site-header";
import { ResumeActions } from "../../components/site/resume-actions";
import { getLocale } from "../../features/content/data";
import {
  getPublicProfile,
  getPublicProjects,
} from "../../features/content/repository";
import { getPublicResume } from "../../features/content/resume-repository";
import { ResumeExtras } from "../../components/site/resume-extras";
import { localized } from "../../features/content/types";

export const metadata = { title: "Resume" };

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const [profile, projects, resume] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicResume(),
  ]);
  const copy = locale === "vi";
  return (
    <div className="site-shell-light resume-page">
      <SiteHeader locale={locale} />
      <main id="resume" className="page-width pb-24 pt-12 md:pb-40 md:pt-20">
        <header className="grid gap-10 border-b border-black/15 pb-12 md:grid-cols-[.32fr_1fr] md:pb-16">
          <div>
            <p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent-ink)]">
              {copy ? "Hồ sơ / 2026" : "Resume / 2026"}
              <OrangeClue folio="resume" locale={locale} />
            </p>
            <p className="mono mt-8 flex items-center gap-2 text-xs text-black/55">
              <MapPin size={15} />
              {profile.location}
            </p>
            <p className="mt-2 text-sm text-black/55">{profile.email}</p>
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent-ink)]">
              {localized(profile.title, locale)} /{" "}
              {localized(profile.availability ?? { vi: "", en: "" }, locale)}
            </p>
            <h1 className="display mt-7 max-w-5xl text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.84]">
              {profile.name}
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-black/65">
              {localized(profile.bio, locale)}
            </p>
            <div className="mt-8">
              <ResumeActions resumeUrl={profile.resumeUrl} locale={locale} />
            </div>
          </div>
        </header>
        <div className="grid gap-16 pt-14 md:grid-cols-[.32fr_1fr] md:gap-12 md:pt-20">
          <aside className="self-start md:sticky md:top-8">
            <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-[14px] bg-black/5">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover grayscale contrast-125"
              />
            </div>
            <p className="mono text-[10px] uppercase tracking-[.15em] text-black/45">
              {copy ? "Trạng thái" : "Current status"}
            </p>
            <p className="mt-3 max-w-xs text-2xl leading-tight">
              {localized(profile.availability ?? { vi: "", en: "" }, locale)}
            </p>
            {profile.responseTime && (
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-black/55">
                {localized(profile.responseTime, locale)}
              </p>
            )}
            <Link
              href={`/hire?lang=${locale}`}
              className="accent-link mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            >
              {copy ? "Thuê tôi" : "Hire me"}
              <ArrowUpRight size={15} />
            </Link>
            <div className="mt-12 border-t border-black/15 pt-5 print:hidden">
              <p className="mono text-[10px] uppercase tracking-[.15em] text-black/45">
                {copy ? "Ngôn ngữ" : "Languages"}
              </p>
              <p className="mt-3 text-sm">
                Tiếng Việt
                <br />
                English
              </p>
            </div>
          </aside>
          <div className="space-y-20">
            <section>
              <div className="grid gap-8 border-b border-black/15 pb-6 md:grid-cols-[.42fr_1fr]">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[.15em] text-[var(--accent-ink)]">
                    {copy ? "Dự án nổi bật" : "Selected projects"}
                  </p>
                  <h2 className="display mt-4 text-4xl font-bold leading-[.86] md:text-5xl">
                    {copy ? "Một số dự án tôi đã làm." : "Selected work."}
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {projects
                    .filter((project) => project.isFeatured)
                    .slice(0, 2)
                    .map((project) => (
                      <Link
                        key={project.slug}
                        href={`/work/${project.slug}?lang=${locale}`}
                        className="group border-t border-black/15 pt-4"
                      >
                        <p className="mono text-[10px] uppercase tracking-[.14em] text-black/45">
                          {project.category} / {project.year}
                        </p>
                        <h3 className="mt-3 text-xl font-medium">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-black/65">
                          {localized(project.outcome, locale)}
                        </p>
                        <span className="accent-link mt-4 inline-flex items-center gap-2 text-sm">
                          {copy ? "Xem case study" : "View case study"}
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </section>
            <section>
              <div className="flex items-baseline justify-between gap-4 border-b border-black/15 pb-4">
                <h2 className="display text-4xl font-bold md:text-6xl">
                  {copy ? "Kinh nghiệm" : "Experience"}
                </h2>
                <span className="mono text-[10px] text-black/45">
                  {copy ? "Công việc và dự án cá nhân" : "Employment and personal projects"}
                </span>
              </div>
              <div className="divide-y divide-black/15">
                {resume.experiences.map((item) => {
                  const project = projects.find(
                    (candidate) => candidate.slug === item.projectSlug,
                  );
                  return (
                    <article
                      key={item.id ?? item.projectSlug ?? item.title.en}
                      className="grid gap-4 py-7 sm:grid-cols-[7rem_1fr] sm:gap-8"
                    >
                      <p className="mono text-xs text-[var(--accent-ink)]">
                        {localized(item.period, locale)}
                      </p>
                      <div>
                        <h3 className="text-xl font-medium">
                          {localized(item.title, locale)}
                        </h3>
                        <p className="mt-1 text-sm text-black/50">
                          {localized(item.context, locale)}
                        </p>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65">
                          {localized(item.description, locale)}
                        </p>
                        {project && (
                          <Link
                            href={`/work/${project.slug}?lang=${locale}`}
                            className="accent-link mt-4 inline-flex items-center gap-2 text-sm"
                          >
                            {copy ? "Xem dự án" : "View project"}
                            <ArrowUpRight size={14} />
                          </Link>
                        )}
                        {!project && item.evidenceUrl && (
                          <a
                            href={item.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="accent-link mt-4 inline-flex items-center gap-2 text-sm"
                          >
                            {localized(
                              item.evidenceLabel ?? {
                                vi: "Xem nguồn",
                                en: "View source",
                              },
                              locale,
                            )}
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            <section>
              <div className="border-b border-black/15 pb-4">
                <h2 className="display text-4xl font-bold md:text-6xl">
                  {copy ? "Kỹ năng và công nghệ" : "Skills and technologies"}
                </h2>
              </div>
              <div className="mt-2">
                {resume.capabilities.map((capability) => (
                  <article
                    key={capability.name}
                    className="grid gap-4 border-b border-black/15 py-7 sm:grid-cols-[.7fr_1fr_.8fr] sm:gap-8"
                  >
                    <h3 className="text-xl font-medium">{localized(capability.title, locale)}</h3>
                    <p className="text-base leading-relaxed text-black/60">
                      {localized(capability.detail, locale)}
                    </p>
                    <div className="flex flex-wrap content-start gap-2 sm:justify-end">
                      {capability.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-black/20 px-3 py-1 text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <ResumeExtras entries={resume.education} title={copy ? "Học vấn" : "Education"} locale={locale} />
            <ResumeExtras entries={resume.certifications} title={copy ? "Chứng chỉ" : "Certifications"} locale={locale} />
            <section className="grid gap-8 border-t border-black/15 pt-6 sm:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="mono text-[10px] uppercase tracking-[.15em] text-black/45">
                  {copy ? "Nguyên tắc" : "Working notes"}
                </p>
              </div>
              <div className="grid gap-4 text-lg leading-relaxed">
                <p>
                  <Check
                    size={18}
                    className="mr-2 inline text-[var(--accent-ink)]"
                  />
                  {copy
                    ? "Thống nhất yêu cầu và phạm vi trước khi triển khai."
                    : "Agree on requirements and scope before implementation."}
                </p>
                <p>
                  <Check
                    size={18}
                    className="mr-2 inline text-[var(--accent-ink)]"
                  />
                  {copy
                    ? "Giải thích lựa chọn kỹ thuật và các hạn chế của nó."
                    : "Explain technical choices and their trade-offs."}
                </p>
                <p>
                  <Check
                    size={18}
                    className="mr-2 inline text-[var(--accent-ink)]"
                  />
                  {copy
                    ? "Kiểm tra luồng chính và các trường hợp lỗi trước khi bàn giao."
                    : "Check the main flow and failure cases before handoff."}
                </p>
              </div>
            </section>
            <section className="print:hidden border-t border-black/15 pt-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[.15em] text-[var(--accent-ink)]">
                    {copy ? "Bước tiếp theo" : "Next step"}
                  </p>
                  <h2 className="display mt-4 text-5xl font-bold leading-[.86] md:text-7xl">
                    {copy ? "Bạn muốn trao đổi thêm?" : "Want to discuss a role?"}
                  </h2>
                </div>
                <Link href={`/hire?lang=${locale}`} className="button-accent">
                  {copy ? "Gửi brief" : "Send a brief"}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
import { OrangeClue } from "../../components/site/orange-clue";
