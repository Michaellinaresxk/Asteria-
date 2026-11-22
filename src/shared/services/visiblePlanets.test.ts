import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import { getVisiblePlanets } from './visiblePlanets';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('getVisiblePlanets', () => {
  it('returns visible planets data', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: [{ name: 'Mars', constellation: 'Aries', altitude: 30, azimuth: 120, magnitude: 1.2, nakedEyeObject: true }] },
    } as never);

    const planets = await getVisiblePlanets(19.4, -99.1);
    expect(planets).toHaveLength(1);
    expect(planets[0].name).toBe('Mars');
  });
});
