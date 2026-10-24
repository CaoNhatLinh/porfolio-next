"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_UPLOAD_BYTES } from "../../lib/media/upload-validation";
import { adminInputClass } from "./fields";

export function MediaUpload({ onUploaded, pdfOnly = false }: { onUploaded?: (url: string) => void; pdfOnly?: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload() {
    if (!file) { setMessage("Chọn file trước khi tải lên."); return; }
    if (file.size > MAX_UPLOAD_BYTES) { setMessage("File vượt quá 4 MB. Hãy tối ưu file trước khi tải lên."); return; }
    const form = new FormData(); form.set("file", file); form.set("altText", alt);
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok || !result.data?.url) throw new Error(result.error?.message ?? "Không tải được file.");
      setMessage(`Đã tải lên: ${result.data.url}`); onUploaded?.(result.data.url); setFile(undefined);
      if (input.current) input.current.value = "";
      router.refresh();
    } catch (failure) { setMessage(failure instanceof Error ? failure.message : "Mất kết nối máy chủ."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-4 rounded-xl border border-black/15 bg-[var(--paper)] p-5"><h2 className="text-lg font-semibold">{pdfOnly ? "Tải CV PDF" : "Tải ảnh hoặc tài liệu"}</h2><p className="text-xs leading-relaxed text-black/60">{pdfOnly ? "PDF" : "JPG, PNG, WebP, AVIF, PDF"} · Tối đa 4 MB. File trong thư viện này có thể truy cập công khai.</p><label className="block text-sm">Chọn file<input ref={input} type="file" accept={pdfOnly ? "application/pdf" : "image/jpeg,image/png,image/webp,image/avif,application/pdf"} disabled={busy} onChange={(event) => setFile(event.target.files?.[0])} className={adminInputClass} /></label>{file && <p className="break-all text-xs">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>}<label className="block text-sm">Mô tả ảnh / tên tài liệu<input value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={240} className={adminInputClass} /></label><button type="button" onClick={upload} disabled={busy} className="button-accent disabled:opacity-50">{busy ? "Đang tải lên…" : "Tải lên"}</button>{message && <p role="status" className="break-all text-xs">{message}</p>}</div>;
}
