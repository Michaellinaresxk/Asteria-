import { describe, expect, it } from 'vitest';

import { getChildPosition, getOrbitAngle, getOrbitPosition, getOrbitRingPoints } from './orbits';

describe('orbit math', () => {
  it('places a body on the XZ plane using the orbit radius', () => {
    expect(getOrbitPosition(4, 0)).toEqual([4, 0, 0]);
    const quarter = getOrbitPosition(4, Math.PI / 2);
    expect(quarter[0]).toBeCloseTo(0);
    expect(quarter[2]).toBeCloseTo(4);
  });

  it('tilts the orbit when an inclination is provided', () => {
    const flat = getOrbitPosition(4, Math.PI / 2, 0);
    const tilted = getOrbitPosition(4, Math.PI / 2, 0.4);
    expect(flat[1]).toBe(0);
    expect(tilted[1]).toBeGreaterThan(0);
  });

  it('advances the angle linearly with elapsed time', () => {
    expect(getOrbitAngle(1, 0.5, 4)).toBe(3);
  });

  it('offsets satellite positions by their parent position', () => {
    expect(getChildPosition([4, 0, 0], [0, 1, 0])).toEqual([4, 1, 0]);
  });

  it('closes the orbit ring with the starting point', () => {
    const points = getOrbitRingPoints(3, 0, 8);
    expect(points).toHaveLength(9);
    points[0]!.forEach((value, index) => {
      expect(value).toBeCloseTo(points.at(-1)![index]!, 8);
    });
  });
});
