import axios from 'axios';

import { NASA_API_KEY } from './nasaApi';
import { toIsoDate } from '@/shared/utils/dates';

interface RawEpicImage {
  identifier: string;
  date: string;
  image: string;
  caption?: string;
  centroid_coordinates?: { lat: number; lon: number };
}

export interface EpicImage {
  id: string;
  date: string;
  imageUrl: string;
  caption: string;
  lat: number;
  lon: number;
}

export function epicImageUrl(image: string, date: string): string {
  const [year, month, day] = date.slice(0, 10).split('-');
  return `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${image}.png?api_key=${NASA_API_KEY}`;
}

export function normalizeEpicImages(images: RawEpicImage[]): EpicImage[] {
  return images
    .map((image) => ({
      id: image.identifier,
      date: image.date,
      imageUrl: epicImageUrl(image.image, image.date),
      caption: image.caption ?? 'Vista de la Tierra desde el espacio.',
      lat: image.centroid_coordinates?.lat ?? 0,
      lon: image.centroid_coordinates?.lon ?? 0,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

let cachedDay = '';
let cachedImages: EpicImage[] = [];

/** Latest natural-colour images of Earth from the DSCOVR/EPIC camera. */
export async function getEpicImages(limit = 8): Promise<EpicImage[]> {
  const today = toIsoDate(new Date());
  if (cachedDay === today && cachedImages.length) return cachedImages.slice(0, limit);

  const { data } = await axios.get<RawEpicImage[]>('https://api.nasa.gov/EPIC/api/natural', {
    params: { api_key: NASA_API_KEY },
    timeout: 10000,
  });

  cachedImages = normalizeEpicImages(Array.isArray(data) ? data : []);
  cachedDay = cachedImages.length ? today : '';
  return cachedImages.slice(0, limit);
}
