import axios from 'axios';

import { NASA_API_KEY } from './nasaApi';
import { addDays, toIsoDate } from '@/shared/utils/dates';

interface RawNotification {
  messageID: string;
  messageType: string;
  messageIssueTime: string;
  messageBody: string;
  messageURL?: string;
}

export interface SpaceWeatherAlert {
  id: string;
  type: string;
  label: string;
  issuedAt: string;
  summary: string;
  url: string;
}

const TYPE_LABELS: Record<string, string> = {
  CME: 'Eyección de masa coronal',
  RBE: 'Cinturón de radiación',
  WSA: 'Alerta solar',
  FLR: 'Llamarada solar',
  GST: 'Tormenta geomagnética',
  Report: 'Informe',
};

export function summarizeNotification(body: string): string {
  const clean = body
    .replace(/^##.*$/gm, ' ')
    .replace(/[#*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > 180 ? `${clean.slice(0, 180)}…` : clean;
}

export function normalizeNotifications(items: RawNotification[]): SpaceWeatherAlert[] {
  return items.map((item) => ({
    id: item.messageID,
    type: item.messageType,
    label: TYPE_LABELS[item.messageType] ?? item.messageType,
    issuedAt: item.messageIssueTime,
    summary: summarizeNotification(item.messageBody ?? ''),
    url: item.messageURL ?? '',
  }));
}

/** Recent NASA DONKI space-weather alerts (solar flares, CMEs, geomagnetic storms). */
export async function getSpaceWeatherAlerts(days = 7): Promise<SpaceWeatherAlert[]> {
  const end = new Date();
  const start = addDays(end, -days);

  const { data } = await axios.get<RawNotification[]>('https://api.nasa.gov/DONKI/notifications', {
    params: {
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
      type: 'all',
      api_key: NASA_API_KEY,
    },
    timeout: 10000,
  });

  return normalizeNotifications(Array.isArray(data) ? data : []);
}
