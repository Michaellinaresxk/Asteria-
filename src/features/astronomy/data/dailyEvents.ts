import type { AstronomyEvent } from '@/shared/types/astronomy';

export const ASTRONOMY_EVENTS: AstronomyEvent[] = [
  { id: 'quadrantids', date: '01-03', title: 'Cuadrántidas', description: 'Lluvia de meteoros activa a inicios de enero, con picos intensos.', type: 'meteor-shower' },
  { id: 'earth-perihelion', date: '01-04', title: 'Perihelio terrestre', description: 'La Tierra alcanza su punto más cercano al Sol.', type: 'season' },
  { id: 'lyrids', date: '04-22', title: 'Líridas', description: 'Lluvia de meteoros de abril, restos del cometa Thatcher.', type: 'meteor-shower' },
  { id: 'eta-aquariids', date: '05-06', title: 'Eta Acuáridas', description: 'Meteoros asociados al cometa Halley, mejores antes del amanecer.', type: 'meteor-shower' },
  { id: 'summer-solstice', date: '06-21', title: 'Solsticio de junio', description: 'Inicio del verano en el hemisferio norte y del invierno en el sur.', type: 'season' },
  { id: 'delta-aquariids', date: '07-30', title: 'Delta Acuáridas', description: 'Lluvia de meteoros activa en noches de verano.', type: 'meteor-shower' },
  { id: 'perseids', date: '08-12', title: 'Perseidas', description: 'Una de las lluvias de meteoros más populares del año.', type: 'meteor-shower' },
  { id: 'autumn-equinox', date: '09-22', title: 'Equinoccio de septiembre', description: 'El día y la noche tienen duración similar en gran parte del planeta.', type: 'season' },
  { id: 'orionids', date: '10-21', title: 'Oriónidas', description: 'Meteoros rápidos originados por el cometa Halley.', type: 'meteor-shower' },
  { id: 'leonids', date: '11-17', title: 'Leónidas', description: 'Lluvia de meteoros conocida por tormentas históricas.', type: 'meteor-shower' },
  { id: 'geminids', date: '12-14', title: 'Gemínidas', description: 'Suele ser la lluvia de meteoros más intensa y confiable.', type: 'meteor-shower' },
  { id: 'winter-solstice', date: '12-21', title: 'Solsticio de diciembre', description: 'Cambio estacional marcado por la inclinación de la Tierra.', type: 'season' },
];

export function getEventsForDate(date: Date = new Date(), windowDays = 7): AstronomyEvent[] {
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const year = date.getFullYear();

  return ASTRONOMY_EVENTS.filter((event) => {
    const [mm, dd] = event.date.split('-').map(Number);
    const eventDate = new Date(year, mm - 1, dd);
    const diffDays = Math.round((eventDate.getTime() - new Date(year, date.getMonth(), date.getDate()).getTime()) / 86400000);
    return event.date === monthDay || (diffDays >= 0 && diffDays <= windowDays);
  }).sort((a, b) => a.date.localeCompare(b.date));
}
