"use client";

import { Check, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "../../lib/errors/action-result";

type Action = (formData: FormData) => Promise<ActionResult<void>>;

export function ActionForm({ action, children, className = "", guard = false, successHref }: { action: Action; children: React.ReactNode; className?: string; guard?: boolean; successHref?: string }) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult<void> | null, FormData>(async (_previous, formData) => {
    try { const result = await action(formData); if (result.ok) { setDirty(false); if (successHref) router.push(successHref); router.refresh(); } return result; }
    catch { return { ok: false, error: { code: "INTERNAL_ERROR", message: "Không kết nối được máy chủ. Nội dung chưa được lưu." } }; }
  }, null);
  useEffect(() => {
    if (!guard || !dirty) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const navigation = (event: MouseEvent) => { const target = event.target instanceof Element ? event.target.closest("a[href]") : null; if (target && !window.confirm("Có thay đổi chưa lưu. Bạn muốn rời trang?")) { event.preventDefault(); event.stopPropagation(); } };
    window.addEventListener("beforeunload", unload); document.addEventListener("click", navigation, true);
    return () => { window.removeEventListener("beforeunload", unload); document.removeEventListener("click", navigation, true); };
  }, [guard, dirty]);
  return <form action={formAction} className={className} onChange={() => setDirty(true)} aria-busy={pending}><fieldset disabled={pending} className="min-w-0 space-y-4 disabled:opacity-60">{children}</fieldset><div className="mt-2 flex flex-wrap items-center gap-3" aria-live="polite">{state?.ok && !dirty && <p className="inline-flex items-center gap-2 text-sm text-green-700"><Check size={16} /> Đã lưu</p>}{state && !state.ok && <div className="text-sm text-red-700" role="alert"><p className="inline-flex items-center gap-2"><WarningCircle size={16} /> {state.error.message}</p>{state.error.fieldErrors && Object.entries(state.error.fieldErrors).map(([field, messages]) => <p key={field}>{field}: {messages.join(" · ")}</p>)}</div>}{guard && dirty && !pending && <span className="text-xs text-amber-800">Chưa lưu thay đổi</span>}{pending && <span className="inline-flex items-center gap-2 text-xs text-black/60"><CircleNotch size={15} className="animate-spin" /> Đang lưu…</span>}</div></form>;
}
