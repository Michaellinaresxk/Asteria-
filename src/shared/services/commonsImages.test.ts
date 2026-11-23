import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeCommonsResponse, searchCommonsImages } from './commonsImages';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const response = {
  query: {
    pages: {
      '123': {
        pageid: 123,
        title: 'File:Orion nebula.jpg',
        imageinfo: [{
          thumburl: 'https://example.com/thumb.jpg',
          url: 'https://example.com/full.jpg',
          descriptionurl: 'https://commons.wikimedia.org/wiki/File:Orion_nebula.jpg',
          extmetadata: { LicenseShortName: { value: '<a href="#">CC BY-SA 4.0</a>' } },
        }],
      },
      '456': { pageid: 456, title: 'File:No info.jpg' },
    },
  },
};

describe('commonsImages service', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('normalizes pages and drops those without image info', () => {
    const images = normalizeCommonsResponse(response);

    expect(images).toHaveLength(1);
    expect(images[0]).toMatchObject({
      id: '123',
      title: 'Orion nebula.jpg',
      license: 'CC BY-SA 4.0',
    });
  });

  it('sends a Commons search request with CORS origin', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: response } as never);

    const images = await searchCommonsImages('nebula', 4);

    expect(images).toHaveLength(1);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: {
        action: 'query',
        generator: 'search',
        gsrsearch: 'filetype:bitmap nebula',
        gsrnamespace: 6,
        gsrlimit: 4,
        origin: '*',
      },
    });
  });
});
