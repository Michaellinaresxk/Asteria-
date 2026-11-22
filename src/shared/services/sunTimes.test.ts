import { describe, expect, it, vi } from 'vitest';

import axios from 'axios';

import { getSunTimes } from './sunTimes';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('getSunTimes', () => {
  it('maps sunrise-sunset API response', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        status: 'OK',
        results: {
          sunrise: '2026-11-22T12:30:00+00:00',
          sunset: '2026-11-22T23:00:00+00:00',
          solar_noon: '2026-11-22T17:45:00+00:00',
          civil_twilight_begin: '2026-11-22T12:05:00+00:00',
          civil_twilight_end: '2026-11-22T23:25:00+00:00',
          day_length: 37800,
        },
      },
    } as never);

    const result = await getSunTimes(19.4326, -99.1332, new Date('2026-11-22T00:00:00Z'));

    expect(result.sunrise).toContain('12:30:00');
    expect(result.dayLengthSeconds).toBe(37800);
  });
});
