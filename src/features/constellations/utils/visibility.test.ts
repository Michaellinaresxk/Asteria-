import { describe, expect, it } from 'vitest';

import { getSeason, getVisibleConstellations } from './visibility';

describe('constellation visibility', () => {
  it('returns winter for north in January', () => {
    expect(getSeason(new Date('2026-01-15'), 40)).toBe('winter');
  });

  it('returns visible constellations for season and hemisphere', () => {
    const visible = getVisibleConstellations(new Date('2026-01-15'), 40);
    expect(visible.some((c) => c.id === 'orion')).toBe(true);
    expect(visible.every((c) => c.hemisphere === 'north' || c.hemisphere === 'both')).toBe(true);
  });
});
