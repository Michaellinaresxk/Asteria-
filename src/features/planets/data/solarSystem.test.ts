import { describe, expect, it } from 'vitest';

import { getBodyById } from './bodies';
import { getBodyColor, getSolarSystemBody, SOLAR_SYSTEM_BODIES, SUN_VISUAL } from './solarSystem';

describe('solar system data', () => {
  it('has unique ids and valid orbit values', () => {
    const ids = SOLAR_SYSTEM_BODIES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    SOLAR_SYSTEM_BODIES.forEach((item) => {
      expect(item.orbitRadius).toBeGreaterThan(0);
      expect(item.orbitSpeed).toBeGreaterThan(0);
      expect(item.size).toBeGreaterThan(0);
      expect(getBodyById(item.id)).toBeDefined();
    });
  });

  it('resolves satellites to an existing parent', () => {
    const moon = getSolarSystemBody('moon');
    expect(moon?.parent).toBe('earth');
    expect(SOLAR_SYSTEM_BODIES.some((item) => item.id === moon?.parent)).toBe(true);
  });

  it('exposes the Sun and a color fallback', () => {
    expect(SUN_VISUAL.name).toBe('Sol');
    expect(getSolarSystemBody('unknown')).toBeUndefined();
    expect(getBodyColor('mars')).toMatch(/^#/);
    expect(getBodyColor('unknown')).toBe('#7dd3fc');
  });
});
