import Link from "next/link";
import {
  ArrowUpRight,
  EnvelopeSimple,
  Lightning,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "../../components/site/contact-form";
import { SiteFooter } from "../../components/site/site-footer";
import { SiteHeader } from "../../components/site/site-header";
import { getLocale } from "../../features/content/data";
import { getPublicProfile } from "../../features/content/repository";
import { getPublicResume } from "../../features/content/resume-repository";
import { localized } from "../../features/content/types";

export const metadata = { title: "Hire me" };

export default async function HirePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const [profile, resume] = await Promise.all([getPublicProfile(), getPublicResume()]);
  const copy = locale === "vi";
  const fallbackModes = copy
    ? [
        "Phát triển website hoặc ứng dụng mobile",
        "Bổ sung tính năng cho sản phẩm hiện có",
        "Tham gia team với vai trò full-stack developer",
      ]
    : [
        "Develop a website or mobile app",
        "Add features to an existing product",
        "Join a team as a full-stack developer",
      ];
  return (
    <div className="site-shell-dark">
      <SiteHeader locale={locale} dark />
      <main>
        <section className="page-width relative isolate pb-20 pt-12 md:pb-28 md:pt-20">
          <div className="relative z-[1] grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="mono flex items-center gap-3 text-xs uppercase tracking-[.16em] text-[var(--accent)]">
                <Lightning size={16} weight="bold" />
                {copy ? "Trao đổi công việc" : "Work with me"}
                <OrangeClue folio="hire" locale={locale} />
              </p>
              <h1 className="display mt-7 max-w-4xl text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.84]">
                {copy ? (
                  <>
                    Cùng làm
                    <br />
                    <span className="ml-[8vw]">dự án mới.</span>
                  </>
                ) : (
                  <>
                    {"Let's work"}
                    <br />
                    <span className="ml-[8vw]">together.</span>
                  </>
                )}
              </h1>
            </div>
            <div className="max-w-md lg:pb-2">
              <p className="text-xl leading-relaxed text-white/65">
                {localized(profile.intro, locale)}
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {localized(profile.availability ?? { vi: "", en: "" }, locale)}
              </p>
              <p className="mt-3 text-sm text-white/45">
                {localized(profile.responseTime ?? { vi: "", en: "" }, locale)}
              </p>
            </div>
          </div>
        </section>
        <section className="border-y border-white/15">
          <div className="page-width grid gap-10 py-10 md:grid-cols-[.72fr_1.28fr] md:py-14">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.15em] text-white/45">
                {copy ? "Có thể bắt đầu từ" : "Good starting points"}
              </p>
              <p className="mt-5 text-2xl leading-tight text-white/85">
                {copy
                  ? "Bạn có thể gửi mô tả ngắn về sản phẩm, phần cần làm và thời gian dự kiến. Tôi sẽ hỏi thêm nếu cần làm rõ yêu cầu."
                  : "Send a short description of the product, the work needed, and your timeline. I'll ask follow-up questions if needed."}
              </p>
            </div>
            <div className="divide-y divide-white/15">
              {(resume.services.length ? resume.services.map((entry) => ({ title: localized(entry.title, locale), body: localized(entry.body, locale) })) : (!process.env.NEXT_PUBLIC_SUPABASE_URL ? fallbackModes.map((title) => ({ title, body: "" })) : [])).map((mode, index) => (
                <div
                  key={mode.title}
                  className="flex gap-5 py-4 text-base text-white/65"
                >
                  <span className="mono text-xs text-[var(--accent)]">
                    0{index + 1}
                  </span>
                  <div><h3>{mode.title}</h3>{mode.body && <p className="mt-3 text-sm leading-relaxed text-white/55">{mode.body}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="page-width py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent)]">
                {copy ? "Gửi brief" : "Send a brief"}
              </p>
              <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.86] md:text-7xl">
                {copy ? "Thông tin dự án." : "Project details."}
              </h2>
              <div className="mt-10 space-y-4 text-sm text-white/55">
                <a
                  href={`mailto:${profile.email}`}
                  className="focus-ring flex items-center gap-3 hover:text-[var(--accent)]"
                >
                  <EnvelopeSimple size={17} />
                  {profile.email}
                  <ArrowUpRight size={14} />
                </a>
                <span className="flex items-center gap-3">
                  <MapPin size={17} />
                  {profile.location}
                </span>
                <Link
                  href={`/resume?lang=${locale}`}
                  className="accent-link inline-flex items-center gap-2"
                >
                  {copy ? "Xem CV trước" : "Read my CV first"}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="rounded-[16px] bg-[var(--ink-soft)] p-7 md:p-12">
              <ContactForm locale={locale} defaultIntent="hire" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} dark />
    </div>
  );
}
import { OrangeClue } from "../../components/site/orange-clue";
