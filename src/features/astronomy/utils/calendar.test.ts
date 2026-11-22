import { describe, expect, it } from 'vitest';

import { getEventsForMonth, getMonthDays } from './calendar';

describe('calendar utils', () => {
  it('returns 42 days for month grid', () => {
    const days = getMonthDays(2026, 7); // August
    expect(days).toHaveLength(42);
  });

  it('marks events on matching days', () => {
    const days = getMonthDays(2026, 7);
    const perseidsDay = days.find((d) => d.date.getMonth() === 7 && d.date.getDate() === 12);
    expect(perseidsDay?.events.some((e) => e.id === 'perseids')).toBe(true);
  });

  it('filters month events by type', () => {
    const meteors = getEventsForMonth(2026, 7, 'meteor-shower');
    expect(meteors.length).toBeGreaterThan(0);
    expect(meteors.every((e) => e.type === 'meteor-shower')).toBe(true);
  });
});
