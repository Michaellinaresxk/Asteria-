import type { Vec3 } from '@/shared/types/vector';

/** Position on an orbit around the origin (or around a parent body). */
export function getOrbitPosition(radius: number, angle: number, inclination = 0): Vec3 {
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle) * Math.sin(inclination) * radius;
  return [x, y, z];
}

export function getOrbitAngle(initialAngle: number, speed: number, elapsed: number): number {
  return initialAngle + speed * elapsed;
}

/** Adds a satellite position to its parent's position. */
export function getChildPosition(parent: Vec3, child: Vec3): Vec3 {
  return [parent[0] + child[0], parent[1] + child[1], parent[2] + child[2]];
}

/** Points of an orbit ring, used to draw the guide line in the scene. */
export function getOrbitRingPoints(radius: number, inclination = 0, segments = 128): Vec3[] {
  return Array.from({ length: segments + 1 }, (_, index) =>
    getOrbitPosition(radius, (index / segments) * Math.PI * 2, inclination));
}
