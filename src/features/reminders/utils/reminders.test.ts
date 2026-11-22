import { describe, expect, it } from 'vitest';

import { getDueReminders, getNextEventTimestamp } from './reminders';

describe('reminders utils', () => {
  it('returns due reminders', () => {
    const due = getDueReminders([
      { id: '1', eventId: 'e1', title: 'A', eventDate: '08-12', notifyAt: 100, notified: false },
      { id: '2', eventId: 'e2', title: 'B', eventDate: '08-13', notifyAt: 200, notified: false },
    ], 150);
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe('1');
  });

  it('computes next event timestamp in future', () => {
    const now = new Date('2026-08-10T12:00:00Z');
    const ts = getNextEventTimestamp('08-12', now);
    expect(ts).toBeGreaterThan(now.getTime());
  });
});
