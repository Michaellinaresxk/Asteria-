import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNearEarthObjects } from '@/shared/services/neoWs';
import type { NearEarthObject } from '@/shared/types/neo';

import { useNearEarthObjects } from './useNearEarthObjects';

vi.mock('@/shared/services/neoWs', () => ({ getNearEarthObjects: vi.fn() }));

const object: NearEarthObject = {
  id: '123',
  name: '(2027 AA)',
  date: '2027-01-02',
  jplUrl: 'https://example.com/jpl',
  hazardous: false,
  distanceLunar: 2.5,
  velocityKmS: 12,
  diameterMinM: 5,
  diameterMaxM: 10,
};

describe('useNearEarthObjects', () => {
  beforeEach(() => vi.mocked(getNearEarthObjects).mockReset());

  it('caches loaded ranges and exposes converted asteroid events', async () => {
    vi.mocked(getNearEarthObjects).mockResolvedValue([object]);

    const first = useNearEarthObjects();
    await first.loadRange(new Date(2027, 0, 1), new Date(2027, 0, 3));

    expect(first.events.value).toHaveLength(1);
    expect(first.events.value[0]).toMatchObject({ type: 'asteroid', fullDate: '2027-01-02' });
    expect(first.count.value).toBe(1);
    expect(getNearEarthObjects).toHaveBeenCalledTimes(1);

    const second = useNearEarthObjects();
    await second.loadRange(new Date(2027, 0, 1), new Date(2027, 0, 3));

    expect(second.events.value).toHaveLength(1);
    expect(getNearEarthObjects).toHaveBeenCalledTimes(1);
  });

  it('exposes an error and clears loading when the response cannot be processed', async () => {
    vi.mocked(getNearEarthObjects).mockResolvedValue(null as never);

    const state = useNearEarthObjects();
    await state.loadRange(new Date(2027, 1, 1), new Date(2027, 1, 2));

    expect(state.error.value).toContain('No se pudieron cargar');
    expect(state.loading.value).toBe(false);
  });
});
