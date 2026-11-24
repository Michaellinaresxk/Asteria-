import type { AstronomyEvent } from '@/shared/types/astronomy';

const DAY_MS = 86_400_000;
const J2000_MS = Date.UTC(2000, 0, 1, 12);
const SEPARATION_THRESHOLD_DEG = 2.5;

/** Mean longitude elements: [longitude at J2000, degrees per century]. */
const MEAN_LONGITUDES: Record<string, [number, number]> = {
  venus: [181.97973, 58517.81538729],
  mars: [355.45332, 19140.30268499],
  jupiter: [34.40438, 3034.74612775],
  saturn: [49.94432, 1222.49362201],
};

const PAIRS = [
  { ids: ['venus', 'mars'] as const, title: 'Conjunción Venus–Marte' },
  { ids: ['venus', 'jupiter'] as const, title: 'Conjunción Venus–Júpiter' },
  { ids: ['mars', 'jupiter'] as const, title: 'Conjunción Marte–Júpiter' },
  { ids: ['jupiter', 'saturn'] as const, title: 'Gran conjunción Júpiter–Saturno' },
];

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function getMeanLongitude(bodyId: string, daysFromJ2000: number): number {
  const elements = MEAN_LONGITUDES[bodyId];
  if (!elements) return Number.NaN;
  const centuries = daysFromJ2000 / 36_525;
  return normalizeDegrees(elements[0] + elements[1] * centuries);
}

export function getAngularSeparation(first: number, second: number): number {
  const difference = normalizeDegrees(Math.abs(first - second));
  return Math.min(difference, 360 - difference);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

interface ConjunctionDay {
  timestamp: number;
  title: string;
  separation: number;
}

export function getConjunctionEventsForYear(year: number): AstronomyEvent[] {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const events: AstronomyEvent[] = [];
  let run: ConjunctionDay[] = [];

  function flushRun(): void {
    if (!run.length) return;
    const closest = run.reduce((best, item) => (item.separation < best.separation ? item : best));
    const date = new Date(closest.timestamp);
    const fullDate = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
    events.push({
      id: `conjunction-${fullDate}-${closest.title}`.replace(/\s+/g, '-').toLowerCase(),
      date: fullDate.slice(5),
      fullDate,
      title: closest.title,
      description: 'Dos planetas comparten casi la misma dirección en el cielo. Efeméride aproximada.',
      type: 'conjunction',
    });
    run = [];
  }

  for (let timestamp = start; timestamp < end; timestamp += DAY_MS) {
    const daysFromJ2000 = (timestamp - J2000_MS) / DAY_MS;
    let closest: ConjunctionDay | null = null;

    for (const pair of PAIRS) {
      const separation = getAngularSeparation(
        getMeanLongitude(pair.ids[0], daysFromJ2000),
        getMeanLongitude(pair.ids[1], daysFromJ2000),
      );
      if (separation <= SEPARATION_THRESHOLD_DEG && (!closest || separation < closest.separation)) {
        closest = { timestamp, title: pair.title, separation };
      }
    }

    if (closest) run.push(closest);
    else flushRun();
  }
  flushRun();

  return events.sort((a, b) => a.fullDate!.localeCompare(b.fullDate!));
}
