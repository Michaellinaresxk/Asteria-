const NAMES: Record<string, string> = {
  Sun: 'Sol',
  Moon: 'Luna',
  Mercury: 'Mercurio',
  Venus: 'Venus',
  Earth: 'Tierra',
  Mars: 'Marte',
  Jupiter: 'Júpiter',
  Saturn: 'Saturno',
  Uranus: 'Urano',
  Neptune: 'Neptuno',
};

export function planetLabel(name: string): string {
  return NAMES[name] ?? name;
}
