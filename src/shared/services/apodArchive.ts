import axios from 'axios';

import { NASA_API_KEY } from './nasaApi';
import type { ApodResponse } from '@/shared/types/astronomy';

/** Fetches a range of NASA Astronomy Picture of the Day entries (images only). */
export async function getApodArchive(startDate: string, endDate: string): Promise<ApodResponse[]> {
  const { data } = await axios.get<ApodResponse[]>('https://api.nasa.gov/planetary/apod', {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: NASA_API_KEY,
      thumbs: true,
    },
    timeout: 10000,
  });

  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item.media_type === 'image')
    .sort((a, b) => b.date.localeCompare(a.date));
}
