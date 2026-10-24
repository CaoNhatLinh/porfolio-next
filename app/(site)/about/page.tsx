import Image from "next/image";
import { OrangeClue } from "../../components/site/orange-clue";
import Link from "next/link";
import {
  ArrowUpRight,
  BracketsCurly,
  Compass,
  Lightning,
  StackSimple,
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "../../../app/components/site/site-footer";
import { SiteHeader } from "../../../app/components/site/site-header";
import { Reveal } from "../../../app/components/site/reveal";
import { InterfaceXRay } from "../../../app/components/site/interface-x-ray";
import { getLocale } from "../../../app/features/content/data";
import {
  getPublicProfile,
  getPublicProjects,
  getPublicLabItems,
} from "../../../app/features/content/repository";
import { getPublicResume } from "../../features/content/resume-repository";
import { localized } from "../../../app/features/content/types";

export const metadata = { title: "About" };

const principles = [
  {
    icon: Compass,
    vi: "Hiểu vấn đề trước khi mở editor.",
    en: "Understand the problem before opening the editor.",
  },
  {
    icon: StackSimple,
    vi: "Viết code để người khác đọc và sửa được.",
    en: "Write code that others can read and change.",
  },
  {
    icon: Lightning,
    vi: "Kiểm tra cả loading, lỗi và dữ liệu trống.",
    en: "Check loading, error, and empty states too.",
  },
];

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const [profile, projects, experiments, resume] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicLabItems(),
    getPublicResume(),
  ]);
  const copy = locale === "vi";
  const toolNames = Array.from(
    new Set(
      resume.capabilities.flatMap((item) => item.tools),
    ),
  );
  return (
    <div className="site-shell-light">
      <SiteHeader locale={locale} />
      <main>
        <section className="page-width grid gap-14 pb-24 pt-12 md:grid-cols-[.82fr_1.18fr] md:items-center md:pb-36 md:pt-24">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="media-frame aspect-[4/5] rounded-[48%_52%_42%_58%/38%_34%_66%_62%]">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                priority
                sizes="(min-width: 768px) 35vw, 90vw"
                className="object-cover grayscale contrast-125"
              />
            </div>
            <p className="display absolute -bottom-8 left-0 max-w-[13rem] rotate-[-8deg] text-3xl font-bold text-[var(--accent-ink)] md:-left-14">
              {copy ? "Tò mò, làm kỹ." : "Curious, make carefully."}
            </p>
          </Reveal>
          <div>
            <p className="editorial-kicker text-black/50">
              {copy ? "Về tôi / Cao Nhật Linh" : "About / Cao Nhat Linh"}
              <OrangeClue folio="about" locale={locale} />
            </p>
            <h1 className="display mt-8 text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.84]">
              {copy ? "Xin chào" : "Hello"}
            </h1>
            <p className="mt-10 max-w-xl text-2xl leading-tight md:text-4xl">
              {localized(profile.title, locale)}.{" "}
              {localized(profile.bio, locale)}
            </p>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-black/65">
              {copy
                ? "Tôi làm cả frontend và backend. Tôi thích theo một tính năng từ lúc nhận yêu cầu đến khi nó có thể dùng được, thay vì chỉ hoàn thành riêng một màn hình."
                : "I work across frontend and backend. I like following a feature from its requirements to a usable implementation, rather than stopping at a finished screen."}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/hire?lang=${locale}`}
                className="button-accent focus-ring"
              >
                {copy ? "Nói chuyện" : "Let’s work together"}
                <ArrowUpRight size={18} weight="bold" />
              </Link>
              <Link
                href={`/resume?lang=${locale}`}
                className="button-quiet focus-ring"
              >
                {copy ? "Xem CV" : "Read my CV"}
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[var(--ink)] text-[var(--paper)]">
          <div className="page-width py-20 md:py-28">
            <div className="grid gap-12 md:grid-cols-[.48fr_1.52fr]">
              <div>
                <p className="editorial-kicker text-[var(--accent)]">
                  {copy ? "Cách tôi làm việc" : "How I work"}
                </p>
                <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.84] md:text-7xl">
                  {copy ? "Những việc tôi chú ý." : "What I pay attention to."}
                </h2>
              </div>
              <div className="divide-y divide-white/15">
                {principles.map(({ icon: Icon, vi, en }, index) => (
                  <Reveal key={en} delay={index * 0.08}>
                    <div className="flex gap-5 py-7">
                      <Icon
                        size={25}
                        className="mt-1 shrink-0 text-[var(--accent)]"
                      />
                      <p className="max-w-2xl text-2xl leading-tight md:text-3xl">
                        {copy ? vi : en}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-width py-24 md:py-36">
          <div className="flex items-end justify-between gap-8 border-b border-black/15 pb-5">
            <div>
              <p className="editorial-kicker text-black/50">
                {copy ? "Kinh nghiệm" : "Experience"}
              </p>
              <h2 className="display mt-5 text-5xl font-bold leading-[.84] md:text-7xl">
                {copy ? "Công việc và dự án." : "Work and projects."}
              </h2>
            </div>
            <Link
              href={`/resume?lang=${locale}`}
              className="accent-link hidden items-center gap-2 text-sm md:inline-flex"
            >
              {copy ? "Mở CV" : "Open resume"}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="relative mt-12 pl-8">
            <div className="timeline-line" />
            {resume.experiences.map((item, index) => {
              const project = projects.find(
                (candidate) => candidate.slug === item.projectSlug,
              );
              return (
                <Reveal
                  key={item.projectSlug ?? item.title.en}
                  delay={index * 0.06}
                >
                  <article className="relative grid gap-4 border-b border-black/15 py-8 md:grid-cols-[7rem_.8fr_1fr_auto] md:items-start md:gap-8">
                    <span className="timeline-dot absolute -left-[2.02rem] top-9" />
                    <p className="mono text-xs text-[var(--accent-ink)]">
                      {localized(item.period, locale)}
                    </p>
                    <h3 className="text-xl font-medium">
                      {localized(item.title, locale)}
                    </h3>
                    <div>
                      <p className="text-sm text-black/50">
                        {localized(item.context, locale)}
                      </p>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/60">
                        {localized(item.description, locale)}
                      </p>
                    </div>
                    {project && (
                      <Link
                        href={`/work/${project.slug}?lang=${locale}`}
                        className="focus-ring inline-flex items-center gap-2 text-sm text-[var(--accent-ink)] md:justify-self-end"
                      >
                        {copy ? "Xem dự án" : "View project"}
                        <ArrowUpRight size={15} />
                      </Link>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="bg-[#e7eadf]">
          <div className="page-width grid gap-12 py-20 md:grid-cols-[.5fr_1.5fr] md:py-28">
            <div>
              <p className="editorial-kicker text-black/50">
                {copy ? "Công nghệ tôi dùng" : "Technologies I use"}
              </p>
              <h2 className="display mt-5 text-5xl font-bold leading-[.84] md:text-7xl">
                {copy ? "Stack của tôi." : "My stack."}
              </h2>
              <p className="mt-7 max-w-xs text-sm leading-relaxed text-black/60">
                {copy
                  ? "Các công nghệ tôi đã dùng trong công việc và dự án cá nhân."
                  : "Technologies I have used at work and in personal projects."}
              </p>
            </div>
            <div>
              <div className="tool-cloud border-y border-black/20 py-8">
                {toolNames.map((tool, index) => (
                  <span
                    key={tool}
                    className={`${index % 5 === 0 ? "text-5xl font-semibold" : index % 3 === 0 ? "text-3xl" : "text-xl"}`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {resume.capabilities.map((capability) => (
                  <article
                    key={capability.name}
                    className="border-t border-black/20 pt-4"
                  >
                    <h3 className="text-lg font-medium">{localized(capability.title, locale)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      {localized(capability.detail, locale)}
                    </p>
                    <Link
                      href={`/resume?lang=${locale}`}
                      className="accent-link mt-4 inline-flex items-center gap-1 text-xs"
                    >
                      {copy ? "Xem chi tiết" : "See detail"}
                      <ArrowUpRight size={13} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-width py-24 md:py-36">
          <div className="mb-10 grid gap-6 border-t border-black/15 pt-6 md:grid-cols-[.75fr_1.25fr] md:items-end md:gap-12">
            <div>
              <p className="editorial-kicker flex items-center gap-3 text-[var(--accent-ink)]">
                <BracketsCurly size={16} /> Playground
              </p>
              <h2 className="display mt-5 max-w-lg text-5xl font-bold leading-[.88] md:text-7xl">
                {copy ? "Thử xem bên dưới UI." : "Look beneath the UI."}
              </h2>
            </div>
            <div className="md:pb-1">
              <p className="max-w-xl text-base leading-relaxed text-black/65">
                {copy
                  ? "Rê thấu kính qua giao diện để nhìn thấy cấu trúc, trạng thái và lớp hỗ trợ truy cập nằm bên dưới."
                  : "Move the lens across the interface to reveal its structure, states, and accessibility layer."}
              </p>
              <Link
                href={`/lab/interface-x-ray?lang=${locale}`}
                className="accent-link focus-ring mt-5 inline-flex items-center gap-2 text-sm"
              >
                {copy ? "Mở toàn màn hình" : "Open the experiment"}
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <InterfaceXRay locale={locale} variant="compact" />
          {experiments.length > 0 && <div className="mt-12 grid gap-8 md:grid-cols-2">
            {experiments.map((experiment) => <article key={experiment.slug} className="border-t border-black/20 pt-6">
              {experiment.coverImage && <div className="relative mb-5 aspect-video overflow-hidden rounded-xl"><Image src={experiment.coverImage} alt={localized(experiment.title, locale)} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" /></div>}
              <h3 className="text-2xl font-medium">{localized(experiment.title, locale)}</h3>
              <p className="mt-3 text-black/60">{localized(experiment.summary, locale)}</p>
              <div className="mt-5 flex gap-6">
                {experiment.demoUrl && <a className="accent-link focus-ring" href={experiment.demoUrl}>{copy ? "Thử ngay" : "Try it"} ↗</a>}
                {experiment.repoUrl && <a className="accent-link focus-ring" href={experiment.repoUrl}>{copy ? "Xem mã nguồn" : "Source code"} ↗</a>}
              </div>
            </article>)}
          </div>}
        </section>
        <section className="page-width pb-14">
          <div className="grid items-center gap-10 overflow-hidden rounded-[18px] bg-[var(--ink)] p-7 text-[var(--paper)] md:grid-cols-[1fr_.7fr] md:p-12">
            <div>
              <p className="editorial-kicker text-[var(--accent)]">
                {copy ? "Liên hệ" : "Get in touch"}
              </p>
              <h2 className="display mt-5 max-w-2xl text-5xl font-bold leading-[.86] md:text-7xl">
                {copy
                  ? "Trao đổi về công việc."
                  : "Let's discuss the work."}
              </h2>
              <Link
                href={`/hire?lang=${locale}`}
                className="button-accent mt-9"
              >
                {copy ? "Gửi brief" : "Send a brief"}
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="relative min-h-[12rem] overflow-hidden rounded-[12px] bg-[#262825]">
              <Image
                src={projects[0]?.image ?? profile.image}
                alt={projects[0]?.title ?? profile.name}
                fill
                sizes="(min-width: 768px) 35vw, 100vw"
                className="object-cover opacity-75 mix-blend-screen grayscale"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
