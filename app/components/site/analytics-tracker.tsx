"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TOKEN_KEY = "portfolio_visitor_token";
let memoryToken: string | undefined;

function token() {
  try {
    const existing = window.localStorage.getItem(TOKEN_KEY);
    if (existing) return existing;
    const generated = crypto.randomUUID().replaceAll("-", "");
    window.localStorage.setItem(TOKEN_KEY, generated);
    return generated;
  } catch {
    memoryToken ??= crypto.randomUUID().replaceAll("-", "");
    return memoryToken;
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || ["/admin", "/login", "/api", "/preview"].some((prefix) => pathname.startsWith(prefix))) return;
    const visitorToken = token();
    const viewId = crypto.randomUUID();
    let activeSince = document.hidden ? null : performance.now();
    let engagedMs = 0;
    let finished = false;
    const collectEngagement = () => {
      if (activeSince !== null) engagedMs += performance.now() - activeSince;
      activeSince = document.hidden ? null : performance.now();
    };
    const viewport = window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
    const payload = () => JSON.stringify({ eventName: "page_view", viewId, path: pathname, referrer: document.referrer || undefined, visitorToken, viewport, engagedMs: Math.min(3_600_000, Math.round(engagedMs)) });
    void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload(), keepalive: true }).catch(() => undefined);
    const flush = () => {
      collectEngagement();
      const body = payload();
      if (!navigator.sendBeacon?.("/api/analytics/events", new Blob([body], { type: "application/json" }))) {
        void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
      }
    };
    const finish = () => { if (!finished) { flush(); finished = true; } };
    const visibilityChanged = () => { collectEngagement(); if (document.hidden) flush(); };
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      finish();
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [pathname]);
  return null;
}

export function trackPortfolioEvent(eventName: string, path = window.location.pathname) {
  try {
    const viewport = window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
    void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventName, path, visitorToken: token(), viewport }), keepalive: true }).catch(() => undefined);
  } catch {
    // Analytics must never interrupt the primary action.
  }
}
