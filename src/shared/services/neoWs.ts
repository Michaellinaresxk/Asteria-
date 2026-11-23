import axios from 'axios';

import { NASA_API_KEY } from './nasaApi';
import type { NearEarthObject } from '@/shared/types/neo';
import { chunkDateRange, toIsoDate } from '@/shared/utils/dates';

interface RawCloseApproach {
  close_approach_date: string;
  relative_velocity: { kilometers_per_second: string };
  miss_distance: { lunar: string; kilometers: string };
}

interface RawNeo {
  id: string;
  name: string;
  nasa_jpl_url: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: RawCloseApproach[];
}

export interface NeoFeedResponse {
  near_earth_objects: Record<string, RawNeo[]>;
}

interface RawNeoDetail {
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  orbital_data?: {
    perihelion_distance?: string;
    aphelion_distance?: string;
    eccentricity?: string;
    inclination?: string;
    orbital_period?: string;
  };
}

export interface NearEarthObjectDetail {
  id: string;
  name: string;
  jplUrl: string;
  absoluteMagnitude: number;
  hazardous: boolean;
  perihelionAu: number;
  aphelionAu: number;
  eccentricity: number;
  inclinationDeg: number;
  orbitalPeriodDays: number;
}

export function normalizeNeoDetail(id: string, data: RawNeoDetail): NearEarthObjectDetail {
  const orbit = data.orbital_data ?? {};
  return {
    id,
    name: data.name.replace(/^\(([^)]*)\)?\s*/, '$1'),
    jplUrl: data.nasa_jpl_url,
    absoluteMagnitude: toNumber(data.absolute_magnitude_h),
    hazardous: Boolean(data.is_potentially_hazardous_asteroid),
    perihelionAu: toNumber(orbit.perihelion_distance),
    aphelionAu: toNumber(orbit.aphelion_distance),
    eccentricity: toNumber(orbit.eccentricity),
    inclinationDeg: toNumber(orbit.inclination),
    orbitalPeriodDays: toNumber(orbit.orbital_period),
  };
}

function toNumber(value: string | number | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeFeed(data: NeoFeedResponse): NearEarthObject[] {
  const objects: NearEarthObject[] = [];

  for (const [date, neos] of Object.entries(data.near_earth_objects ?? {})) {
    for (const neo of neos ?? []) {
      const approach = neo.close_approach_data?.find((item) => item.close_approach_date === date)
        ?? neo.close_approach_data?.[0];
      if (!approach) continue;

      objects.push({
        id: neo.id,
        name: neo.name,
        date,
        jplUrl: neo.nasa_jpl_url,
        hazardous: Boolean(neo.is_potentially_hazardous_asteroid),
        distanceLunar: toNumber(approach.miss_distance?.lunar),
        velocityKmS: toNumber(approach.relative_velocity?.kilometers_per_second),
        diameterMinM: toNumber(neo.estimated_diameter?.meters?.estimated_diameter_min),
        diameterMaxM: toNumber(neo.estimated_diameter?.meters?.estimated_diameter_max),
      });
    }
  }

  return objects;
}

/** Fetches near-Earth asteroid approaches for a date range via NASA NeoWs. */
export async function getNearEarthObjects(start: Date, end: Date): Promise<NearEarthObject[]> {
  const chunks = chunkDateRange(start, end);

  const results = await Promise.all(chunks.map(async (chunk) => {
    try {
      const { data } = await axios.get<NeoFeedResponse>('https://api.nasa.gov/neo/rest/v1/feed', {
        params: {
          start_date: toIsoDate(chunk.start),
          end_date: toIsoDate(chunk.end),
          api_key: NASA_API_KEY,
        },
        timeout: 10000,
      });
      return normalizeFeed(data);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 429) throw new Error('LÍMITE_NEGOWS');
      throw error;
    }
  }));

  return results
    .flat()
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
}

/** Detailed orbital data for a single near-Earth object. */
export async function getNearEarthObject(id: string): Promise<NearEarthObjectDetail> {
  const { data } = await axios.get<RawNeoDetail>(`https://api.nasa.gov/neo/rest/v1/neo/${encodeURIComponent(id)}`, {
    params: { api_key: NASA_API_KEY },
    timeout: 10000,
  });

  return normalizeNeoDetail(id, data);
}
