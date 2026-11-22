import axios from 'axios';

import type { ApodResponse } from '@/shared/types/astronomy';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export async function getAstronomyPictureOfDay(): Promise<ApodResponse> {
  const { data } = await axios.get<ApodResponse>('https://api.nasa.gov/planetary/apod', {
    params: { api_key: NASA_API_KEY },
    timeout: 10000,
  });
  return data;
}
