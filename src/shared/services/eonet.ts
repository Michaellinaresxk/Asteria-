import axios from 'axios';

interface RawGeometry {
  date: string;
  type: string;
  coordinates?: number[];
  magnitudeValue?: number;
  magnitudeUnit?: string;
}

interface RawEvent {
  id: string;
  title: string;
  link: string;
  categories?: Array<{ id: string; title: string }>;
  geometry?: RawGeometry[];
}

export interface NaturalEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  latitude: number;
  longitude: number;
  magnitude: string;
  link: string;
}

export function normalizeEonetEvents(events: RawEvent[]): NaturalEvent[] {
  return events.map((event) => {
    const point = [...(event.geometry ?? [])].reverse().find((geometry) => geometry.type === 'Point' && geometry.coordinates);
    const [longitude, latitude] = point?.coordinates ?? [];

    return {
      id: event.id,
      title: event.title,
      category: event.categories?.[0]?.title ?? 'Otro',
      date: point?.date ?? '',
      latitude: typeof latitude === 'number' ? latitude : 0,
      longitude: typeof longitude === 'number' ? longitude : 0,
      magnitude: point?.magnitudeValue != null
        ? `${point.magnitudeValue} ${point.magnitudeUnit ?? ''}`.trim()
        : '',
      link: event.link,
    };
  });
}

/** Open natural events (wildfires, storms, volcanoes) from NASA EONET. */
export async function getNaturalEvents(limit = 20): Promise<NaturalEvent[]> {
  const { data } = await axios.get<{ events: RawEvent[] }>('https://eonet.gsfc.nasa.gov/api/v3/events', {
    params: { status: 'open', limit },
    timeout: 10000,
  });

  return normalizeEonetEvents(data.events ?? []);
}
