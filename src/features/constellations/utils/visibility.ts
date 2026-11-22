import type { Constellation } from '../data/constellations';
import { CONSTELLATIONS } from '../data/constellations';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export function getSeason(date: Date, latitude: number): Season {
  const month = date.getMonth(); // 0-11
  const north = latitude >= 0;
  if (month === 11 || month === 0 || month === 1) return north ? 'winter' : 'summer';
  if (month >= 2 && month <= 4) return north ? 'spring' : 'autumn';
  if (month >= 5 && month <= 7) return north ? 'summer' : 'winter';
  return north ? 'autumn' : 'spring';
}

export function getVisibleConstellations(date: Date, latitude: number): Constellation[] {
  const season = getSeason(date, latitude);
  const hemisphere = latitude >= 0 ? 'north' : 'south';
  return CONSTELLATIONS.filter((c) =>
    c.seasons.includes(season) && (c.hemisphere === 'both' || c.hemisphere === hemisphere),
  );
}
