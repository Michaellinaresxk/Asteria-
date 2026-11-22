import { describe, expect, it } from 'vitest';

import { getMoonPhase } from './moonPhase';

describe('getMoonPhase', () => {
  it('returns a valid phase shape', () => {
    const phase = getMoonPhase(new Date('2026-11-22T12:00:00Z'));
    expect(phase.phase).toBeTypeOf('string');
    expect(phase.emoji).toBeTypeOf('string');
    expect(phase.illumination).toBeGreaterThanOrEqual(0);
    expect(phase.illumination).toBeLessThanOrEqual(100);
  });

  it('returns new moon near known new moon date', () => {
    const phase = getMoonPhase(new Date('2000-01-06T18:14:00Z'));
    expect(phase.phase).toBe('Luna nueva');
  });
});
