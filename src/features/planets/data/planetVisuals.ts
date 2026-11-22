export interface PlanetVisual {
  color: string;
  emissive: string;
  atmosphere: string;
  texture: string;
  ring?: boolean;
  ringTexture?: string;
}

const TEX = 'https://www.solarsystemscope.com/textures/download';

export const PLANET_VISUALS: Record<string, PlanetVisual> = {
  mercury: { color: '#8c8680', emissive: '#1a1816', atmosphere: '#b0aaa4', texture: `${TEX}/2k_mercury.jpg` },
  venus: { color: '#d4a657', emissive: '#3d2a10', atmosphere: '#f0c978', texture: `${TEX}/2k_venus_surface.jpg` },
  mars: { color: '#c1440e', emissive: '#2a0d00', atmosphere: '#ff7b54', texture: `${TEX}/2k_mars.jpg` },
  jupiter: { color: '#c88b3a', emissive: '#2a1a08', atmosphere: '#e8b87a', texture: `${TEX}/2k_jupiter.jpg` },
  saturn: { color: '#e4c36a', emissive: '#3a3010', atmosphere: '#f3dfa0', texture: `${TEX}/2k_saturn.jpg`, ring: true, ringTexture: `${TEX}/2k_saturn_ring_alpha.png` },
  uranus: { color: '#7ec8e3', emissive: '#0d2a35', atmosphere: '#b8e8f5', texture: `${TEX}/2k_uranus.jpg` },
  neptune: { color: '#3b5bdb', emissive: '#081030', atmosphere: '#748ffc', texture: `${TEX}/2k_neptune.jpg` },
  moon: { color: '#bfc5cc', emissive: '#1a1c1e', atmosphere: '#dde2e8', texture: `${TEX}/2k_moon.jpg` },
};
