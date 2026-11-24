import { describe, expect, it } from 'vitest';

import { JOURNEY_STOPS } from '../data/journeyStops';
import { clamp01, getActiveStopIndex, getJourneyPose, getScrollProgress } from './journey';

describe('journey camera utils', () => {
  it('clamps values to 0..1 and handles non-finite numbers', () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(7)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
  });

  it('normalizes scroll progress and avoids division by zero', () => {
    expect(getScrollProgress(250, 1000)).toBe(0.25);
    expect(getScrollProgress(2000, 1000)).toBe(1);
    expect(getScrollProgress(50, 0)).toBe(0);
  });

  it('interpolates between stops without overshooting the last one', () => {
    const start = getJourneyPose(0, 0, 0, 0);
    const end = getJourneyPose(1, 0, 0, 0);

    expect(start.position).toEqual(JOURNEY_STOPS[0]!.position);
    expect(end.position).toEqual(JOURNEY_STOPS.at(-1)!.position);

    const middle = getJourneyPose(0.5, 0, 0, 0);
    expect(middle.position[2]).toBeLessThan(start.position[2]);
    expect(middle.position[2]).toBeGreaterThan(end.position[2]);
  });

  it('applies pointer parallax and idle drift without clamping failures', () => {
    const base = getJourneyPose(0.4, 0, 0, 0);
    const shifted = getJourneyPose(0.4, 1, -1, Math.PI / 2);

    expect(shifted.position[0]).toBeGreaterThan(base.position[0]);
    expect(shifted.position[1]).toBeGreaterThan(base.position[1]);
    expect(getJourneyPose(0.4, 50, -50, 0).position[0]).toBeLessThan(20);
  });

  it('selects the closest stop for the active label', () => {
    expect(getActiveStopIndex(0)).toBe(0);
    expect(getActiveStopIndex(1)).toBe(JOURNEY_STOPS.length - 1);
    expect(getActiveStopIndex(0.5)).toBe(2);
  });
});
