import type { AstronomyEvent } from '@/shared/types/astronomy';

interface EclipseSeed {
  date: string;
  title: string;
  description: string;
}

/** Selected eclipses from the NASA eclipse catalog (2026–2030). */
const ECLIPSES: EclipseSeed[] = [
  { date: '2026-02-17', title: 'Eclipse anular de Sol', description: 'La Luna deja un anillo de luz visible sobre la Antártida.' },
  { date: '2026-03-03', title: 'Eclipse lunar total', description: 'La Luna entra por completo en la sombra de la Tierra.' },
  { date: '2026-08-12', title: 'Eclipse total de Sol', description: 'Oscuridad total en Groenlandia, Islandia y el norte de España.' },
  { date: '2026-08-28', title: 'Eclipse lunar parcial', description: 'Parte del disco lunar queda cubierto por la sombra terrestre.' },
  { date: '2027-02-06', title: 'Eclipse anular de Sol', description: 'Anillo de luz visible en el sur de Chile y Argentina.' },
  { date: '2027-08-02', title: 'Eclipse total de Sol', description: 'La sombra lunar cruza Egipto y Arabia Saudita.' },
  { date: '2028-01-26', title: 'Eclipse anular de Sol', description: 'Eclipse anular visible en el sur de América.' },
  { date: '2028-07-22', title: 'Eclipse total de Sol', description: 'Totalidad visible en Australia y Nueva Zelanda.' },
  { date: '2029-01-14', title: 'Eclipse parcial de Sol', description: 'La Luna cubre parcialmente el disco solar.' },
  { date: '2029-07-11', title: 'Eclipse parcial de Sol', description: 'La Luna cubre parcialmente el disco solar.' },
  { date: '2030-05-31', title: 'Eclipse anular de Sol', description: 'Anillo de luz sobre el norte de Europa y Asia.' },
  { date: '2030-11-25', title: 'Eclipse total de Sol', description: 'Eclipse total visible en África y Australia.' },
];

export function getEclipseEventsForYear(year: number): AstronomyEvent[] {
  return ECLIPSES
    .filter((eclipse) => eclipse.date.startsWith(String(year)))
    .map((eclipse) => ({
      id: `eclipse-${eclipse.date}`,
      date: eclipse.date.slice(5),
      fullDate: eclipse.date,
      title: eclipse.title,
      description: eclipse.description,
      type: 'eclipse' as const,
      detailUrl: 'https://science.nasa.gov/eclipses/',
    }));
}
