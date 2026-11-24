import { PLANET_VISUALS } from './planetVisuals';

export interface SolarSystemBody {
  id: string;
  name: string;
  /** Scene units. Distances and sizes are compressed so every orbit is visible. */
  orbitRadius: number;
  /** Radians per second. Visual speed is accelerated, not physically accurate. */
  orbitSpeed: number;
  size: number;
  /** Orbital tilt in radians. */
  inclination: number;
  initialAngle: number;
  parent?: string;
}

const body = (
  id: string,
  name: string,
  orbitRadius: number,
  orbitSpeed: number,
  size: number,
  inclination: number,
  initialAngle: number,
  parent?: string,
): SolarSystemBody => ({ id, name, orbitRadius, orbitSpeed, size, inclination, initialAngle, parent });

export const SOLAR_SYSTEM_BODIES: SolarSystemBody[] = [
  body('mercury', 'Mercurio', 2.2, 0.3, 0.16, 0.06, 0.4),
  body('venus', 'Venus', 3.1, 0.22, 0.26, 0.05, 2.1),
  body('earth', 'Tierra', 4.2, 0.18, 0.28, 0.03, 4.4),
  body('moon', 'Luna', 0.55, 0.75, 0.09, 0.09, 1.2, 'earth'),
  body('mars', 'Marte', 5.5, 0.14, 0.22, 0.04, 5.6),
  body('jupiter', 'Júpiter', 8, 0.08, 0.72, 0.02, 0.9),
  body('saturn', 'Saturno', 10.4, 0.06, 0.6, 0.05, 3.3),
  body('uranus', 'Urano', 12.8, 0.04, 0.42, 0.03, 1.7),
  body('neptune', 'Neptuno', 15, 0.03, 0.4, 0.04, 5.1),
];

export const SUN_VISUAL = {
  id: 'sun',
  name: 'Sol',
  size: 1.35,
  ...PLANET_VISUALS.sun,
};

export function getSolarSystemBody(id: string): SolarSystemBody | undefined {
  return SOLAR_SYSTEM_BODIES.find((item) => item.id === id);
}

/** Fallback color used by the scene when a texture fails to load. */
export function getBodyColor(id: string): string {
  return PLANET_VISUALS[id]?.color ?? '#7dd3fc';
}

