"use client";

import Link from "next/link";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../features/content/types";

const items = [
  { href: "/work", vi: "Dự án", en: "Work" },
  { href: "/about", vi: "Về tôi", en: "About" },
  { href: "/journal", vi: "Bài viết", en: "Journal" },
  { href: "/resume", vi: "CV", en: "Resume" },
  { href: "/playroom", vi: "Góc riêng", en: "Playroom" },
  { href: "/hire", vi: "Thuê tôi", en: "Hire me" },
  { href: "/contact", vi: "Liên hệ", en: "Contact" },
];

export function MobileNav({ locale, dark = false }: { locale: Locale; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  const color = dark ? "text-[var(--paper)]" : "text-[var(--ink)]";
  return <div className="md:hidden"><button ref={buttonRef} type="button" className={`focus-ring inline-flex rounded-full border border-current p-2 ${color}`} aria-label={locale === "vi" ? (open ? "Đóng menu" : "Mở menu") : (open ? "Close navigation" : "Open navigation")} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={20} /> : <List size={20} />}</button>{open && <div className={`absolute inset-x-0 top-full border-b px-4 pb-6 pt-4 shadow-xl ${dark ? "border-white/15 bg-[var(--ink)] text-[var(--paper)]" : "border-black/15 bg-[var(--paper)] text-[var(--ink)]"}`}><nav className="grid gap-1" aria-label={locale === "vi" ? "Điều hướng trên điện thoại" : "Mobile navigation"}>{items.map((item) => <Link key={item.href} href={`${item.href}?lang=${locale}`} onClick={() => setOpen(false)} className="focus-ring flex items-center justify-between border-b border-current/10 py-4 text-2xl">{locale === "vi" ? item.vi : item.en}<ArrowUpRight size={20} /></Link>)}</nav></div>}</div>;
}
