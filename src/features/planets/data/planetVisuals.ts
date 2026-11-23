export interface PlanetVisual {
  color: string;
  emissive: string;
  atmosphere: string;
  texture: string;
  ring?: boolean;
  ringTexture?: string;
}

const TEX = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images';

export const PLANET_VISUALS: Record<string, PlanetVisual> = {
  sun: { color: '#fbbf24', emissive: '#ff9d00', atmosphere: '#ffe8a3', texture: `${TEX}/sunmap.jpg` },
  mercury: { color: '#8c8680', emissive: '#1a1816', atmosphere: '#b0aaa4', texture: `${TEX}/mercurymap.jpg` },
  venus: { color: '#d4a657', emissive: '#3d2a10', atmosphere: '#f0c978', texture: `${TEX}/venusmap.jpg` },
  mars: { color: '#c1440e', emissive: '#2a0d00', atmosphere: '#ff7b54', texture: `${TEX}/marsmap1k.jpg` },
  jupiter: { color: '#c88b3a', emissive: '#2a1a08', atmosphere: '#e8b87a', texture: `${TEX}/jupitermap.jpg` },
  saturn: { color: '#e4c36a', emissive: '#3a3010', atmosphere: '#f3dfa0', texture: `${TEX}/saturnmap.jpg`, ring: true, ringTexture: `${TEX}/saturnringcolor.jpg` },
  uranus: { color: '#7ec8e3', emissive: '#0d2a35', atmosphere: '#b8e8f5', texture: `${TEX}/uranusmap.jpg` },
  neptune: { color: '#3b5bdb', emissive: '#081030', atmosphere: '#748ffc', texture: `${TEX}/neptunemap.jpg` },
  moon: { color: '#bfc5cc', emissive: '#1a1c1e', atmosphere: '#dde2e8', texture: `${TEX}/moonmap1k.jpg` },
};
