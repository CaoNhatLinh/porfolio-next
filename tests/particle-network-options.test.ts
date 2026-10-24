import { describe, expect, it } from "vitest";
import { particleNetworkOptions } from "../app/components/site/particle-network-options";

describe("particle network configuration", () => {
  it("stays inside its section and pauses when it is not visible", () => {
    const options = particleNetworkOptions(false);
    expect(options.fullScreen).toEqual({ enable: false });
    expect(options.pauseOnBlur).toBe(true);
    expect(options.pauseOnOutsideViewport).toBe(true);
  });
  it("connects particles to the pointer without enabling click effects", () => {
    expect(particleNetworkOptions(false).interactivity).toMatchObject({
      detectsOn: "window",
      events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: false } },
      modes: { grab: { links: { color: "#ff8a1f" } } },
    });
  });
  it("reduces density in compact sections and disables touch hover", () => {
    expect(particleNetworkOptions(true).particles?.number?.value).toBeLessThan(particleNetworkOptions(false).particles?.number?.value as number);
    expect(particleNetworkOptions(false).responsive).toMatchObject([{ maxWidth: 767, options: { fpsLimit: 24, interactivity: { events: { onHover: { enable: false } } } } }]);
  });
});
