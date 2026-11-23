import type { AstronomyEvent } from '@/shared/types/astronomy';
import type { NearEarthObject } from '@/shared/types/neo';

/** Turns NeoWs close approaches into calendar events. */
export function neoToEvents(objects: NearEarthObject[]): AstronomyEvent[] {
  return objects.map((neo) => {
    const name = neo.name.replace(/^\(([^)]*)\)?\s*/, '$1');
    const diameter = Math.round((neo.diameterMinM + neo.diameterMaxM) / 2);
    const distanceKm = Math.round(neo.distanceLunar * 384400);

    return {
      id: `neo-${neo.id}-${neo.date}`,
      fullDate: neo.date,
      date: neo.date.slice(5),
      title: `Acercamiento de ${name}`,
      description: `Pasa a ${neo.distanceLunar.toFixed(1)} distancias lunares (≈ ${distanceKm.toLocaleString('es-ES')} km) a ${neo.velocityKmS.toFixed(1)} km/s. Diámetro estimado: ${diameter} m.${neo.hazardous ? ' Potencialmente peligroso.' : ''}`,
      type: 'asteroid',
      detailUrl: neo.jplUrl,
    };
  });
}
