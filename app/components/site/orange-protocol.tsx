"use client";

import { useEffect, useRef, useState } from "react";
import { PROTOCOL_VERSION, type ProtocolReply } from "../../features/orange-protocol/config";
import { readNotebook, type FragmentNote } from "../../features/orange-protocol/notebook";
import { OrangeProtocolDial } from "./orange-protocol-dial";
import { setExpedition, useExpedition } from "../../features/orange-protocol/expedition";
import styles from "./orange-protocol.module.css";
import type { ArcadeReward, OrangeSkin } from "../../features/orange-protocol/reward";
import { OrangeSprite } from "./orange-sprite";
import { ProtocolWorkbench } from "./protocol-workbench";

const hints = {
  vi: ["Dấu tròn nhỏ trong phần mở đầu của tám trang chính có một thuộc tính khác thường. Bật chế độ tìm, xoay dấu khắc rồi ghi mảnh vào Bản soi. Hoặc đọc trực tiếp trong Elements.", "Ba bit bên trái là Gray code: 000→0, 001→1, 011→2, 010→3. Sắp các mảnh theo số đã đổi. Màu cam = 1, màu xám = 0; đọc tám múi từ dấu khuyết, theo chiều kim đồng hồ.", "XOR mỗi byte bên phải với byte lấy từ tám múi, rồi đọc ASCII. Làm theo hai từ vừa tìm được. Tám nét trên chiếc lá cho một byte nữa: nét dài = 1, ngắn = 0, từ trái sang phải. Đổi byte cuối thành hai ký tự hex; nhập 8 chữ cái, dấu gạch ngang, 2 ký tự hex."],
  en: ["The small circular mark near the opening of eight main pages carries an unusual attribute. Enable exploration, align each mark and record it in Field notes. Or inspect it directly in Elements.", "The three left-hand bits use Gray code: 000→0, 001→1, 011→2, 010→3. Sort by the decoded index. Orange = 1, grey = 0; read the eight segments clockwise from the notch.", "XOR each right-hand byte with the byte from the eight segments, then read ASCII. Follow the two words you uncover. The eight leaf veins encode another byte: long = 1, short = 0, left to right. Convert that byte to two hex characters; enter 8 letters, a hyphen, then 2 hex characters."],
};
const messages: Record<string, { vi: string; en: string }> = {
  INCORRECT: { vi: "Chưa khớp. Kiểm tra thứ tự các mảnh và phần cuối mã nhé.", en: "Not quite. Check the fragment order and the end of your code." },
  INVALID_INPUT: { vi: "Nhập mã bạn tìm được, tối đa 32 ký tự.", en: "Enter the code you found, up to 32 characters." },
  UNAVAILABLE: { vi: "Chưa kiểm tra được lúc này. Giữ lại mã rồi thử lại sau nhé.", en: "Couldn’t check your code right now. Keep it and try again later." },
  VERSION_CHANGED: { vi: "Câu đố đã đổi phiên bản. Tải lại trang để tiếp tục nhé.", en: "The puzzle has changed. Reload the page to continue." },
  DISABLED: { vi: "Câu đố đang tạm nghỉ.", en: "The puzzle is taking a break." },
};

