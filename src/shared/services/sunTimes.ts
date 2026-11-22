import axios from 'axios';

import type { SunTimes } from '@/shared/types/location';

interface SunriseSunsetResponse {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    day_length: number;
  };
  status: string;
}

export async function getSunTimes(latitude: number, longitude: number, date = new Date()): Promise<SunTimes> {
  const dateStr = date.toISOString().split('T')[0];
  const { data } = await axios.get<SunriseSunsetResponse>('https://api.sunrise-sunset.org/json', {
    params: { lat: latitude, lng: longitude, formatted: 0, date: dateStr },
    timeout: 10000,
  });

  if (data.status !== 'OK') {
    throw new Error('No se pudieron obtener los horarios solares.');
  }

  return {
    sunrise: data.results.sunrise,
    sunset: data.results.sunset,
    solarNoon: data.results.solar_noon,
    civilTwilightBegin: data.results.civil_twilight_begin,
    civilTwilightEnd: data.results.civil_twilight_end,
    dayLengthSeconds: data.results.day_length,
  };
}
