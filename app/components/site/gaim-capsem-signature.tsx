"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { Locale } from "../../features/content/types";
import styles from "./gaim-capsem-signature.module.css";

const CAPSEM_GIF = "/media/citrus-rider/kamen-rider-gaim-capsem.gif";
const CAPSEM_STILL = "/media/citrus-rider/kamen-rider-gaim-capsem-still.png";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const GaimCapsemScene = dynamic(
  () => import("./gaim-capsem-scene").then((module) => module.GaimCapsemScene),
  { ssr: false },
);

export function GaimCapsemSignature({ locale }: { locale: Locale }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [keyboardSpin, setKeyboardSpin] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
  const instruction = locale === "vi" ? "Xoay Gaim Capsem 3D" : "Rotate 3D Gaim Capsem";
  const closeLabel = locale === "vi" ? "Đóng hoạt ảnh Gaim" : "Close Gaim animation";
  const closeCapsem = useCallback(() => {
    setIsUnlocked(false);
    viewportRef.current?.focus({ preventScroll: true });
  }, []);
  const unlockCapsem = useCallback(() => setIsUnlocked(true), []);
  useEffect(() => {
    if (!isUnlocked) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCapsem();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isUnlocked, closeCapsem]);

  return (
    <aside className={styles.root} data-unlocked={isUnlocked} aria-label="Gaim Capsem">
      <div
        ref={viewportRef}
        className={styles.viewport}
        role="button"
        tabIndex={0}
        aria-label={instruction}
        aria-pressed={isUnlocked}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeCapsem();
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (isUnlocked) {
              closeCapsem();
            } else {
              setKeyboardSpin((current) => current + 1);
            }
          }
        }}
      >
        <GaimCapsemScene
          isUnlocked={isUnlocked}
          keyboardActivation={keyboardSpin}
          prefersReducedMotion={prefersReducedMotion}
          onClose={closeCapsem}
          onUnlock={unlockCapsem}
        />
      </div>

      {isUnlocked && (
        <button
          type="button"
          className={styles.sprite}
          aria-label={closeLabel}
          onClick={closeCapsem}
        >
          <Image
            data-capsem-sprite
            src={prefersReducedMotion ? CAPSEM_STILL : CAPSEM_GIF}
            alt=""
            width={299}
            height={120}
            unoptimized
          />
          <span className={styles.closeMark} aria-hidden="true" />
        </button>
      )}
      <span className={styles.screenReaderOnly}>
        {locale === "vi"
          ? "Kéo theo mọi hướng. Kéo nhanh rồi thả để Capsem tiếp tục quay theo quán tính."
          : "Drag in any direction. Flick and release to let the Capsem coast with inertia."}
      </span>
    </aside>
  );
}

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerMotionPreference() {
  return true;
}
