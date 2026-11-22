import { describe, expect, it } from 'vitest';

import { getEventsForDate } from './dailyEvents';

describe('getEventsForDate', () => {
  it('includes exact date events', () => {
    const events = getEventsForDate(new Date('2026-08-12T12:00:00Z'), 0);
    expect(events.some((event) => event.id === 'perseids')).toBe(true);
  });

  it('returns upcoming events within window', () => {
    const events = getEventsForDate(new Date('2026-08-10T12:00:00Z'), 3);
    expect(events.some((event) => event.id === 'perseids')).toBe(true);
  });
});
