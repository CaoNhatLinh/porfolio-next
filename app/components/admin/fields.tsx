import type { ReactNode } from "react";

export const adminInputClass = "mt-2 w-full rounded-lg border border-black/20 bg-white/60 px-3 py-2.5 text-sm text-black outline-none focus:border-[var(--accent-ink)] focus:ring-2 focus:ring-orange-200";
export function AdminField({ name, label, value = "", type = "text", required = false, multiline = false, children }: { name: string; label: string; value?: string | number; type?: string; required?: boolean; multiline?: boolean; children?: ReactNode }) {
  return <label className="block min-w-0 text-sm font-medium text-black/75">{label}{children ?? (multiline ? <textarea name={name} defaultValue={value} required={required} rows={4} className={adminInputClass} /> : <input name={name} defaultValue={value} required={required} type={type} min={type === "number" ? 0 : undefined} max={type === "number" ? 9999 : undefined} className={adminInputClass} />)}</label>;
}
export function AdminHeading({ title, description, children }: { title: string; description: string; children?: ReactNode }) { return <header className="flex flex-wrap items-end justify-between gap-5 border-b border-black/15 pb-6"><div><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/65">{description}</p></div>{children}</header>; }
