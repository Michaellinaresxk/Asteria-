import type { AstronomyEvent } from '@/shared/types/astronomy';

/** Low-precision synodic month arithmetic, accurate to within a few hours. */
const SYNODIC_MONTH_MS = 29.530588853 * 86_400_000;
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

const PHASES = [
  { key: 'new', offset: 0, title: 'Luna nueva', description: 'La Luna queda entre la Tierra y el Sol: el cielo es más oscuro.' },
  { key: 'first-quarter', offset: 0.25, title: 'Cuarto creciente', description: 'Vemos iluminada la mitad del disco lunar durante la tarde.' },
  { key: 'full', offset: 0.5, title: 'Luna llena', description: 'La Tierra está entre el Sol y la Luna: el disco aparece completamente iluminado.' },
  { key: 'last-quarter', offset: 0.75, title: 'Cuarto menguante', description: 'La mitad del disco lunar sigue iluminada antes del amanecer.' },
] as const;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function isoFromMs(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function getMoonEventsForYear(year: number): AstronomyEvent[] {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const events: AstronomyEvent[] = [];

  let cycle = Math.floor((start - REFERENCE_NEW_MOON_MS) / SYNODIC_MONTH_MS) - 1;
  while (REFERENCE_NEW_MOON_MS + cycle * SYNODIC_MONTH_MS < end) {
    for (const phase of PHASES) {
      const timestamp = REFERENCE_NEW_MOON_MS + (cycle + phase.offset) * SYNODIC_MONTH_MS;
      if (timestamp < start || timestamp >= end) continue;

      const fullDate = isoFromMs(timestamp);
      events.push({
        id: `moon-${phase.key}-${fullDate}`,
        date: fullDate.slice(5),
        fullDate,
        title: phase.title,
        description: phase.description,
        type: 'moon',
      });
    }
    cycle += 1;
  }

  return events.sort((a, b) => a.fullDate!.localeCompare(b.fullDate!));
}
