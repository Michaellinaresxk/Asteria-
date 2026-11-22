import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import { getIssPosition } from './iss';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('getIssPosition', () => {
  it('returns ISS position data', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { latitude: 1.2, longitude: 3.4, altitude: 420, velocity: 27600, visibility: 'daylight', timestamp: 1700000000 },
    } as never);

    const pos = await getIssPosition();
    expect(pos.latitude).toBe(1.2);
    expect(pos.velocity).toBe(27600);
  });
});
