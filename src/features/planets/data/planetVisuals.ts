export interface PlanetVisual {
  color: string;
  emissive: string;
  atmosphere: string;
  ring?: boolean;
}

export const PLANET_VISUALS: Record<string, PlanetVisual> = {
  mercury: { color: '#8c8680', emissive: '#2a2724', atmosphere: '#b0aaa4' },
  venus: { color: '#d4a657', emissive: '#5a3f1a', atmosphere: '#f0c978' },
  mars: { color: '#c1440e', emissive: '#4a1600', atmosphere: '#ff7b54' },
  jupiter: { color: '#c88b3a', emissive: '#4a3010', atmosphere: '#e8b87a' },
  saturn: { color: '#e4c36a', emissive: '#5a4a1a', atmosphere: '#f3dfa0', ring: true },
  uranus: { color: '#7ec8e3', emissive: '#1a4a5a', atmosphere: '#b8e8f5' },
  neptune: { color: '#3b5bdb', emissive: '#102060', atmosphere: '#748ffc' },
  moon: { color: '#bfc5cc', emissive: '#2a2d30', atmosphere: '#dde2e8' },
};
