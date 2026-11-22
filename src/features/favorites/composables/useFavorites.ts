import { computed, ref, watch } from 'vue';

const STORAGE_KEY = 'astronomy-favorites';

interface FavoritesState {
  bodies: string[];
  events: string[];
}

function load(): FavoritesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bodies: [], events: [] };
    const parsed = JSON.parse(raw) as FavoritesState;
    return {
      bodies: Array.isArray(parsed.bodies) ? parsed.bodies : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return { bodies: [], events: [] };
  }
}

export function useFavorites() {
  const state = ref<FavoritesState>(load());

  watch(state, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true });

  function toggleBody(id: string) {
    const set = new Set(state.value.bodies);
    if (set.has(id)) set.delete(id); else set.add(id);
    state.value.bodies = [...set];
  }

  function toggleEvent(id: string) {
    const set = new Set(state.value.events);
    if (set.has(id)) set.delete(id); else set.add(id);
    state.value.events = [...set];
  }

  const isBodyFavorite = (id: string) => state.value.bodies.includes(id);
  const isEventFavorite = (id: string) => state.value.events.includes(id);
  const count = computed(() => state.value.bodies.length + state.value.events.length);

  return { state, toggleBody, toggleEvent, isBodyFavorite, isEventFavorite, count };
}
