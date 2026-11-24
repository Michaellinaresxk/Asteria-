import type { CelestialBody } from '@/shared/types/celestial';

export const CELESTIAL_BODIES: CelestialBody[] = [
  { id: 'sun', name: 'Sol', gravity: 274, type: 'star', description: 'La estrella que da luz y calor a todo el sistema solar.', dayLength: '25 días terrestres', yearLength: '230 millones de años', funFact: 'Contiene el 99.8% de la masa del sistema solar.' },
  { id: 'mercury', name: 'Mercurio', gravity: 3.7, type: 'planet', description: 'El planeta más cercano al Sol y el más pequeño del sistema solar.', dayLength: '59 días terrestres', yearLength: '88 días terrestres', funFact: 'Sus temperaturas pueden variar más de 600°C entre el día y la noche.' },
  { id: 'venus', name: 'Venus', gravity: 8.87, type: 'planet', description: 'Un mundo rocoso con una atmósfera densa y efecto invernadero extremo.', dayLength: '243 días terrestres', yearLength: '225 días terrestres', funFact: 'Gira en dirección opuesta a la mayoría de los planetas.' },
  { id: 'earth', name: 'Tierra', gravity: 9.81, type: 'planet', description: 'Nuestro hogar: el único mundo conocido con agua líquida y vida.', dayLength: '24 horas', yearLength: '365.25 días', funFact: 'El 71% de su superficie está cubierta por océanos.' },
  { id: 'mars', name: 'Marte', gravity: 3.7, type: 'planet', description: 'El planeta rojo, objetivo clave para la exploración humana.', dayLength: '24.6 horas', yearLength: '687 días terrestres', funFact: 'Tiene el volcán más grande conocido: Olympus Mons.' },
  { id: 'jupiter', name: 'Júpiter', gravity: 24.8, type: 'planet', description: 'El gigante gaseoso más grande del sistema solar.', dayLength: '9.9 horas', yearLength: '11.86 años terrestres', funFact: 'Su Gran Mancha Roja es una tormenta gigantesca activa desde hace siglos.' },
  { id: 'saturn', name: 'Saturno', gravity: 10.4, type: 'planet', description: 'Famoso por su sistema de anillos espectacular.', dayLength: '10.7 horas', yearLength: '29.45 años terrestres', funFact: 'Es tan poco denso que flotaría en un océano suficientemente grande.' },
  { id: 'uranus', name: 'Urano', gravity: 8.7, type: 'planet', description: 'Un gigante de hielo con una inclinación axial extrema.', dayLength: '17.2 horas', yearLength: '84 años terrestres', funFact: 'Rota prácticamente de lado respecto a su órbita.' },
  { id: 'neptune', name: 'Neptuno', gravity: 11.15, type: 'planet', description: 'El planeta más lejano, con vientos supersónicos.', dayLength: '16.1 horas', yearLength: '164.8 años terrestres', funFact: 'Sus vientos pueden superar los 2,000 km/h.' },
  { id: 'moon', name: 'Luna', gravity: 1.62, type: 'moon', description: 'El único satélite natural de la Tierra y el único cuerpo visitado por humanos.', dayLength: '27.3 días terrestres', yearLength: '27.3 días terrestres', funFact: 'La misma cara de la Luna siempre apunta hacia la Tierra.' },
];

export function getBodyById(id: string): CelestialBody | undefined {
  return CELESTIAL_BODIES.find((body) => body.id === id);
}
