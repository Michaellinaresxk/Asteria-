import axios from 'axios';

interface RawImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
  extmetadata?: {
    LicenseShortName?: { value?: string };
  };
}

interface RawPage {
  pageid: number;
  title: string;
  imageinfo?: RawImageInfo[];
}

interface CommonsResponse {
  query?: { pages?: Record<string, RawPage> };
}

export interface CommonsImage {
  id: string;
  title: string;
  thumbUrl: string;
  imageUrl: string;
  pageUrl: string;
  license: string;
}

function stripHtml(value: string | undefined): string {
  return (value ?? '').replace(/<[^>]*>/g, '').trim();
}

export function normalizeCommonsResponse(data: CommonsResponse): CommonsImage[] {
  const pages = Object.values(data.query?.pages ?? {});

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info?.thumburl || !info.url) return null;

      return {
        id: String(page.pageid),
        title: stripHtml(page.title).replace(/^File:/i, ''),
        thumbUrl: info.thumburl,
        imageUrl: info.url,
        pageUrl: info.descriptionurl ?? '',
        license: stripHtml(info.extmetadata?.LicenseShortName?.value),
      } satisfies CommonsImage;
    })
    .filter((image): image is CommonsImage => image !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Searches freely licensed astronomy photos on Wikimedia Commons. */
export async function searchCommonsImages(query: string, limit = 9): Promise<CommonsImage[]> {
  const { data } = await axios.get<CommonsResponse>('https://commons.wikimedia.org/w/api.php', {
    params: {
      action: 'query',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: 6,
      gsrlimit: limit,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: 600,
      format: 'json',
      origin: '*',
    },
    timeout: 10000,
  });

  return normalizeCommonsResponse(data);
}
