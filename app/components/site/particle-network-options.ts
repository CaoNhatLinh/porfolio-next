import type { ISourceOptions } from "@tsparticles/engine";

export function particleNetworkOptions(compact: boolean): ISourceOptions {
  return {
    fullScreen: { enable: false },
    fpsLimit: 40,
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    particles: {
      number: { value: compact ? 34 : 64, density: { enable: true } },
      color: { value: ["#a7aaa2", "#a7aaa2", "#a7aaa2", "#ff8a1f"] },
      shape: { type: "circle" },
      opacity: { value: { min: 0.28, max: 0.58 } },
      size: { value: { min: 1, max: 2.2 } },
      links: { enable: true, color: "#a7aaa2", distance: 135, opacity: 0.14, width: 0.65 },
      move: { enable: true, speed: 0.35, outModes: { default: "out" } },
    },
    interactivity: {
      detectsOn: "window",
      events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: false } },
      modes: { grab: { distance: 185, links: { color: "#ff8a1f", opacity: 0.55 } } },
    },
    responsive: [{ maxWidth: 767, options: {
      fpsLimit: 24,
      particles: { number: { value: compact ? 14 : 22 }, links: { distance: 100, opacity: 0.1 } },
      interactivity: { events: { onHover: { enable: false } } },
    } }],
  };
}
