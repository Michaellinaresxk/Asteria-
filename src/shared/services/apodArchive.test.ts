import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getApodArchive } from './apodArchive';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('getApodArchive', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('requests a date range and returns only images, newest first', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [
        { date: '2026-11-20', media_type: 'image', title: 'Older', url: 'a', explanation: '' },
        { date: '2026-11-22', media_type: 'video', title: 'Video', url: 'b', explanation: '' },
        { date: '2026-11-23', media_type: 'image', title: 'Newer', url: 'c', explanation: '' },
      ],
    } as never);

    const result = await getApodArchive('2026-11-20', '2026-11-23');

    expect(result.map((item) => item.title)).toEqual(['Newer', 'Older']);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: { start_date: '2026-11-20', end_date: '2026-11-23' },
    });
  });

  it('returns an empty list for an unexpected response', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { error: 'nope' } } as never);
    expect(await getApodArchive('2026-11-20', '2026-11-23')).toEqual([]);
  });
});
