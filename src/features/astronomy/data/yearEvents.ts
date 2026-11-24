import type { AstronomyEvent } from '@/shared/types/astronomy';

import { ASTRONOMY_EVENTS } from './annualEvents';
import { getConjunctionEventsForYear } from './conjunctionEvents';
import { getEclipseEventsForYear } from './eclipseEvents';
import { getMoonEventsForYear } from './moonEvents';
import { getPlanetEventsForYear } from './planetEvents';

/** All calendar events for a given year, including computed ephemerides. */
export function getEventsForYear(year: number): AstronomyEvent[] {
  const annualEvents = ASTRONOMY_EVENTS.map((event) => ({
    ...event,
    fullDate: `${year}-${event.date}`,
  }));

  return [
    ...annualEvents,
    ...getMoonEventsForYear(year),
    ...getPlanetEventsForYear(year),
    ...getConjunctionEventsForYear(year),
    ...getEclipseEventsForYear(year),
  ].sort((a, b) => a.fullDate!.localeCompare(b.fullDate!));
}

export function getEventDate(event: AstronomyEvent, fallbackYear: number): Date {
  const iso = event.fullDate ?? `${fallbackYear}-${event.date}`;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year!, month! - 1, day!);
}
