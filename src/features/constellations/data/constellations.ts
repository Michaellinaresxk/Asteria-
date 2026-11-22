export interface ConstellationStar {
  x: number;
  y: number;
  size?: number;
  label?: string;
}

export interface Constellation {
  id: string;
  name: string;
  latin: string;
  hemisphere: 'north' | 'south' | 'both';
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>;
  description: string;
  highlight: string;
  tip: string;
  stars: ConstellationStar[];
  lines: Array<[number, number]>;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'orion', name: 'Orión', latin: 'Orion', hemisphere: 'both', seasons: ['winter'],
    description: 'Una de las constelaciones más reconocibles, dominada por Betelgeuse y Rigel.',
    highlight: 'Nebulosa de Orión (M42)', tip: 'Busca las tres estrellas alineadas del cinturón.',
    stars: [
      { x: 35, y: 15, size: 3.5, label: 'Betelgeuse' }, { x: 65, y: 18, size: 3 }, { x: 42, y: 45, size: 2.5 },
      { x: 50, y: 47, size: 2.5 }, { x: 58, y: 49, size: 2.5 }, { x: 38, y: 80, size: 3.2, label: 'Rigel' },
      { x: 62, y: 78, size: 2.8 }, { x: 50, y: 60, size: 2 },
    ],
    lines: [[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[3,7],[5,7],[6,7],[0,1]],
  },
  {
    id: 'ursa-major', name: 'Osa Mayor', latin: 'Ursa Major', hemisphere: 'north', seasons: ['spring', 'summer'],
    description: 'Contiene el famoso asterismo del Carro.',
    highlight: 'Asterismo del Carro', tip: 'Usa el borde del Carro para localizar la Estrella Polar.',
    stars: [
      { x: 15, y: 35, size: 2.8 }, { x: 28, y: 30, size: 2.8 }, { x: 42, y: 35, size: 2.8 },
      { x: 52, y: 45, size: 2.8 }, { x: 68, y: 58, size: 2.8 }, { x: 82, y: 50, size: 2.8 },
      { x: 75, y: 35, size: 2.8 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    id: 'scorpius', name: 'Escorpio', latin: 'Scorpius', hemisphere: 'both', seasons: ['summer'],
    description: 'Constelación brillante con forma de gancho y la estrella Antares.',
    highlight: 'Antares', tip: 'Mejor visible en noches de verano cerca del horizonte sur.',
    stars: [
      { x: 30, y: 20, size: 2.5 }, { x: 35, y: 30, size: 2.5 }, { x: 40, y: 40, size: 3.5, label: 'Antares' },
      { x: 45, y: 50, size: 2.5 }, { x: 50, y: 60, size: 2.3 }, { x: 58, y: 68, size: 2.3 },
      { x: 68, y: 72, size: 2.3 }, { x: 75, y: 65, size: 2.3 }, { x: 78, y: 55, size: 2.3 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]],
  },
  {
    id: 'crux', name: 'Cruz del Sur', latin: 'Crux', hemisphere: 'south', seasons: ['autumn', 'winter'],
    description: 'Pequeña pero icónica constelación del hemisferio sur.',
    highlight: 'Acrux', tip: 'Úsala como referencia para encontrar el polo sur celeste.',
    stars: [
      { x: 50, y: 15, size: 3.2 }, { x: 50, y: 85, size: 3.2, label: 'Acrux' },
      { x: 25, y: 50, size: 2.8 }, { x: 75, y: 50, size: 2.8 }, { x: 60, y: 60, size: 2.2 },
    ],
    lines: [[0,1],[2,3]],
  },
  {
    id: 'lyra', name: 'Lira', latin: 'Lyra', hemisphere: 'north', seasons: ['summer'],
    description: 'Pequeña constelación que alberga a Vega, una de las estrellas más brillantes.',
    highlight: 'Vega', tip: 'Busca el triángulo de verano junto a Deneb y Altair.',
    stars: [
      { x: 50, y: 20, size: 3.8, label: 'Vega' }, { x: 35, y: 45, size: 2.4 }, { x: 65, y: 45, size: 2.4 },
      { x: 40, y: 70, size: 2.2 }, { x: 60, y: 70, size: 2.2 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,4],[1,2]],
  },
  {
    id: 'cassiopeia', name: 'Casiopea', latin: 'Cassiopeia', hemisphere: 'north', seasons: ['autumn', 'winter'],
    description: 'Reconocible por su forma de W en el cielo norte.',
    highlight: 'Forma de W', tip: 'Es circumpolar en muchas latitudes norte; visible gran parte del año.',
    stars: [
      { x: 10, y: 30, size: 2.8 }, { x: 30, y: 65, size: 2.8 }, { x: 50, y: 35, size: 2.8 },
      { x: 70, y: 65, size: 2.8 }, { x: 90, y: 30, size: 2.8 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    id: 'canis-major', name: 'Can Mayor', latin: 'Canis Major', hemisphere: 'both', seasons: ['winter'],
    description: 'Contiene a Sirio, la estrella más brillante del cielo nocturno.',
    highlight: 'Sirio', tip: 'Sigue la línea del cinturón de Orión hacia el sureste.',
    stars: [
      { x: 50, y: 25, size: 4, label: 'Sirio' }, { x: 40, y: 45, size: 2.4 }, { x: 60, y: 45, size: 2.4 },
      { x: 35, y: 65, size: 2.2 }, { x: 55, y: 75, size: 2.2 }, { x: 70, y: 60, size: 2.2 },
    ],
    lines: [[0,1],[0,2],[1,3],[3,4],[4,5],[5,2]],
  },
  {
    id: 'leo', name: 'Leo', latin: 'Leo', hemisphere: 'both', seasons: ['spring'],
    description: 'Constelación zodiacal con forma de león y la estrella Regulus.',
    highlight: 'Regulus', tip: 'Busca la hoz, un patrón con forma de signo de interrogación.',
    stars: [
      { x: 70, y: 20, size: 2.6 }, { x: 55, y: 25, size: 2.4 }, { x: 45, y: 35, size: 2.4 },
      { x: 45, y: 55, size: 2.4 }, { x: 55, y: 70, size: 3, label: 'Regulus' }, { x: 75, y: 65, size: 2.5 },
      { x: 85, y: 45, size: 2.5 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[2,6]],
  },
];