export function OrangeProtocol({ locale, reward, onReward, storageBlocked }: { locale: "vi" | "en"; reward: ArcadeReward; onReward: (reward: ArcadeReward) => void; storageBlocked: boolean }) {
  const vi = locale === "vi";
  const exploring = useExpedition();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [rewardClosed, setRewardClosed] = useState(false);
  const solved = reward.unlocked;
  const night = reward.night;
  const [message, setMessage] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [notes, setNotes] = useState<FragmentNote[]>([]);
  const [remaining, setRemaining] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const rewardHeadingRef = useRef<HTMLHeadingElement>(null);
  const rewardReopenRef = useRef<HTMLButtonElement>(null);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || remaining > 0) return;
    setPending(true); setMessage("");
    const controller = new AbortController(); abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/api/orange-protocol/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, version: PROTOCOL_VERSION }), signal: controller.signal });
      const result: ProtocolReply = await response.json();
      if (response.ok && "ok" in result && result.reward === "night-orchard") {
        onReward({ unlocked: true, night: true, skin: "armor" }); setRewardClosed(false); setCode("");
        requestAnimationFrame(() => rewardHeadingRef.current?.focus());
      } else if (response.status === 429) {
        const seconds = Number(response.headers.get("Retry-After"));
        setRemaining(Number.isFinite(seconds) ? Math.max(1, Math.min(seconds, 60)) : 60);
      } else {
        const errorCode = "error" in result ? result.error.code : "UNAVAILABLE";
        setMessage((messages[errorCode] ?? messages.UNAVAILABLE)[locale]);
      }
    } catch { setMessage(messages.UNAVAILABLE[locale]); }
    finally { clearTimeout(timer); setPending(false); }
  }

  return <section className={`${styles.protocol} orange-protocol`} aria-labelledby="protocol-title" data-solved={solved}>
    <header className={styles.masthead}>
      <div>
        <p className={styles.eyebrow}>03 / {vi ? "Giải mã" : "Codebreaker"} <span>{solved ? (vi ? "Đã mở khóa" : "Unlocked") : "OP—01"}</span></p>
        <h2 id="protocol-title">Orange<br /><span>Protocol.</span></h2>
      </div>
      <div className={styles.diagram}><OrangeProtocolDial solved={solved} locale={locale} /><div className={styles.key} aria-label={vi ? "Bảng quy tắc" : "Rule table"}>000 : 0 · 001 : 1<br />011 : 2 · 010 : 3<br /><span>↻ · ⊕ · ASCII</span></div></div>
    </header>
    <div className={styles.content}>
      <div className={styles.exploration}>
        <button className={styles.exploreButton} type="button" aria-pressed={exploring} onClick={() => setExpedition(!exploring)}><span aria-hidden="true">{exploring ? "■" : "↗\uFE0E"}</span>{exploring ? (vi ? "Dừng tìm manh mối" : "Stop exploring") : (vi ? "Bắt đầu tìm manh mối" : "Start exploring")}</button>
        <p>{vi ? "Bật chế độ tìm, xoay các dấu khắc cho khớp rồi ghi lại từng mảnh. Chỉ ghé qua một trang sẽ không thu thập được gì." : "Enable exploration, align the small marks, then record each fragment. Visiting a page alone won’t collect it."}</p>
      </div>
      {solved ? rewardClosed ? <button ref={rewardReopenRef} className={styles.textButton} type="button" onClick={() => { setRewardClosed(false); requestAnimationFrame(() => rewardHeadingRef.current?.focus()); }}>{vi ? "Xem phần thưởng đã mở" : "View unlocked rewards"}</button> : <div className={styles.reward}>
        <div className={styles.stage} aria-hidden="true">
          <span className={styles.stageNumber}>{reward.skin === "armor" ? "02" : "01"}</span>
          <div className={styles.stageSprite} key={reward.skin}><OrangeSprite skin={reward.skin} /></div>
          <span className={styles.stageCaption}>FLAPPY ORANGE / {reward.skin === "armor" ? "CITRUS ARMOR" : "ORIGINAL"}</span>
        </div>
        <div className={styles.rewardControls}>
        <p className={styles.eyebrow}>{vi ? "Phần thưởng của bạn" : "Your reward"} <span aria-hidden="true">↙</span></p>
        <h3 ref={rewardHeadingRef} tabIndex={-1}>{vi ? "Tìm ra rồi." : "You found it."}</h3>
        <p>{vi ? "Cam giáp và vườn cam đêm đã mở. Mình vẽ skin này lấy cảm hứng từ Gaim. Chọn skin, đổi khung cảnh rồi chơi thử nhé." : "Citrus Armor and the night orchard are yours. I drew this skin with a little inspiration from Gaim. Pick your look, set the scene, and give it a flight."}</p>
        <div className={styles.skins} role="group" aria-label={vi ? "Chọn skin" : "Choose a skin"}>
          {(["classic", "armor"] as OrangeSkin[]).map(skin => <button key={skin} type="button" aria-pressed={reward.skin === skin} onClick={() => onReward({ ...reward, skin })}><OrangeSprite skin={skin} /><span>{skin === "classic" ? (vi ? "Cam nguyên bản" : "Classic Orange") : (vi ? "Cam giáp" : "Citrus Armor")}</span><small>{reward.skin === skin ? (vi ? "Đang dùng ✓" : "Equipped ✓") : (vi ? "Chọn dùng" : "Equip")}</small></button>)}
        </div>
        <button type="button" aria-pressed={night} onClick={() => onReward({ ...reward, night: !night })}>{night ? (vi ? "Về ban ngày" : "Switch to daylight") : (vi ? "Bật vườn cam đêm" : "Enter the night orchard")}</button>
        <p className={styles.persistence} role="status">{storageBlocked ? (vi ? "Browser đang chặn lưu trữ. Bạn vẫn dùng được phần thưởng trong lần mở trang này." : "Browser storage is blocked. Rewards still work until you leave this page.") : (vi ? "Lựa chọn được lưu trên thiết bị này, không cần tài khoản." : "Your selection is saved on this device. No account needed.")}</p>
        <button className={styles.textButton} type="button" onClick={() => { setRewardClosed(true); requestAnimationFrame(() => rewardReopenRef.current?.focus()); }}>{vi ? "Đóng phần thưởng" : "Close reward"}</button>
        </div>
      </div> : <>
        <p>{vi ? "Có một câu đố nhỏ ở đây. Những mảnh còn lại nằm đâu đó trên website — có thể bạn đã đi ngang qua chúng rồi." : "There’s a puzzle here. The other pieces are scattered across the site — you may have walked past them already."}</p>
        <form onSubmit={submit} className={styles.form}>
          <label htmlFor="protocol-code">{vi ? "Mã bạn tìm được" : "The code you found"}</label>
          <div><input id="protocol-code" value={code} onChange={event => setCode(event.target.value)} maxLength={32} placeholder="________-__" autoComplete="off" spellCheck={false} autoCapitalize="characters" required aria-describedby="protocol-feedback" /><button type="submit" disabled={pending || remaining > 0}>{pending ? (vi ? "Đang kiểm tra…" : "Checking…") : (vi ? "Thử mã" : "Try code")} <span aria-hidden="true">↗</span></button></div>
          <p id="protocol-feedback" role="status" aria-live="polite">{remaining > 0 ? (vi ? `Nghỉ ${remaining} giây rồi thử tiếp nhé.` : `Try again in ${remaining} seconds.`) : message}</p>
        </form>
      </>}
      <div className={styles.extras}>
        <details onToggle={event => { if (event.currentTarget.open) setNotes(readNotebook()); }}>
          <summary>{vi ? "Bản soi" : "Field notes"}</summary>
          <p>{vi ? "Những mảnh bạn đã tìm và ghi lại trong tab này. Bạn cũng có thể đọc dấu khắc bằng DevTools, không cần chạy lệnh." : "Fragments you found and recorded in this tab. You can also inspect the marks in DevTools; no commands needed."}</p>
          {notes.length ? <ProtocolWorkbench key={notes.map(note => note.folio).join(",")} notes={notes} locale={locale} /> : <p>{vi ? "Chưa ghi được mảnh nào. Nếu browser chặn lưu trữ, bạn vẫn đọc được dấu trên từng trang bằng DevTools." : "No notes yet. If browser storage is blocked, the marks can still be inspected on each page."}</p>}
          <p className={styles.leafNote}>leaf / <code>11001000</code></p>
        </details>
        <details>
          <summary>{vi ? "Cần một gợi ý?" : "Need a hint?"}</summary>
          {hints[locale].slice(0, hintCount).map((hint, index) => <p key={index}>{index + 1}. {hint}</p>)}
          {hintCount < 3 ? <button type="button" className={styles.textButton} onClick={() => setHintCount(value => value + 1)}>{vi ? `Mở gợi ý ${hintCount + 1}/3` : `Reveal hint ${hintCount + 1}/3`}</button> : null}
        </details>
      </div>
    </div>
  </section>;
}
