import axios from 'axios';

import type { VisiblePlanet, VisiblePlanetsResponse } from '@/shared/types/sky';

export async function getVisiblePlanets(latitude: number, longitude: number): Promise<VisiblePlanet[]> {
  const { data } = await axios.get<VisiblePlanetsResponse>('https://api.visibleplanets.dev/v3', {
    params: {
      latitude,
      longitude,
      elevation: 0,
      aboveHorizon: false,
      showPlanets: true,
    },
    timeout: 10000,
  });

  return data.data ?? [];
}
