/** Pure date helpers shared by the astronomy data services. */

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Monday-to-Sunday window containing the given date (7 days, one NeoWs request). */
export function getWeekWindow(date: Date): { start: Date; end: Date } {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (day.getDay() + 6) % 7;
  return {
    start: addDays(day, -offset),
    end: addDays(day, 6 - offset),
  };
}

export interface DateChunk {
  start: Date;
  end: Date;
  key: string;
}

/**
 * NASA NeoWs only accepts ranges up to 7 days. Split longer ranges into
 * inclusive 6-day chunks (7 calendar days) and give each chunk a stable key
 * so results can be cached.
 */
export function chunkDateRange(start: Date, end: Date, maxDays = 6): DateChunk[] {
  const chunks: DateChunk[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= last) {
    const candidate = addDays(cursor, maxDays);
    const chunkEnd = candidate > last ? last : candidate;
    chunks.push({
      start: new Date(cursor),
      end: new Date(chunkEnd),
      key: `${toIsoDate(cursor)}_${toIsoDate(chunkEnd)}`,
    });
    cursor.setDate(cursor.getDate() + maxDays + 1);
  }

  return chunks;
}
