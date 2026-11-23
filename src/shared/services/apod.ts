import axios from 'axios';

import { NASA_API_KEY } from './nasaApi';
import type { ApodResponse } from '@/shared/types/astronomy';

export async function getAstronomyPictureOfDay(): Promise<ApodResponse> {
  const { data } = await axios.get<ApodResponse>('https://api.nasa.gov/planetary/apod', {
    params: { api_key: NASA_API_KEY },
    timeout: 10000,
  });
  return data;
}
