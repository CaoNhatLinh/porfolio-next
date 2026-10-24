import Link from "next/link";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "../../features/content/types";
import { BrandLogo } from "../brand/brand-logo";

const GITHUB_URL = "https://github.com/CaoNhatLinh";

export function SiteFooter({
  locale,
  dark = false,
}: {
  locale: Locale;
  dark?: boolean;
}) {
  const isVietnamese = locale === "vi";
  const githubCardStyle = dark
    ? "border-white/20 bg-white/[0.035] hover:border-white/45 hover:bg-white/[0.075]"
    : "border-black/15 bg-black/[0.025] hover:border-black/35 hover:bg-black/[0.055]";

  return (
    <footer
      className={`page-width border-t py-10 ${dark ? "hairline-dark text-[var(--paper)]" : "hairline"}`}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href={`/?lang=${locale}`} className="focus-ring inline-flex">
            <BrandLogo dark={dark} className="h-14 w-[150px]" />
          </Link>
          <p className="mono mt-2 text-xs opacity-60">
            {isVietnamese
              ? "Cao Nhật Linh · Full-stack developer."
              : "Cao Nhật Linh · Full-stack developer."}
          </p>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className={`focus-ring group flex w-full items-center gap-4 border px-5 py-4 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 md:w-[19rem] ${githubCardStyle}`}
          aria-label={
            isVietnamese
              ? "Mở GitHub của Cao Nhật Linh trong tab mới"
              : "Open Cao Nhat Linh's GitHub in a new tab"
          }
        >
          <GithubLogo size={28} weight="fill" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="mono block text-[10px] uppercase tracking-[0.16em] opacity-55">
              {isVietnamese ? "Mã nguồn & hoạt động" : "Code & activity"}
            </span>
            <span className="mt-1 block text-base font-semibold">GitHub</span>
          </span>
          <ArrowUpRight
            size={18}
            weight="bold"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>

      <div className="mono mt-10 flex flex-wrap gap-3 text-[10px] opacity-50">
        <span>© {new Date().getFullYear()} Cao Nhật Linh</span>
      </div>
    </footer>
  );
}
