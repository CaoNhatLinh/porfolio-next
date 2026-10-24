export const FLIGHT = {
  width: 360, height: 480, floor: 440, birdX: 96, radius: 14, halfWidth: 20,
  gravity: 920, flapVelocity: -300, speed: 120, pipeWidth: 54,
  gap: 156, pipeSpacing: 220,
} as const;

export type FlightPhase = "ready" | "playing" | "paused" | "over";
export type FlightPipe = { x: number; gapY: number; passed: boolean };
export type Flight = { phase: FlightPhase; y: number; velocity: number; score: number; distance: number; pipes: FlightPipe[] };

export function createFlight(): Flight {
  return { phase: "ready", y: 220, velocity: 0, score: 0, distance: 0, pipes: [{ x: 420, gapY: 235, passed: false }] };
}

export function flap(flight: Flight): Flight {
  if (flight.phase === "paused") return flight;
  const current = flight.phase === "over" ? createFlight() : flight;
  return { ...current, phase: "playing", velocity: FLIGHT.flapVelocity };
}

function hitsPipe(y: number, pipe: FlightPipe): boolean {
  const overlaps = FLIGHT.birdX + FLIGHT.halfWidth > pipe.x && FLIGHT.birdX - FLIGHT.halfWidth < pipe.x + FLIGHT.pipeWidth;
  return overlaps && (y - FLIGHT.radius < pipe.gapY - FLIGHT.gap / 2 || y + FLIGHT.radius > pipe.gapY + FLIGHT.gap / 2);
}

// The caller uses a fixed timestep, so refresh rate cannot change game speed.
export function stepFlight(flight: Flight, seconds: number, random: number): Flight {
  if (flight.phase !== "playing") return flight;
  const velocity = flight.velocity + FLIGHT.gravity * seconds;
  const y = flight.y + velocity * seconds;
  const distance = flight.distance + FLIGHT.speed * seconds;
  const pipes = flight.pipes.map(pipe => ({ ...pipe, x: pipe.x - FLIGHT.speed * seconds }));
  if (y - FLIGHT.radius <= 0 || y + FLIGHT.radius >= FLIGHT.floor || pipes.some(pipe => hitsPipe(y, pipe))) {
    return { ...flight, phase: "over", y, velocity, pipes, distance };
  }
  let score = flight.score;
  for (const pipe of pipes) {
    if (!pipe.passed && pipe.x + FLIGHT.pipeWidth < FLIGHT.birdX - FLIGHT.halfWidth) { pipe.passed = true; score += 1; }
  }
  const lastPipe = pipes.at(-1);
  if (!lastPipe || lastPipe.x < FLIGHT.width - FLIGHT.pipeSpacing) {
    pipes.push({ x: lastPipe ? lastPipe.x + FLIGHT.pipeSpacing : FLIGHT.width + 60, gapY: 150 + Math.max(0, Math.min(1, random)) * 140, passed: false });
  }
  return { phase: "playing", y, velocity, score, distance, pipes: pipes.filter(pipe => pipe.x + FLIGHT.pipeWidth > 0) };
}
