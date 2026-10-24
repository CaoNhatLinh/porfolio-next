"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { adminInputClass } from "./fields";
import { MediaUpload } from "./media-upload";
type Asset = { id: string; url: string; original_name: string; alt_text: string };

export function AssetField({ name, label, value = "", onSelect, onValueChange }: { name: string; label: string; value?: string; onSelect?: (url: string) => void; onValueChange?: (url: string) => void }) {
  const [url, setUrl] = useState(value);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  async function load(nextPage: number) {
    setBusy(true); setError("");
    try { const response = await fetch(`/api/media?page=${nextPage}`); const result = await response.json(); if (!response.ok) throw new Error(result.error?.message); setAssets(result.data); setTotal(result.count ?? 0); setPage(nextPage); }
    catch { setError("Không tải được thư viện. Bạn vẫn có thể tải ảnh mới hoặc nhập URL."); }
    finally { setBusy(false); }
  }
  function select(nextUrl: string) { setUrl(nextUrl); setOpen(false); onSelect?.(nextUrl); onValueChange?.(nextUrl); field.current?.dispatchEvent(new Event("change", { bubbles: true })); }
  return <div className="min-w-0"><label className="block text-sm font-medium">{label}<input ref={field} name={name} value={url} onChange={(event) => { setUrl(event.target.value); onValueChange?.(event.target.value); }} className={adminInputClass} /></label><Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (next) void load(1); }}><Dialog.Trigger asChild><button type="button" className="mt-2 text-xs font-medium underline underline-offset-4">Chọn ảnh / tải ảnh mới</button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" /><Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(95vw,780px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-[var(--paper)] p-5 text-black"><div className="flex justify-between gap-4"><Dialog.Title className="text-xl font-semibold">Thư viện ảnh</Dialog.Title><Dialog.Close className="rounded border border-black/20 px-3 py-1 text-sm">Đóng</Dialog.Close></div><Dialog.Description className="mt-2 text-sm text-black/60">Chọn một ảnh đã tải lên hoặc thêm ảnh mới.</Dialog.Description><div className="mt-5"><MediaUpload onUploaded={select} /></div>{error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}{busy && <p className="mt-4" role="status">Đang tải…</p>}<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => select(asset.url)} className="overflow-hidden rounded-lg border border-black/15 p-2 text-left hover:border-orange-500"><img src={asset.url} alt={asset.alt_text || asset.original_name} className="aspect-[4/3] w-full object-contain" /><span className="mt-2 block truncate text-xs">{asset.original_name || "Ảnh"}</span></button>)}</div><div className="mt-4 flex gap-4 text-sm">{page > 1 && <button type="button" onClick={() => load(page - 1)}>Trang trước</button>}{page * 20 < total && <button type="button" onClick={() => load(page + 1)}>Trang sau</button>}</div></Dialog.Content></Dialog.Portal></Dialog.Root></div>;
}
