import axios from 'axios';

interface RawVideoItem {
  data: Array<{ nasa_id: string; title?: string; description?: string }>;
  links?: Array<{ href?: string }>;
}

interface SearchResponse {
  collection: { items: RawVideoItem[] };
}

interface AssetResponse {
  collection: { items: Array<{ href?: string }> };
}

export interface NasaVideo {
  id: string;
  title: string;
  description: string;
  thumbUrl: string;
}

function pickThumb(links: Array<{ href?: string }> = []): string {
  const hrefs = links.map((link) => link.href ?? '');
  return hrefs.find((href) => href.includes('~thumb.jpg'))
    ?? hrefs.find((href) => href.includes('~small.jpg'))
    ?? hrefs.find((href) => href.toLowerCase().endsWith('.jpg'))
    ?? '';
}

export function normalizeVideos(items: RawVideoItem[]): NasaVideo[] {
  return items
    .map((item) => {
      const data = item.data?.[0];
      if (!data?.nasa_id) return null;
      return {
        id: data.nasa_id,
        title: data.title ?? 'Video de la NASA',
        description: (data.description ?? '').replace(/\s+/g, ' ').trim(),
        thumbUrl: pickThumb(item.links),
      };
    })
    .filter((video): video is NasaVideo => video !== null);
}

/** Searches the NASA Image and Video Library for astronomy videos. */
export async function searchNasaVideos(query = 'astronomy planet animation', limit = 9): Promise<NasaVideo[]> {
  const { data } = await axios.get<SearchResponse>('https://images-api.nasa.gov/search', {
    params: { q: query, media_type: 'video', page_size: limit },
    timeout: 10000,
  });

  return normalizeVideos(data.collection?.items ?? []);
}

/** Picks a small streamable MP4 from the asset list of a NASA video. */
export function findVideoSource(items: Array<{ href?: string }> = []): string {
  const hrefs = items.map((item) => item.href ?? '');
  return hrefs.find((href) => href.endsWith('~mobile.mp4'))
    ?? hrefs.find((href) => href.endsWith('~small.mp4'))
    ?? hrefs.find((href) => href.toLowerCase().endsWith('.mp4'))
    ?? '';
}

export async function getNasaVideoUrl(id: string): Promise<string> {
  const { data } = await axios.get<AssetResponse>(`https://images-api.nasa.gov/asset/${encodeURIComponent(id)}`, {
    timeout: 10000,
  });

  return findVideoSource(data.collection?.items ?? []);
}
