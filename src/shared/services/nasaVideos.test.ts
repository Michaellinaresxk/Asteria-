import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { findVideoSource, getNasaVideoUrl, normalizeVideos, searchNasaVideos } from './nasaVideos';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const rawItem = {
  data: [{ nasa_id: 'VID-1', title: 'Animación de Marte', description: 'Una animación\n  de prueba' }],
  links: [
    { href: 'https://example.com/v~large.jpg' },
    { href: 'https://example.com/v~thumb.jpg' },
  ],
};

describe('nasaVideos service', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('normalizes search results and picks a thumbnail', () => {
    const [video] = normalizeVideos([rawItem]);
    expect(video).toMatchObject({ id: 'VID-1', title: 'Animación de Marte', description: 'Una animación de prueba' });
    expect(video?.thumbUrl).toBe('https://example.com/v~thumb.jpg');
  });

  it('searches the video library', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { collection: { items: [rawItem] } } } as never);

    const videos = await searchNasaVideos('planets', 4);

    expect(videos).toHaveLength(1);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: { q: 'planets', media_type: 'video', page_size: 4 },
    });
  });

  it('prefers a small streamable mp4 from the asset list', () => {
    expect(findVideoSource([
      { href: 'x~large.mp4' },
      { href: 'x~mobile.mp4' },
      { href: 'x~thumb.jpg' },
    ])).toBe('x~mobile.mp4');
  });

  it('resolves the playable URL of a video', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { collection: { items: [{ href: 'x~small.mp4' }] } } } as never);

    expect(await getNasaVideoUrl('VID 1')).toBe('x~small.mp4');
    expect(vi.mocked(axios.get).mock.calls[0]?.[0]).toBe('https://images-api.nasa.gov/asset/VID%201');
  });
});
