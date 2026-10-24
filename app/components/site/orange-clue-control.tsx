"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { collectFragment } from "../../features/orange-protocol/notebook";
import { useExpedition } from "../../features/orange-protocol/expedition";
import styles from "./orange-clue-control.module.css";

export function OrangeClueControl({ folio, fragment, locale }: { folio: string; fragment: string; locale: "vi" | "en" }) {
  const enabled = useExpedition();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState(0);
  const [saved, setSaved] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  const vi = locale === "vi";
  const mark = <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1a5 5 0 1 1-4.33 2.5M6 1v3m0 4v3M1 6h3m4 0h3" stroke="currentColor" strokeWidth=".75" /></svg>;
  function close() { setOpen(false); trigger.current?.focus(); }
  function turnLock() {
    setTurns(value => value + 1);
    if (turns === 2) requestAnimationFrame(() => saveButton.current?.focus());
  }
  function recordFragment() {
    const stored = collectFragment(folio, fragment);
    setSaved(stored); setStorageBlocked(!stored);
    if (stored) requestAnimationFrame(() => closeButton.current?.focus());
  }
  return <>
    {enabled ? <button ref={trigger} className={styles.mark} type="button" aria-label={vi ? "Kiểm tra dấu khắc" : "Inspect mark"} aria-expanded={open} onClick={() => setOpen(!open)}>{mark}</button> : mark}
    {enabled && open && createPortal(<aside className={styles.panel} aria-label="Orange Protocol" onKeyDown={event => { if (event.key === "Escape") close(); }}>
      <div className={styles.heading}><span>OP / {folio}</span><button ref={closeButton} autoFocus type="button" onClick={close} aria-label={vi ? "Đóng" : "Close"}>×</button></div>
      <p>{vi ? "Xoay để khớp hai dấu khuyết." : "Turn to align the two notches."}</p>
      <div className={styles.lock} data-aligned={turns === 3}><span aria-hidden="true">▾</span><button type="button" disabled={turns === 3} aria-label={vi ? "Xoay một nấc" : "Turn one step"} onClick={turnLock}><svg viewBox="0 0 80 80" style={{ transform: `rotate(${90 + turns * 90}deg)` }} aria-hidden="true"><circle cx="40" cy="40" r="29" fill="none" stroke="currentColor" strokeWidth="7" strokeDasharray="166 17" transform="rotate(-73 40 40)"/><path d="M40 22v36M22 40h36" stroke="currentColor"/></svg></button></div>
      {turns === 3 ? <><code>{fragment}</code><button ref={saveButton} className={styles.save} type="button" disabled={saved} onClick={recordFragment}>{saved ? (vi ? "Đã ghi vào sổ ✓" : "Recorded ✓") : (vi ? "Ghi lại mảnh này" : "Record fragment")}</button></> : <small>{vi ? "Chạm hoặc dùng Enter để xoay." : "Tap or press Enter to turn."}</small>}
      <span className={styles.status} role="status">{storageBlocked ? (vi ? "Không lưu được. Bạn có thể chép mã ở trên để giữ lại." : "Couldn’t save. Copy the code above to keep it.") : saved ? (vi ? "Mảnh đã được tìm thấy." : "Fragment discovered.") : ""}</span>
    </aside>, document.body)}
  </>;
}
