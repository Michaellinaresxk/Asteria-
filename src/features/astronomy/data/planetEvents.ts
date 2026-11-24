import type { AstronomyEvent } from '@/shared/types/astronomy';

interface OppositionSeed {
  id: string;
  title: string;
  reference: string;
  periodDays: number;
  description: string;
}

/** Mean synodic periods + a known opposition date (dates are approximate). */
const OPPOSITIONS: OppositionSeed[] = [
  { id: 'mars-opposition', title: 'Oposición de Marte', reference: '2025-01-16', periodDays: 779.9, description: 'Marte pasa frente al Sol visto desde la Tierra: es el mejor momento para observarlo.' },
  { id: 'jupiter-opposition', title: 'Oposición de Júpiter', reference: '2025-01-10', periodDays: 398.9, description: 'Júpiter alcanza su mayor tamaño aparente y es visible toda la noche.' },
  { id: 'saturn-opposition', title: 'Oposición de Saturno', reference: '2025-09-21', periodDays: 378.1, description: 'Saturno está más cerca de la Tierra y sus anillos se ven con más detalle.' },
  { id: 'uranus-opposition', title: 'Oposición de Urano', reference: '2025-11-09', periodDays: 369.7, description: 'Urano llega a su punto más cercano a la Tierra en su ciclo anual.' },
  { id: 'neptune-opposition', title: 'Oposición de Neptuno', reference: '2025-09-23', periodDays: 367.5, description: 'Neptuno alcanza su mejor momento de visibilidad del año.' },
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function isoFromMs(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function getPlanetEventsForYear(year: number): AstronomyEvent[] {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const dayMs = 86_400_000;
  const events: AstronomyEvent[] = [];

  for (const seed of OPPOSITIONS) {
    const reference = Date.parse(`${seed.reference}T00:00:00Z`);
    const periodMs = seed.periodDays * dayMs;
    let cycle = Math.floor((start - reference) / periodMs) - 1;

    while (reference + cycle * periodMs < end) {
      const timestamp = reference + cycle * periodMs;
      if (timestamp >= start && timestamp < end) {
        const fullDate = isoFromMs(timestamp);
        events.push({
          id: `${seed.id}-${fullDate}`,
          date: fullDate.slice(5),
          fullDate,
          title: seed.title,
          description: `${seed.description} (fecha aproximada).`,
          type: 'planet',
        });
      }
      cycle += 1;
    }
  }

  return events.sort((a, b) => a.fullDate!.localeCompare(b.fullDate!));
}
