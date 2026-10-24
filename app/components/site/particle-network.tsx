"use client";

import { useEffect, useId, useRef } from "react";
import type { Container } from "@tsparticles/engine";
import { particleNetworkOptions } from "./particle-network-options";
import styles from "./particle-network.module.css";

let enginePromise: Promise<typeof import("@tsparticles/engine").tsParticles> | undefined;
function loadParticleEngine() {
  enginePromise ??= Promise.all([import("@tsparticles/engine"), import("@tsparticles/slim")])
    .then(async ([{ tsParticles }, { loadSlim }]) => {
      await loadSlim(tsParticles);
      return tsParticles;
    }).catch((error: unknown) => { enginePromise = undefined; throw error; });
  return enginePromise;
}

export function ParticleNetwork({ compact = false }: { compact?: boolean }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let container: Container | undefined;
    let inView = false;
    let cancelled = false;
    let loading = false;

    async function syncPlayback() {
      if (!element || cancelled) return;
      if (motionPreference.matches) {
        container?.destroy();
        container = undefined;
        element.dataset.state = "static";
        return;
      }
      if (!inView || document.hidden) {
        container?.pause();
        element.dataset.state = container ? "paused" : "idle";
        return;
      }
      if (container) {
        container.play();
        element.dataset.state = "active";
        return;
      }
      if (loading) return;
      loading = true;
      try {
        const engine = await loadParticleEngine();
        if (cancelled || motionPreference.matches) return;
        const loaded = await engine.load({ id: `network-${id}`, element, options: particleNetworkOptions(compact) });
        if (cancelled || motionPreference.matches) {
          loaded?.destroy();
          return;
        }
        container = loaded;
        if (container) {
          if (!inView || document.hidden) container.pause();
          element.dataset.state = inView && !document.hidden ? "active" : "paused";
        }
      } catch {
        // Decoration must never block the page if the engine cannot load.
        element.dataset.state = "static";
      } finally {
        loading = false;
      }
    }

    const update = () => { void syncPlayback(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: 0 });
    observer.observe(element);
    motionPreference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      cancelled = true;
      observer.disconnect();
      motionPreference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      container?.destroy();
    };
  }, [compact, id]);

  return <div ref={elementRef} className={styles.network} data-particle-network data-state="idle" aria-hidden="true" />;
}
