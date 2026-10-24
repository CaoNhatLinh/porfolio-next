const ROTATION_PER_PIXEL = 0.012;
const MAX_ANGULAR_VELOCITY = 24;
const ROTATION_FRICTION = 1.35;
const MIN_ANGULAR_VELOCITY = 0.02;
const UNLOCK_ROTATION = Math.PI * 1.5;

export function angularVelocityFromDrag(deltaInPixels: number, elapsedInMilliseconds: number) {
  const elapsedInSeconds = Math.max(elapsedInMilliseconds, 1) / 1000;
  const angularVelocity = (deltaInPixels * ROTATION_PER_PIXEL) / elapsedInSeconds;
  return clamp(angularVelocity, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY);
}

export function integrateAngularInertia(
  rotation: number,
  angularVelocity: number,
  deltaInSeconds: number,
) {
  const nextVelocity = angularVelocity * Math.exp(-ROTATION_FRICTION * deltaInSeconds);
  const nextRotation = rotation + ((angularVelocity + nextVelocity) / 2) * deltaInSeconds;

  return {
    rotation: nextRotation,
    velocity: Math.abs(nextVelocity) < MIN_ANGULAR_VELOCITY ? 0 : nextVelocity,
  };
}

export function hasUnlockedCapsem(accumulatedRotation: number) {
  return accumulatedRotation >= UNLOCK_ROTATION;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}
