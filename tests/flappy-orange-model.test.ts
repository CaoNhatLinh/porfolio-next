import { describe, expect, it } from "vitest";
import { createFlight, flap, stepFlight, FLIGHT } from "../app/components/site/flappy-orange-model";

describe("Flappy Orange physics", () => {
  it("starts idle and a flap starts a fresh flight", () => {
    const idle = createFlight();
    expect(idle.phase).toBe("ready");
    expect(flap(idle)).toMatchObject({ phase: "playing", velocity: FLIGHT.flapVelocity, score: 0 });
    expect(idle.phase).toBe("ready");
  });
  it("does not advance idle or paused flights", () => {
    const idle = createFlight();
    expect(stepFlight(idle, 1 / 120, 0.5)).toBe(idle);
    const paused = { ...flap(idle), phase: "paused" as const };
    expect(stepFlight(paused, 1 / 120, 0.5)).toBe(paused);
  });
  it("falls under gravity and loses at the floor or ceiling", () => {
    const flight = { ...flap(createFlight()), velocity: 0 };
    expect(stepFlight(flight, 1 / 120, 0.5).y).toBeGreaterThan(flight.y);
    expect(stepFlight({ ...flight, y: FLIGHT.floor - 2 }, 1 / 120, 0.5).phase).toBe("over");
    expect(stepFlight({ ...flight, y: 1 }, 1 / 120, 0.5).phase).toBe("over");
  });
  it("detects a pipe collision but allows passage inside the gap", () => {
    const flight = { ...flap(createFlight()), velocity: 0, pipes: [{ x: FLIGHT.birdX, gapY: 240, passed: false }] };
    expect(stepFlight({ ...flight, y: 70 }, 1 / 120, 0.5).phase).toBe("over");
    expect(stepFlight({ ...flight, y: 240 }, 1 / 120, 0.5).phase).toBe("playing");
  });
  it("scores once after clearing a pipe and never scores a fatal crossing", () => {
    const flight = { ...flap(createFlight()), velocity: 0, pipes: [{ x: FLIGHT.birdX - FLIGHT.halfWidth - FLIGHT.pipeWidth, gapY: 240, passed: false }] };
    const passed = stepFlight({ ...flight, y: 240 }, 1 / 120, 0.5);
    expect(passed.score).toBe(1);
    expect(stepFlight(passed, 1 / 120, 0.5).score).toBe(1);
    expect(stepFlight({ ...flight, y: FLIGHT.floor }, 1 / 120, 0.5).score).toBe(0);
  });
  it("uses the plane nose and tail, not the old circular sprite width", () => {
    const flight = { ...flap(createFlight()), y: 70, velocity: 0, pipes: [{ x: FLIGHT.birdX + 18, gapY: 240, passed: false }] };
    expect(stepFlight(flight, 1 / 120, .5).phase).toBe("over");
    const tailStillInside = { ...flight, y: 240, pipes: [{ x: FLIGHT.birdX - 17 - FLIGHT.pipeWidth, gapY: 240, passed: false }] };
    expect(stepFlight(tailStillInside, 1 / 120, .5).score).toBe(0);
  });
  it("respawns pipes at playable heights and restarts without old score", () => {
    const flight = { ...flap(createFlight()), pipes: [{ x: 100, gapY: 240, passed: true }] };
    const next = stepFlight(flight, 1 / 120, 1);
    expect(next.pipes).toHaveLength(2);
    expect(next.pipes[1].gapY + FLIGHT.gap / 2).toBeLessThan(FLIGHT.floor);
    expect(flap({ ...next, phase: "over", score: 12 }).score).toBe(0);
  });
});
