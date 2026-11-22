export interface Constellation {
  id: string;
  name: string;
  latin: string;
  hemisphere: 'north' | 'south' | 'both';
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>;
  description: string;
  highlight: string;
  tip: string;
}

export const CONSTELLATIONS: Constellation[] = [
  { id: 'orion', name: 'Orión', latin: 'Orion', hemisphere: 'both', seasons: ['winter'], description: 'Una de las constelaciones más reconocibles, dominada por Betelgeuse y Rigel.', highlight: 'Nebulosa de Orión (M42)', tip: 'Busca las tres estrellas alineadas del cinturón.' },
  { id: 'ursa-major', name: 'Osa Mayor', latin: 'Ursa Major', hemisphere: 'north', seasons: ['spring', 'summer'], description: 'Contiene el famoso asterismo del Carro.', highlight: 'Asterismo del Carro', tip: 'Usa el borde del Carro para localizar la Estrella Polar.' },
  { id: 'scorpius', name: 'Escorpio', latin: 'Scorpius', hemisphere: 'both', seasons: ['summer'], description: 'Constelación brillante con forma de gancho y la estrella Antares.', highlight: 'Antares', tip: 'Mejor visible en noches de verano cerca del horizonte sur.' },
  { id: 'crux', name: 'Cruz del Sur', latin: 'Crux', hemisphere: 'south', seasons: ['autumn', 'winter'], description: 'Pequeña pero icónica constelación del hemisferio sur.', highlight: 'Acrux', tip: 'Úsala como referencia para encontrar el polo sur celeste.' },
  { id: 'lyra', name: 'Lira', latin: 'Lyra', hemisphere: 'north', seasons: ['summer'], description: 'Pequeña constelación que alberga a Vega, una de las estrellas más brillantes.', highlight: 'Vega', tip: 'Busca el triángulo de verano junto a Deneb y Altair.' },
  { id: 'cassiopeia', name: 'Casiopea', latin: 'Cassiopeia', hemisphere: 'north', seasons: ['autumn', 'winter'], description: 'Reconocible por su forma de W en el cielo norte.', highlight: 'Forma de W', tip: 'Es circumpolar en muchas latitudes norte; visible gran parte del año.' },
  { id: 'canis-major', name: 'Can Mayor', latin: 'Canis Major', hemisphere: 'both', seasons: ['winter'], description: 'Contiene a Sirio, la estrella más brillante del cielo nocturno.', highlight: 'Sirio', tip: 'Sigue la línea del cinturón de Orión hacia el sureste.' },
  { id: 'leo', name: 'Leo', latin: 'Leo', hemisphere: 'both', seasons: ['spring'], description: 'Constelación zodiacal con forma de león y la estrella Regulus.', highlight: 'Regulus', tip: 'Busca la hoz, un patrón con forma de signo de interrogación.' },
];
