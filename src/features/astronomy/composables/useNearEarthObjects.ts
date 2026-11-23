import { computed, ref } from 'vue';

import { getNearEarthObjects } from '@/shared/services/neoWs';
import type { AstronomyEvent } from '@/shared/types/astronomy';
import { chunkDateRange, type DateChunk } from '@/shared/utils/dates';

import { neoToEvents } from '../utils/neoEvents';

/** Module-level cache so the dashboard and calendar share the same responses. */
const cache = new Map<string, AstronomyEvent[]>();
const inflight = new Map<string, Promise<AstronomyEvent[]>>();

async function fetchChunk(chunk: DateChunk): Promise<AstronomyEvent[]> {
  const objects = await getNearEarthObjects(chunk.start, chunk.end);
  const converted = neoToEvents(objects);
  cache.set(chunk.key, converted);
  return converted;
}

async function getChunk(chunk: DateChunk): Promise<AstronomyEvent[]> {
  if (inflight.has(chunk.key)) return inflight.get(chunk.key)!;

  const pending = fetchChunk(chunk).finally(() => inflight.delete(chunk.key));
  inflight.set(chunk.key, pending);
  return pending;
}

export function useNearEarthObjects() {
  const events = ref<AstronomyEvent[]>([]);
  const loading = ref(false);
  const error = ref('');
  const count = computed(() => events.value.length);

  let activeRequest = 0;

  async function loadRange(start: Date, end: Date): Promise<void> {
    const chunks = chunkDateRange(start, end);
    const request = ++activeRequest;

    if (!chunks.some((chunk) => !cache.has(chunk.key))) {
      events.value = chunks.flatMap((chunk) => cache.get(chunk.key) ?? []);
      error.value = '';
      return;
    }

    loading.value = true;
    error.value = '';

    try {
      await Promise.all(chunks.map(getChunk));

      if (request === activeRequest) {
        events.value = chunks.flatMap((chunk) => cache.get(chunk.key) ?? []);
      }
    } catch (caught) {
      if (request === activeRequest) {
        error.value = caught instanceof Error && caught.message === 'LÍMITE_NEGOWS'
          ? 'Límite de peticiones de la NASA alcanzado. Configura VITE_NASA_API_KEY o espera unos minutos.'
          : 'No se pudieron cargar los asteroides cercanos desde la NASA.';
      }
    } finally {
      if (request === activeRequest) loading.value = false;
    }
  }

  return { events, loading, error, count, loadRange };
}
