import { describe, expect, it } from "vitest";

import {
  angularVelocityFromDrag,
  hasUnlockedCapsem,
  integrateAngularInertia,
} from "../app/components/site/gaim-capsem-physics";

describe("Gaim Capsem rotation physics", () => {
  it("turns a fast drag into capped angular velocity", () => {
    expect(angularVelocityFromDrag(240, 16)).toBe(24);
    expect(angularVelocityFromDrag(-240, 16)).toBe(-24);
  });

  it("lets a fast release coast for multiple turns", () => {
    let rotation = 0;
    let velocity = 24;

    for (let frame = 0; frame < 180; frame += 1) {
      ({ rotation, velocity } = integrateAngularInertia(rotation, velocity, 1 / 60));
    }

    expect(rotation).toBeGreaterThan(Math.PI * 4);
    expect(Math.abs(velocity)).toBeLessThan(0.5);
  });

  it("unlocks only after a deliberate rotation", () => {
    expect(hasUnlockedCapsem(Math.PI)).toBe(false);
    expect(hasUnlockedCapsem(Math.PI * 1.6)).toBe(true);
  });
});
