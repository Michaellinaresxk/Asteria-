export interface ApodResponse {
  date: string;
  explanation: string;
  media_type: 'image' | 'video' | string;
  title: string;
  url: string;
  hdurl?: string;
  copyright?: string;
  thumbnail_url?: string;
}

export interface AstronomyEvent {
  id: string;
  date: string; // MM-DD
  fullDate?: string; // YYYY-MM-DD, present for year-specific events from APIs
  title: string;
  description: string;
  type: 'meteor-shower' | 'eclipse' | 'conjunction' | 'planet' | 'moon' | 'season' | 'asteroid';
  detailUrl?: string;
}

export interface MoonPhaseInfo {
  phase: string;
  emoji: string;
  illumination: number;
  description: string;
}
