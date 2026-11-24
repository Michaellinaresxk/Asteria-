import type { AstronomyEvent } from '@/shared/types/astronomy';

import { getEventDate, getEventsForYear } from '../data/yearEvents';

export const EVENT_TYPE_LABELS: Record<AstronomyEvent['type'], string> = {
  'meteor-shower': 'Meteoros',
  eclipse: 'Eclipse',
  conjunction: 'Conjunción',
  planet: 'Planeta',
  moon: 'Luna',
  season: 'Estación',
  asteroid: 'Asteroides',
};

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: AstronomyEvent[];
}

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const eventsByDate = new Map<string, AstronomyEvent[]>();
  [year - 1, year, year + 1].flatMap(getEventsForYear).forEach((event) => {
    const key = dateKey(getEventDate(event, year));
    const existing = eventsByDate.get(key);
    if (existing) existing.push(event);
    else eventsByDate.set(key, [event]);
  });

  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday start
  const start = new Date(year, month, 1 - startOffset);
  const days: CalendarDay[] = [];
  const today = new Date();

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      events: eventsByDate.get(dateKey(date)) ?? [],
    });
  }

  return days;
}

export function getEventsForMonth(year: number, month: number, type: AstronomyEvent['type'] | 'all' = 'all'): AstronomyEvent[] {
  return getEventsForYear(year)
    .filter((event) => getEventDate(event, year).getMonth() === month)
    .filter((event) => type === 'all' || event.type === type);
}
