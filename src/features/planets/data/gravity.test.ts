import { describe, expect, it } from 'vitest';

import { EARTH_GRAVITY, PLANET_GRAVITY } from './gravity';

describe('planet gravity data', () => {
  it('includes earth gravity constant', () => {
    expect(EARTH_GRAVITY).toBe(9.8);
  });

  it('contains expected planets', () => {
    expect(PLANET_GRAVITY.mars).toBe(3.7);
    expect(PLANET_GRAVITY.jupiter).toBe(24.8);
    expect(PLANET_GRAVITY.moon).toBe(1.62);
  });
});
