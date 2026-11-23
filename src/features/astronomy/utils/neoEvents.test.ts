import { describe, expect, it } from 'vitest';
import type { NearEarthObject } from '@/shared/types/neo';

import { neoToEvents } from './neoEvents';

const neo: NearEarthObject = {
  id: '37465',
  name: '(2026 VQ19)',
  date: '2026-11-26',
  jplUrl: 'https://example.com/jpl',
  hazardous: true,
  distanceLunar: 0.01,
  velocityKmS: 6.78,
  diameterMinM: 10,
  diameterMaxM: 22,
};

describe('neoToEvents', () => {
  it('maps close approaches to calendar asteroid events', () => {
    const [event] = neoToEvents([neo]);

    expect(event).toMatchObject({
      id: 'neo-37465-2026-11-26',
      date: '11-26',
      fullDate: '2026-11-26',
      type: 'asteroid',
      detailUrl: 'https://example.com/jpl',
    });
    expect(event?.title).toBe('Acercamiento de 2026 VQ19');
    expect(event?.description).toContain('distancias lunares');
    expect(event?.description).toContain('Potencialmente peligroso');
  });
});
