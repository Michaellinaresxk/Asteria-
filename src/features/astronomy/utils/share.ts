import type { AstronomyEvent, MoonPhaseInfo } from '@/shared/types/astronomy';

export function buildShareText(date: Date, moon: MoonPhaseInfo, nextEvent?: AstronomyEvent): string {
  const dateText = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lines = [
    `Hoy en el cielo - ${dateText}`,
    `${moon.emoji} ${moon.phase} (${moon.illumination}% iluminada)`,
  ];
  if (nextEvent) {
    lines.push(`Próximo evento: ${nextEvent.title} (${nextEvent.date})`);
  }
  lines.push('Explora más en Weight on Space / Astronomy App');
  return lines.join('\n');
}
