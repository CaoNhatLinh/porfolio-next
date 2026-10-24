"use client";

import { useState } from "react";
import type { FragmentNote } from "../../features/orange-protocol/notebook";
import styles from "./protocol-workbench.module.css";

export function ProtocolWorkbench({ notes, locale }: { notes: FragmentNote[]; locale: "vi" | "en" }) {
  const vi = locale === "vi";
  const [pieces, setPieces] = useState(notes);
  const [key, setKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const decoded = pieces.map(piece => {
    const value = parseInt(piece.fragment.split(":")[1], 2) ^ key;
    return value >= 32 && value <= 126 ? String.fromCharCode(value) : "·";
  }).join("");

  function move(from: number, to: number) {
    if (from < 0 || to < 0 || from >= pieces.length || to >= pieces.length || from === to) return;
    const updated = [...pieces];
    updated.splice(to, 0, updated.splice(from, 1)[0]);
    setPieces(updated);
    setAnnouncement(vi ? `Đã đưa ${pieces[from].folio} tới vị trí ${to}.` : `Moved ${pieces[from].folio} to position ${to}.`);
  }

  return <div className={styles.bench}>
    <div className={styles.header}><h3>{vi ? "Bàn giải mã" : "Decoding desk"}</h3><span>{pieces.length} / 8</span></div>
    <p>{vi ? "Kéo để sắp mảnh, hoặc dùng hai nút mũi tên. Thử khóa bằng tám công tắc bên dưới. Bàn này chỉ tính giúp bạn, không tự chọn đáp án." : "Drag to reorder, or use the arrow buttons. Try a key with the eight switches below. This desk does the calculation, not the solving."}</p>
    <ol className={styles.pieces}>
      {pieces.map((piece, index) => <li key={piece.folio} draggable onDragStart={event => event.dataTransfer.setData("text/plain", piece.folio)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); move(pieces.findIndex(item => item.folio === event.dataTransfer.getData("text/plain")), index); }}>
        <span className={styles.index}>{index}</span><div><span>{piece.folio}</span><code>{piece.fragment}</code></div>
        <div className={styles.arrows}><button type="button" disabled={index === 0} aria-label={`${vi ? "Đưa lên" : "Move up"} ${piece.folio}`} onClick={() => move(index, index - 1)}>↑</button><button type="button" disabled={index === pieces.length - 1} aria-label={`${vi ? "Đưa xuống" : "Move down"} ${piece.folio}`} onClick={() => move(index, index + 1)}>↓</button></div>
      </li>)}
    </ol>
    <fieldset className={styles.switches}><legend>{vi ? "Khóa XOR · bit cao nhất ở bên trái" : "XOR key · highest bit on the left"}</legend>
      {Array.from({ length: 8 }, (_, index) => { const bit = 1 << (7 - index); const active = (key & bit) !== 0; return <button key={bit} type="button" aria-label={`Bit ${7 - index}`} aria-pressed={active} onClick={() => setKey(value => value ^ bit)}>{active ? "1" : "0"}</button>; })}
    </fieldset>
    <div className={styles.output}><span>ASCII / {vi ? "đọc thử" : "preview"}</span><output aria-label={vi ? "Kết quả giải mã" : "Decoded preview"}>{decoded || "········"}</output></div>
    <p className={styles.feedback} role="status">{announcement}</p>
  </div>;
}
