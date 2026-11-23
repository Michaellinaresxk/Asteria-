import type { AstronomyEvent } from '@/shared/types/astronomy';

import { ASTRONOMY_EVENTS } from '../data/dailyEvents';

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

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday start
  const start = new Date(year, month, 1 - startOffset);
  const days: CalendarDay[] = [];
  const today = new Date();

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      events: ASTRONOMY_EVENTS.filter((event) => event.date === mmdd),
    });
  }

  return days;
}

export function getEventsForMonth(_year: number, month: number, type?: AstronomyEvent['type'] | 'all'): AstronomyEvent[] {
  const mm = String(month + 1).padStart(2, '0');
  return ASTRONOMY_EVENTS
    .filter((event) => event.date.startsWith(`${mm}-`))
    .filter((event) => !type || type === 'all' || event.type === type)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => ({ ...event }));
}
