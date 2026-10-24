"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartLineUp,
  FileText,
  Flask,
  FolderOpen,
  Gear,
  House,
  ImageSquare,
  UserCircle,
} from "@phosphor-icons/react";

const items = [
  { href: "/admin", label: "Tổng quan", icon: House },
  { href: "/admin/projects", label: "Dự án", icon: FolderOpen },
  { href: "/admin/articles", label: "Bài viết", icon: FileText },
  { href: "/admin/lab", label: "Lab", icon: Flask },
  { href: "/admin/messages", label: "Tin nhắn", icon: ChartLineUp },
  { href: "/admin/analytics", label: "Phân tích", icon: ChartLineUp },
  { href: "/admin/profile", label: "Hồ sơ", icon: UserCircle },
  { href: "/admin/resume", label: "Kinh nghiệm & kỹ năng", icon: UserCircle },
  { href: "/admin/media", label: "Thư viện ảnh", icon: ImageSquare },
  { href: "/admin/settings", label: "Cài đặt", icon: Gear },
  { href: "/admin/audit", label: "Lịch sử thay đổi", icon: FileText },
] as const;

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={mobile ? "grid gap-1" : "mt-14 grid gap-1"}
      aria-label="Điều hướng quản trị"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${active ? "bg-[var(--ink)] font-semibold text-[var(--paper)]" : "text-black/62 hover:bg-black/5 hover:text-black"}`}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
