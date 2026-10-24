"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { Locale } from "../../features/content/types";

export function LocaleSwitch({ locale, dark = false }: { locale: Locale; dark?: boolean }) {
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextLocale = locale === "vi" ? "en" : "vi";
  const params = new URLSearchParams(searchParams.toString());
  params.set("lang", nextLocale);
  return <Link href={`${pathname}?${params.toString()}`} aria-label={locale === "vi" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese"} className={`focus-ring mono text-xs uppercase opacity-70 hover:opacity-100 ${dark ? "text-[var(--paper)]" : "text-[var(--ink)]"}`}>{nextLocale === "en" ? "EN" : "VI"}</Link>;
}
