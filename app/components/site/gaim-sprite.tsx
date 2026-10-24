"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export function GaimSprite({ locale }: { locale: "vi" | "en" }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const query = window.matchMedia("(prefers-reduced-motion: reduce)"); const sync = () => setAnimate(!query.matches); sync(); query.addEventListener("change", sync); return () => query.removeEventListener("change", sync); }, []);
  return <div className="flex flex-col items-center gap-5"><Image unoptimized width={320} height={180} src={animate ? "/media/citrus-rider/kamen-rider-gaim-capsem.gif" : "/media/citrus-rider/kamen-rider-gaim-capsem-still.png"} alt="Kamen Rider Gaim pixel animation" className="h-40 w-auto max-w-full object-contain [image-rendering:pixelated]" /><button type="button" aria-pressed={animate} className="focus-ring rounded-full border border-black/20 px-4 py-2 text-sm" onClick={() => setAnimate(!animate)}>{locale === "vi" ? animate ? "Dừng GIF" : "Chạy GIF" : animate ? "Pause GIF" : "Play GIF"}</button></div>;
}
