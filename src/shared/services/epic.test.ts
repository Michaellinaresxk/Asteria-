import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { epicImageUrl, getEpicImages, normalizeEpicImages } from './epic';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const raw = {
  identifier: '20261121004555',
  date: '2026-11-21 00:41:06',
  image: 'epic_1b_20261121004555',
  caption: 'Vista de la Tierra',
  centroid_coordinates: { lat: -16.7, lon: 156.9 },
};

describe('epic service', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('builds the archive image URL from the capture date', () => {
    expect(epicImageUrl(raw.image, raw.date)).toContain('/EPIC/archive/natural/2026/11/21/png/epic_1b_20261121004555.png');
  });

  it('normalizes raw entries', () => {
    const [image] = normalizeEpicImages([raw]);
    expect(image).toMatchObject({ id: raw.identifier, lat: -16.7, lon: 156.9 });
    expect(image?.imageUrl).toContain('epic_1b_20261121004555.png');
  });

  it('fetches and caches the latest images', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [raw] } as never);

    const first = await getEpicImages(2);
    const second = await getEpicImages(2);

    expect(first).toHaveLength(1);
    expect(second).toEqual(first);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(vi.mocked(axios.get).mock.calls[0]?.[0]).toBe('https://api.nasa.gov/EPIC/api/natural');
  });
});
