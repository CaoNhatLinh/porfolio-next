import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "../../features/content/types";
import { LocaleSwitch } from "./locale-switch";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "../brand/brand-logo";
import { MagneticLink } from "./magnetic-link";

const items = [
  { href: "/work", vi: "Dự án", en: "Work" },
  { href: "/about", vi: "Về tôi", en: "About" },
  { href: "/journal", vi: "Bài viết", en: "Journal" },
  { href: "/resume", vi: "CV", en: "Resume" },
  { href: "/playroom", vi: "Góc riêng", en: "Playroom" },
];

export function SiteHeader({
  locale,
  dark = false,
}: {
  locale: Locale;
  dark?: boolean;
}) {
  const label = (item: (typeof items)[number]) =>
    locale === "vi" ? item.vi : item.en;
  const hrefWithLocale = (href: string) => `${href}?lang=${locale}`;
  return (
    <header
      className={`relative z-10 page-width flex items-center justify-between py-6 ${dark ? "text-[var(--paper)]" : "text-[var(--ink)]"}`}
    >
      <Link
        href={`/?lang=${locale}`}
        className="focus-ring flex items-center gap-3"
        aria-label="Kamling — Cao Nhật Linh home"
      >
        <BrandLogo
          dark={dark}
          priority
          className="h-12 w-[132px] sm:h-14 sm:w-[152px]"
        />
        <span className="mono hidden text-[10px] opacity-60 sm:inline">
          / developer
        </span>
      </Link>
      <nav
        className="hidden items-center gap-8 md:flex"
        aria-label="Primary navigation"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={hrefWithLocale(item.href)}
            className="focus-ring text-sm transition-opacity hover:opacity-60"
          >
            {label(item)}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LocaleSwitch locale={locale} dark={dark} />
        <MagneticLink
          href={hrefWithLocale("/hire")}
          className="button-accent hidden text-xs sm:inline-flex"
        >
          {locale === "vi" ? "Thuê tôi" : "Hire me"}
          <ArrowUpRight size={16} weight="bold" />
        </MagneticLink>
        <MobileNav locale={locale} dark={dark} />
      </div>
    </header>
  );
}
