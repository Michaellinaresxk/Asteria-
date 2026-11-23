import { describe, expect, it } from 'vitest';

import { addDays, chunkDateRange, getWeekWindow, toIsoDate } from './dates';

describe('date helpers', () => {
  it('formats local dates as ISO strings', () => {
    expect(toIsoDate(new Date(2026, 10, 3))).toBe('2026-11-03');
  });

  it('adds days across month boundaries', () => {
    expect(toIsoDate(addDays(new Date(2026, 10, 30), 5))).toBe('2026-12-05');
  });

  it('splits a month into contiguous chunks of at most 7 days', () => {
    const chunks = chunkDateRange(new Date(2026, 10, 1), new Date(2026, 10, 30));

    expect(chunks).toHaveLength(5);
    expect(chunks[0]?.key).toBe('2026-11-01_2026-11-07');
    expect(chunks[4]?.end.getDate()).toBe(30);

    chunks.forEach((chunk, index) => {
      expect(chunk.end.getTime() - chunk.start.getTime()).toBeLessThanOrEqual(6 * 86400000);
      if (index > 0) {
        const previous = chunks[index - 1]!;
        expect(addDays(previous.end, 1).getTime()).toBe(chunk.start.getTime());
      }
    });
  });

  it('returns the Monday-to-Sunday window for a date', () => {
    const { start, end } = getWeekWindow(new Date(2026, 10, 23)); // Monday 23 Nov

    expect(toIsoDate(start)).toBe('2026-11-23');
    expect(toIsoDate(end)).toBe('2026-11-29');
  });

  it('returns no chunks for an inverted range', () => {
    expect(chunkDateRange(new Date(2026, 10, 10), new Date(2026, 10, 1))).toEqual([]);
  });
});
