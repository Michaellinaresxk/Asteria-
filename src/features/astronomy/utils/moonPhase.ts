import type { MoonPhaseInfo } from '@/shared/types/astronomy';

const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const daysSinceNew = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const cycle = ((daysSinceNew % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const fraction = cycle / SYNODIC_MONTH;
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * fraction)) * 50);

  if (fraction < 0.0625 || fraction >= 0.9375) {
    return { phase: 'Luna nueva', emoji: '🌑', illumination, description: 'La Luna está entre la Tierra y el Sol.' };
  }
  if (fraction < 0.1875) {
    return { phase: 'Creciente cóncava', emoji: '🌒', illumination, description: 'Empieza a verse una fina franja iluminada.' };
  }
  if (fraction < 0.3125) {
    return { phase: 'Cuarto creciente', emoji: '🌓', illumination, description: 'La mitad derecha de la Luna es visible.' };
  }
  if (fraction < 0.4375) {
    return { phase: 'Creciente gibosa', emoji: '🌔', illumination, description: 'La Luna se acerca a la fase llena.' };
  }
  if (fraction < 0.5625) {
    return { phase: 'Luna llena', emoji: '🌕', illumination, description: 'La cara visible de la Luna está totalmente iluminada.' };
  }
  if (fraction < 0.6875) {
    return { phase: 'Menguante gibosa', emoji: '🌖', illumination, description: 'La luz comienza a disminuir después de la luna llena.' };
  }
  if (fraction < 0.8125) {
    return { phase: 'Cuarto menguante', emoji: '🌗', illumination, description: 'La mitad izquierda de la Luna es visible.' };
  }
  return { phase: 'Menguante cóncava', emoji: '🌘', illumination, description: 'Queda una fina franja antes de la luna nueva.' };
}
