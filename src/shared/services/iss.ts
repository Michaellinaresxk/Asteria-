import axios from 'axios';

import type { IssPass, IssPosition } from '@/shared/types/iss';

export async function getIssPosition(): Promise<IssPosition> {
  const { data } = await axios.get<IssPosition>('https://api.wheretheiss.at/v1/satellites/25544', {
    timeout: 10000,
  });
  return data;
}

export async function getIssPasses(latitude: number, longitude: number): Promise<IssPass[]> {
  const { data } = await axios.get<{ response: IssPass[] }>('http://api.open-notify.org/iss-pass.json', {
    params: { lat: latitude, lon: longitude, n: 3 },
    timeout: 10000,
  });
  return data.response ?? [];
}
