export type Vec3 = [number, number, number];

export interface JourneyStop {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  position: Vec3;
  target: Vec3;
}

/**
 * Camera stops for the dashboard's virtual flight. The camera travels towards
 * negative Z, passing the Sun and the planets placed in `journeyBodies.ts`.
 */
export const JOURNEY_STOPS: JourneyStop[] = [
  {
    id: 'sun',
    eyebrow: 'Etapa 01 · El Sol',
    title: 'Comienza el viaje',
    description: 'Nuestro motor es una estrella enana amarilla. Representa el 99.8% de la masa del sistema solar.',
    position: [0, 1, 16],
    target: [0, 0, 0],
  },
  {
    id: 'inner',
    eyebrow: 'Etapa 02 · Planetas rocosos',
    title: 'Mundos de roca',
    description: 'Mercurio, Venus, la Tierra y Marte giran cerca del Sol. Son pequeños, densos y de superficie sólida.',
    position: [2, 0.5, 2],
    target: [0, 0, -14],
  },
  {
    id: 'earth',
    eyebrow: 'Etapa 03 · Nuestro hogar',
    title: 'El punto azul',
    description: 'La Tierra es el único mundo conocido con agua líquida en superficie y vida.',
    position: [-2, 1.5, -18],
    target: [0, 0, -32],
  },
  {
    id: 'giants',
    eyebrow: 'Etapa 04 · Gigantes',
    title: 'Los gigantes del sistema',
    description: 'Júpiter y Saturno son gigantes gaseosos. Saturno muestra sus anillos de hielo y roca.',
    position: [3, -1, -40],
    target: [2, 0, -54],
  },
  {
    id: 'outer',
    eyebrow: 'Etapa 05 · El exterior',
    title: 'Hacia lo desconocido',
    description: 'Más allá de Neptuno comienza el cinturón de Kuiper, frontera helada del sistema solar.',
    position: [0, 1.5, -66],
    target: [0, 0, -82],
  },
];
