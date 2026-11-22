export interface CelestialBody {
  id: string;
  name: string;
  gravity: number; // m/s²
  type: 'planet' | 'moon' | 'star';
  description: string;
  dayLength: string;
  yearLength: string;
  funFact: string;
}
