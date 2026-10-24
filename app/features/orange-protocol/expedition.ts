"use client";

import { useSyncExternalStore } from "react";

const key = "kamling.orange-protocol.expedition";
const eventName = "orange-protocol-expedition";
let memoryEnabled = false;

function readExpedition() {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? memoryEnabled : stored === "on";
  }
  catch { return memoryEnabled; }
}

function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(eventName, listener); window.removeEventListener("storage", listener); };
}

export function setExpedition(enabled: boolean) {
  memoryEnabled = enabled;
  try { localStorage.setItem(key, enabled ? "on" : "off"); } catch { /* The current page still works without storage. */ }
  window.dispatchEvent(new Event(eventName));
}

export function useExpedition() {
  return useSyncExternalStore(subscribe, readExpedition, () => false);
}
