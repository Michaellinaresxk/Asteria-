import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getNaturalEvents, normalizeEonetEvents } from './eonet';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const raw = {
  id: 'EONET_1',
  title: 'Incendio de prueba',
  link: 'https://example.com/event',
  categories: [{ id: 'wildfires', title: 'Wildfires' }],
  geometry: [
    { date: '2026-11-20', type: 'Point', coordinates: [-10, 40] },
    { date: '2026-11-23', type: 'Point', coordinates: [-11, 41], magnitudeValue: 12, magnitudeUnit: 'ha' },
  ],
};

describe('eonet service', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('uses the latest point and its coordinates', () => {
    const [event] = normalizeEonetEvents([raw]);
    expect(event).toMatchObject({
      id: 'EONET_1',
      category: 'Wildfires',
      date: '2026-11-23',
      latitude: 41,
      longitude: -11,
      magnitude: '12 ha',
    });
  });

  it('requests open events', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { events: [raw] } } as never);

    const events = await getNaturalEvents(5);

    expect(events).toHaveLength(1);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: { status: 'open', limit: 5 },
    });
  });
});
