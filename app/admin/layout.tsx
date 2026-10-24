import Link from "next/link";
import { List } from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "../lib/auth/admin";
import { LogoutButton } from "../components/auth/logout-button";
import { BrandLogo } from "../components/brand/brand-logo";
import { AdminNav } from "../components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#e9ebe2] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-[var(--paper)] p-6 lg:block">
        <Link href="/admin" className="focus-ring inline-flex">
          <BrandLogo className="h-16 w-[174px]" />
        </Link>
        <p className="mono mt-4 text-[10px] uppercase tracking-[.14em] text-black/45">
          Không gian riêng
        </p>
        <AdminNav />
        <div className="absolute inset-x-6 bottom-6 border-t border-black/10 pt-5">
          <p className="truncate text-xs text-black/60">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-black/10 bg-[var(--paper)] px-5 py-4 lg:hidden">
          <Link href="/admin" className="display text-xl font-bold">
            Admin
          </Link>
          <div className="flex items-center gap-2">
            <details className="relative">
              <summary className="focus-ring flex cursor-pointer list-none items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-xs">
                <List size={16} /> Menu
              </summary>
              <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-black/10 bg-[var(--paper)] p-2 shadow-xl">
                <AdminNav mobile />
              </div>
            </details>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-10 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
