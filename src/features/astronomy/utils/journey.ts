import { JOURNEY_STOPS, type Vec3 } from '../data/journeyStops';

export interface JourneyPose {
  position: Vec3;
  target: Vec3;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** Normalizes a scroll offset into a 0..1 progress value. */
export function getScrollProgress(scrollY: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0;
  return clamp01(scrollY / maxScroll);
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function lerpVec3(from: Vec3, to: Vec3, t: number): Vec3 {
  return [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Which camera stop is closest to the current progress. */
export function getActiveStopIndex(progress: number): number {
  const scaled = clamp01(progress) * (JOURNEY_STOPS.length - 1);
  return Math.min(JOURNEY_STOPS.length - 1, Math.round(scaled));
}

/**
 * Interpolates the camera between stops and adds a small pointer parallax plus
 * an idle drift, so the flight feels alive even when the user is not scrolling.
 */
export function getJourneyPose(progress: number, pointerX = 0, pointerY = 0, drift = 0): JourneyPose {
  const scaled = clamp01(progress) * (JOURNEY_STOPS.length - 1);
  const index = Math.min(JOURNEY_STOPS.length - 2, Math.floor(scaled));
  const t = smoothstep(scaled - index);
  const from = JOURNEY_STOPS[index]!;
  const to = JOURNEY_STOPS[index + 1]!;

  const position = lerpVec3(from.position, to.position, t);
  const target = lerpVec3(from.target, to.target, t);

  const px = Number.isFinite(pointerX) ? Math.max(-1, Math.min(1, pointerX)) : 0;
  const py = Number.isFinite(pointerY) ? Math.max(-1, Math.min(1, pointerY)) : 0;
  const idleX = Math.sin(drift) * 0.18;
  const idleY = Math.sin(drift * 0.8) * 0.12;

  position[0] += px * 0.9 + idleX;
  position[1] += -py * 0.55 + idleY;
  target[0] += px * 0.28;
  target[1] += -py * 0.16;

  return { position, target };
}
