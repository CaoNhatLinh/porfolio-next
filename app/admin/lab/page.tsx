import { Flask, Plus } from "@phosphor-icons/react/dist/ssr";
import { createLabItemAction, saveLabItemAction } from "../actions";
import { LabEditorForm } from "../../components/admin/lab-editor-form";
import { getAdminUser } from "../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export const dynamic = "force-dynamic";

async function loadLabItems() {
  try { const user = await getAdminUser(); if (!user) return []; const { data, error } = await createSupabaseAdminClient().from("lab_items").select("id, slug, title, summary, status, cover_image, demo_url, repo_url, sort_order, updated_at").eq("owner_id", user.id).order("sort_order"); return error ? [] : data ?? []; } catch { return []; }
}

function localized(value: unknown, locale: "vi" | "en") { return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : ""; }

export default async function AdminLabPage() {
  const items = await loadLabItems();
  return <div><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mono flex items-center gap-2 text-xs uppercase tracking-[.15em] text-black/45"><Flask size={16} /> Experiments</p><h1 className="display mt-3 text-6xl font-bold leading-[.8] md:text-8xl">Lab</h1></div><span className="mono text-xs text-black/45">{items.length} items</span></div><p className="mt-6 max-w-xl text-sm leading-relaxed text-black/55">Publish experiments with a clear state and a useful action. The public About page reads only published items.</p><section className="mt-10 grid gap-5">{items.length === 0 ? <LabEditorForm action={createLabItemAction} isNew values={{ slug: "", title: { vi: "", en: "" }, summary: { vi: "", en: "" }, status: "DRAFT", sortOrder: 1 }} /> : items.map((item) => <LabEditorForm key={item.id} action={saveLabItemAction} values={{ id: item.id, updatedAt: item.updated_at, slug: item.slug, title: { vi: localized(item.title, "vi"), en: localized(item.title, "en") }, summary: { vi: localized(item.summary, "vi"), en: localized(item.summary, "en") }, status: item.status, coverImage: item.cover_image ?? "", demoUrl: item.demo_url ?? "", repoUrl: item.repo_url ?? "", sortOrder: item.sort_order ?? 0 }} />)}</section><section className="mt-12 border-t border-black/10 pt-8"><h2 className="flex items-center gap-2 text-lg font-medium"><Plus size={18} /> Add another experiment</h2><LabEditorForm action={createLabItemAction} isNew values={{ slug: "", title: { vi: "", en: "" }, summary: { vi: "", en: "" }, status: "DRAFT", sortOrder: items.length + 1 }} /></section></div>;
}
