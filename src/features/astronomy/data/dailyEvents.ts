import type { AstronomyEvent } from '@/shared/types/astronomy';

import { getEventDate, getEventsForYear } from './yearEvents';

export { ASTRONOMY_EVENTS } from './annualEvents';

/** Events happening on the given date or during the following `windowDays`. */
export function getEventsForDate(date: Date = new Date(), windowDays = 7): AstronomyEvent[] {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const year = base.getFullYear();

  return [year - 1, year, year + 1]
    .flatMap(getEventsForYear)
    .filter((event) => {
      const difference = Math.round((getEventDate(event, year).getTime() - base.getTime()) / 86_400_000);
      return difference >= 0 && difference <= windowDays;
    })
    .sort((a, b) => (a.fullDate ?? '').localeCompare(b.fullDate ?? ''));
}
