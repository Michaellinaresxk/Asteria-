import type { Vec3 } from './journeyStops';

export interface JourneyBody {
  id: string;
  name: string;
  position: Vec3;
  radius: number;
  color: string;
  emissive: string;
  ring?: boolean;
}

/** Celestial bodies used as scenery along the dashboard's virtual flight. */
export const JOURNEY_BODIES: JourneyBody[] = [
  { id: 'sun', name: 'Sol', position: [0, 0, 0], radius: 2.6, color: '#ffd27a', emissive: '#ff9d3d' },
  { id: 'mercury', name: 'Mercurio', position: [-4, 0.8, -7], radius: 0.42, color: '#a9a29b', emissive: '#3a3531' },
  { id: 'venus', name: 'Venus', position: [5, -1.1, -12], radius: 0.72, color: '#e8c98a', emissive: '#6b4a1f' },
  { id: 'earth', name: 'Tierra', position: [-5, 1.4, -22], radius: 0.78, color: '#3b82f6', emissive: '#123a73' },
  { id: 'mars', name: 'Marte', position: [6.5, -1.8, -31], radius: 0.56, color: '#c9583a', emissive: '#5e2417' },
  { id: 'jupiter', name: 'Júpiter', position: [-8, 1.8, -46], radius: 1.7, color: '#d8a976', emissive: '#6b4123' },
  { id: 'saturn', name: 'Saturno', position: [9, -1.2, -60], radius: 1.35, color: '#e3cda0', emissive: '#6b5a34', ring: true },
  { id: 'neptune', name: 'Neptuno', position: [-3, 2.6, -78], radius: 1.05, color: '#4f6fd8', emissive: '#1c2f73' },
];
