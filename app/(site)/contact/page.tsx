import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "../../../app/components/site/contact-form";
import { SiteFooter } from "../../../app/components/site/site-footer";
import { SiteHeader } from "../../../app/components/site/site-header";
import { getLocale } from "../../../app/features/content/data";
import { getPublicProfile } from "../../../app/features/content/repository";

export const metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocale(params.lang);
  const copy = locale === "vi";
  const profile = await getPublicProfile();
  const socials = profile.socials ?? [];
  return (
    <div className="site-shell-dark relative isolate">
      <SiteHeader locale={locale} dark />
      <main className="relative z-[1]">
        <section className="page-width pb-24 pt-12 md:pb-36 md:pt-20">
          <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div>
              <p className="editorial-kicker flex items-center gap-3 text-[var(--accent)]">
                <EnvelopeSimple size={16} /> {copy ? "Gửi tin nhắn" : "Send a message"}
                <OrangeClue folio="contact" locale={locale} />
              </p>
              <h1 className="display mt-7 text-[clamp(3.75rem,8vw,6rem)] font-bold leading-[.84]">
                {copy ? "Liên hệ" : "Contact"}
              </h1>
              <p className="mt-10 max-w-md text-xl leading-relaxed text-white/65">
                {copy
                  ? "Bạn muốn trao đổi về công việc, dự án hoặc một vấn đề kỹ thuật? Gửi tin nhắn ở đây hoặc liên hệ trực tiếp qua email."
                  : "For roles, projects, or technical questions, use this form or email me directly."}
              </p>
              <div className="mt-12 border-t border-white/15 pt-5">
                <p className="editorial-kicker text-[var(--accent)]">
                  {copy ? "Tôi có thể giúp" : "I can help with"}
                </p>
                <ul className="mt-5 space-y-3 text-base text-white/70">
                  <li>Web applications</li>
                  <li>System design</li>
                  <li>Developer experience</li>
                  <li>Performance</li>
                </ul>
              </div>
              <div className="mt-12 space-y-4 text-sm text-white/70">
                <a
                  href={`mailto:${profile.email}`}
                  className="focus-ring flex items-center gap-3 hover:text-[var(--accent)]"
                >
                  <EnvelopeSimple size={18} /> {profile.email}
                  <ArrowUpRight size={14} />
                </a>
                {socials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring flex items-center gap-3 hover:text-[var(--accent)]"
                  >
                    <GithubLogo size={18} /> {social.label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
                <span className="flex items-center gap-3">
                  <MapPin size={18} />{" "}
                  {profile.location ??
                    `Ho Chi Minh City / ${copy ? "Việt Nam" : "Vietnam"}`}
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="contact-art absolute -right-8 -top-12 hidden w-[70%] opacity-60 md:block">
                <Image src={profile.image} alt="" fill sizes="40vw" />
              </div>
              <div className="relative z-[1] rounded-[18px] bg-[var(--ink-soft)] p-7 md:p-12">
                <p className="mb-8 flex items-center gap-3 text-2xl leading-tight text-white/90">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  {copy
                    ? "Bạn muốn trao đổi điều gì?"
                    : "What would you like to discuss?"}
                </p>
                <ContactForm
                  locale={locale}
                  initiallySent={params.sent === "1"}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-white/15">
          <div className="page-width flex flex-col gap-5 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {copy
                ? "Thường phản hồi trong 2 ngày làm việc."
                : "Usually replying within two working days."}
            </span>
            <div className="flex flex-wrap gap-5">
              <Link href={`/resume?lang=${locale}`} className="accent-link">
                {copy ? "Xem CV" : "View CV"}{" "}
                <ArrowUpRight className="inline" size={15} />
              </Link>
              <Link href={`/work?lang=${locale}`} className="accent-link">
                {copy ? "Xem dự án" : "See the work"}{" "}
                <ArrowUpRight className="inline" size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} dark />
    </div>
  );
}
import { OrangeClue } from "../../components/site/orange-clue";
