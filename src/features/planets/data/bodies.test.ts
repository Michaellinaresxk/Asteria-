import { describe, expect, it } from 'vitest';

import { CELESTIAL_BODIES, getBodyById } from './bodies';

describe('celestial bodies', () => {
  it('contains known bodies', () => {
    expect(CELESTIAL_BODIES.length).toBeGreaterThan(5);
    expect(getBodyById('mars')?.name).toBe('Marte');
  });

  it('returns undefined for unknown body', () => {
    expect(getBodyById('pluto-planet')).toBeUndefined();
  });
});
