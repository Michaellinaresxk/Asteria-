import { describe, expect, it } from 'vitest';

import { getConjunctionEventsForYear, getAngularSeparation, getMeanLongitude } from './conjunctionEvents';
import { getEclipseEventsForYear } from './eclipseEvents';
import { getMoonEventsForYear } from './moonEvents';
import { getPlanetEventsForYear } from './planetEvents';
import { getEventsForYear } from './yearEvents';

describe('generated astronomy events', () => {
  it('computes the four main moon phases for a year', () => {
    const events = getMoonEventsForYear(2026);
    expect(events.length).toBeGreaterThan(40);
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
    expect(events.every((event) => event.type === 'moon' && event.fullDate?.startsWith('2026'))).toBe(true);
    expect(events.some((event) => event.title === 'Luna llena')).toBe(true);
  });

  it('computes approximate planetary oppositions', () => {
    const events = getPlanetEventsForYear(2026);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => event.type === 'planet' && event.title.includes('Oposición'))).toBe(true);
  });

  it('computes mean longitudes and angular separation', () => {
    expect(getMeanLongitude('jupiter', 0)).toBeCloseTo(34.40438, 4);
    expect(getMeanLongitude('unknown', 0)).toBeNaN();
    expect(getAngularSeparation(10, 10)).toBe(0);
    expect(getAngularSeparation(10, 190)).toBe(180);

    const conjunctions = getConjunctionEventsForYear(2026);
    expect(conjunctions.every((event) => event.type === 'conjunction')).toBe(true);
  });

  it('includes curated eclipses for 2026', () => {
    const eclipses = getEclipseEventsForYear(2026);
    expect(eclipses.some((event) => event.date === '08-12' && event.title.includes('total'))).toBe(true);
    expect(eclipses.some((event) => event.date === '03-03' && event.type === 'eclipse')).toBe(true);
    expect(getEclipseEventsForYear(2031)).toHaveLength(0);
  });

  it('makes every calendar filter type available in a year', () => {
    const types = new Set(getEventsForYear(2026).map((event) => event.type));
    ['meteor-shower', 'eclipse', 'conjunction', 'planet', 'moon', 'season'].forEach((type) => {
      expect(Array.from(types)).toContain(type);
    });
  });
});
