import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getNearEarthObject, getNearEarthObjects, normalizeFeed, type NeoFeedResponse } from './neoWs';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const rawNeo = {
  id: '37465',
  name: '(2026 VQ19)',
  nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2026%20VQ19',
  is_potentially_hazardous_asteroid: true,
  estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 22 } },
  close_approach_data: [{
    close_approach_date: '2026-11-26',
    relative_velocity: { kilometers_per_second: '6.78' },
    miss_distance: { lunar: '0.01', kilometers: '3800' },
  }],
};

const feed: NeoFeedResponse = { near_earth_objects: { '2026-11-26': [rawNeo] } };

describe('neoWs service', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
  });

  it('normalizes a raw feed entry', () => {
    const [object] = normalizeFeed(feed);

    expect(object).toMatchObject({
      id: '37465',
      date: '2026-11-26',
      name: '(2026 VQ19)',
      hazardous: true,
      distanceLunar: 0.01,
      velocityKmS: 6.78,
      diameterMinM: 10,
      diameterMaxM: 22,
    });
  });

  it('skips entries without close approach data', () => {
    expect(normalizeFeed({ near_earth_objects: { '2026-11-26': [{ ...rawNeo, close_approach_data: [] }] } })).toEqual([]);
  });

  it('signals a NASA rate-limit response', async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 429 } });
    await expect(getNearEarthObjects(new Date(2026, 10, 1), new Date(2026, 10, 2)))
      .rejects.toThrow('LÍMITE_NEGOWS');
  });

  it('fetches and normalizes detailed orbital data', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        name: '(2014 WZ365)',
        nasa_jpl_url: 'https://example.com/jpl',
        absolute_magnitude_h: 26,
        is_potentially_hazardous_asteroid: false,
        orbital_data: {
          perihelion_distance: '0.85',
          aphelion_distance: '1.2',
          eccentricity: '0.17',
          inclination: '3.4',
          orbital_period: '365.2',
        },
      },
    } as never);

    const detail = await getNearEarthObject('3699892');

    expect(detail).toMatchObject({
      id: '3699892',
      name: '2014 WZ365',
      perihelionAu: 0.85,
      aphelionAu: 1.2,
      orbitalPeriodDays: 365.2,
    });
    expect(vi.mocked(axios.get).mock.calls[0]?.[0]).toContain('/neo/3699892');
  });

  it('propagates network errors', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('offline'));
    await expect(getNearEarthObjects(new Date(2026, 10, 1), new Date(2026, 10, 2))).rejects.toThrow('offline');
  });

  it('requests one call per 6-day chunk with the expected params', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: feed } as never);

    const objects = await getNearEarthObjects(new Date(2026, 10, 1), new Date(2026, 10, 30));

    expect(axios.get).toHaveBeenCalledTimes(5);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: { start_date: '2026-11-01', end_date: '2026-11-07' },
    });
    expect(objects).toHaveLength(5);
  });
});
