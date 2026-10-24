"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createFlight, flap, FLIGHT, stepFlight, type FlightPhase } from "./flappy-orange-model";
import { drawFlight } from "./flappy-orange-draw";
import styles from "./flappy-orange.module.css";
import type { OrangeSkin } from "../../features/orange-protocol/reward";
import { protocolEnabled } from "../../features/orange-protocol/config";

const RECORD_KEY = "kamling.flappy-orange.best.v1";
const STEP_SECONDS = 1 / 120;
const CLUE_SCORE = 20;

function readRecord() {
  try {
    const value = Number(localStorage.getItem(RECORD_KEY));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch { return 0; }
}

function saveRecord(score: number) {
  try { localStorage.setItem(RECORD_KEY, String(score)); return true; } catch { return false; }
}

export function FlappyOrange({ locale, night = false, skin = "classic" }: { locale: "vi" | "en"; night?: boolean; skin?: OrangeSkin }) {
  const vi = locale === "vi";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef(createFlight());
  const [phase, setPhase] = useState<FlightPhase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const bestRef = useRef(0);
  const [recordSaved, setRecordSaved] = useState(true);
  const [pilot, setPilot] = useState<HTMLImageElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setPilot(image);
    image.src = "/media/playroom/orange-pilot-marker.png";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => { image.onload = null; preference.removeEventListener("change", updatePreference); };
  }, []);

  useEffect(() => {
    if (phase !== "over") return;
    const frame = requestAnimationFrame(() => retryRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const pause = useCallback(() => {
    if (flightRef.current.phase !== "playing") return;
    flightRef.current = { ...flightRef.current, phase: "paused" };
    setPhase("paused");
  }, []);

  function jump() {
    if (flightRef.current.phase === "paused") return;
    flightRef.current = flap(flightRef.current);
    setScore(flightRef.current.score); setPhase("playing");
  }

  function resume() {
    flightRef.current = { ...flightRef.current, phase: "playing" };
    setPhase("playing"); areaRef.current?.focus();
  }

  function restart() {
    flightRef.current = createFlight(); jump(); areaRef.current?.focus();
  }

  const recordFlight = useCallback((points: number) => {
    const record = Math.max(bestRef.current, readRecord(), points);
    bestRef.current = record;
    setRecordSaved(saveRecord(record));
    setBest(record);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawFlight(canvas, flightRef.current, { night, skin, pilot, reducedMotion });
    if (phase !== "playing") return;
    let frame = 0; let previous = 0; let accumulator = 0;
    function animate(time: number) {
      if (!canvas || flightRef.current.phase !== "playing") return;
      accumulator += previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      const oldScore = flightRef.current.score;
      while (accumulator >= STEP_SECONDS && flightRef.current.phase === "playing") {
        flightRef.current = stepFlight(flightRef.current, STEP_SECONDS, Math.random());
        accumulator -= STEP_SECONDS;
      }
      drawFlight(canvas, flightRef.current, { night, skin, pilot, reducedMotion });
      if (flightRef.current.score !== oldScore) {
        setScore(flightRef.current.score);
        // Persist the milestone immediately, even if the player leaves before crashing.
        if (flightRef.current.score >= CLUE_SCORE) recordFlight(flightRef.current.score);
      }
      if (flightRef.current.phase === "over") {
        recordFlight(flightRef.current.score); setPhase("over"); return;
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phase, night, skin, pilot, reducedMotion, recordFlight]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { bestRef.current = readRecord(); setBest(bestRef.current); });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(entries => { if (!entries[0]?.isIntersecting) pause(); });
    if (areaRef.current) observer.observe(areaRef.current);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("blur", pause); };
  }, [pause]);

  const status = phase === "over" ? (vi ? `Hết lượt. Bạn được ${score} điểm.` : `Game over. You scored ${score}.`)
    : phase === "paused" ? (vi ? "Đã tạm dừng." : "Paused.")
    : phase === "playing" ? (vi ? "Đang chơi." : "Playing.") : (vi ? "Sẵn sàng khi bạn muốn chơi." : "Ready when you are.");

  return (
    <section className={styles.arcade} aria-labelledby="flappy-title">
      <div className={styles.notes}>
        <p className="mono text-xs">02 / Arcade</p>
        <h2 id="flappy-title">Flappy Orange<span>.</span></h2>
        <p className={styles.scribble} aria-hidden="true">a little flight, a little chaos ↗</p>
        <p>{vi ? "Một trái cam, một chiếc máy bay và tay lái của bạn. Chạm để nâng mũi, luồn qua những chiếc ống rồi xem bay được bao xa. Đừng tin vẻ mặt tự tin của phi công :D" : "One orange, one tiny plane, and you at the controls. Tap to climb, slip between the pipes, and see how far you get. Don’t trust the pilot’s confident face :D"}</p>
        <dl className={styles.records}>
          <div><dt>{vi ? "Điểm" : "Score"}</dt><dd data-testid="flight-score">{String(score).padStart(2, "0")}</dd></div>
          <div><dt>{vi ? "Kỷ lục máy này" : "Best on this device"}</dt><dd>{String(best).padStart(2, "0")}</dd></div>
        </dl>
        <p className={styles.instructions} id="flight-help">{vi ? "Chạm / click hoặc Space / ↑ để bay. P hoặc Esc để tạm dừng. Điểm lưu trên máy này, không có leaderboard." : "Tap / click or Space / ↑ to flap. P or Esc pauses. Scores stay on this device; no leaderboard."}</p>
      </div>
      <div className={styles.machine} data-theme={night ? "night" : "day"} data-skin={skin} data-pilot={pilot ? "loaded" : "fallback"}>
        <div className={styles.machineLabel}><span>KAMLING / ARCADE</span><span>{night ? (vi ? "VƯỜN CAM ĐÊM" : "NIGHT ORCHARD") : (vi ? "CHUYẾN BAY VƯỜN CAM" : "ORCHARD FLIGHT")}</span></div>
        <div ref={areaRef} className={styles.screen} tabIndex={0} role="group"
          aria-label={vi ? "Màn chơi Flappy Orange" : "Flappy Orange game"} aria-describedby="flight-help"
          data-testid="flight-area" data-phase={phase}
          onPointerDown={event => { if ((event.target as HTMLElement).closest("button")) return; event.currentTarget.focus(); if (phase === "playing") jump(); }}
          onKeyDown={event => {
            if (event.target !== event.currentTarget || event.repeat) return;
            if ([" ", "ArrowUp"].includes(event.key)) { event.preventDefault(); if (phase !== "paused") jump(); }
            if (["p", "P", "Escape"].includes(event.key)) { event.preventDefault(); pause(); }
          }}>
          <canvas ref={canvasRef} width={FLIGHT.width} height={FLIGHT.height} aria-hidden="true">{vi ? "Trình duyệt cần hỗ trợ Canvas để chơi." : "This game needs Canvas support."}</canvas>
          {phase === "playing" ? <span className={styles.hud} aria-hidden="true">{score}</span> : null}
          {phase !== "playing" ? <div className={styles.overlay}>
            {phase === "over" ? <span className={styles.crashDoodle} aria-hidden="true">×﹏×</span> : null}
            <p>{phase === "ready" ? (vi ? "Phi công sẵn sàng?" : "Ready, pilot?") : phase === "paused" ? (vi ? "Nghỉ tay chút nhé." : "Take a breather.") : (vi ? "Ối. Hạ cánh hơi sớm." : "Oops. Early landing.")}</p>
            {phase === "over" ? <><div className={styles.result}><span><strong>{score}</strong>{vi ? "ống đã qua" : "pipes cleared"}</span><span><strong>{best}</strong>{vi ? "kỷ lục" : "personal best"}</span></div><small>{vi ? "Máy bay vẫn ổn. Thử thêm lượt nữa?" : "The plane’s fine. Shall we try that again?"}</small></> : null}
            <button ref={retryRef} type="button" onClick={phase === "paused" ? resume : restart}>{phase === "paused" ? (vi ? "Tiếp tục" : "Resume") : phase === "over" ? (vi ? "Chơi lại" : "Play again") : (vi ? "Bắt đầu chơi" : "Start playing")} <span aria-hidden="true">→</span></button>
          </div> : null}
        </div>
        <div className={styles.controls}>
          <span role="status" aria-live="polite">{status}</span>
          <button type="button" disabled={phase !== "playing"} onClick={pause}>{vi ? "Tạm dừng" : "Pause"}</button>
        </div>
        {protocolEnabled && best >= CLUE_SCORE && phase !== "playing" ? <details className={styles.flightClue}>
          <summary>{vi ? "Có mảnh giấy trong buồng lái…" : "There’s a note in the cockpit…"}</summary>
          <p>{vi ? "Đủ 20 rồi. Phi công để lại cho bạn dòng này:" : "Twenty cleared. The pilot left you this:"}</p>
          <blockquote>{vi ? "“Múi cam chỉ đường. Chiếc lá giữ đoạn cuối. Nét dài và nét ngắn không phải vẽ cho vui.”" : "“The orange segments point the way. The leaf keeps the ending. Long and short strokes aren’t just decoration.”"}</blockquote>
          <p>{vi ? "Mang ghi chú này xuống vòng cam ở Orange Protocol. Đây là gợi ý thêm, không thay cho tám mảnh cần tìm." : "Take this note to the dial in Orange Protocol. It’s an extra hint, not a replacement for the eight fragments."}</p>
          <small>{recordSaved ? (vi ? "Đã giữ lại cùng kỷ lục trên máy này." : "Kept with your record on this device.") : (vi ? "Browser đang chặn lưu. Hãy chụp lại ghi chú trước khi rời trang." : "Storage is blocked. Take a screenshot of the note before leaving.")}</small>
        </details> : null}
      </div>
    </section>
  );
}
