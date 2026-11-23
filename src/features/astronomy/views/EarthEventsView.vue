<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getNaturalEvents, type NaturalEvent } from '@/shared/services/eonet';

const events = ref<NaturalEvent[]>([]);
const loading = ref(true);
const error = ref('');
const activeCategory = ref('all');

const categories = computed(() => ['all', ...new Set(events.value.map((event) => event.category))]);
const visibleEvents = computed(() =>
  activeCategory.value === 'all' ? events.value : events.value.filter((event) => event.category === activeCategory.value),
);

onMounted(load);

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';

  try {
    events.value = await getNaturalEvents(30);
  } catch {
    error.value = 'No se pudieron cargar los eventos naturales.';
  } finally {
    loading.value = false;
  }
}

function formatDate(value: string): string {
  if (!value) return 'Fecha desconocida';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<template>
  <div class="earth-events">
    <header class="hero">
      <p class="eyebrow">EONET · NASA</p>
      <h1>Planeta vivo</h1>
      <p class="subtitle">Eventos naturales activos en la Tierra: incendios, tormentas y volcanes.</p>
    </header>

    <div v-if="categories.length > 1" class="filters" aria-label="Filtro de eventos">
      <button
        v-for="category in categories"
        :key="category"
        class="chip"
        :class="{ active: activeCategory === category }"
        type="button"
        @click="activeCategory = category"
      >
        {{ category === 'all' ? 'Todos' : category }}
      </button>
    </div>

    <p v-if="loading" class="status" role="status">Cargando eventos…</p>
    <div v-if="loading" class="list" aria-hidden="true">
      <SkeletonLoader v-for="n in 4" :key="n" height="96px" radius="16px" />
    </div>

    <div v-else-if="error" class="message" role="alert">
      <p>{{ error }}</p>
      <button class="action-btn" type="button" @click="load">Reintentar</button>
    </div>

    <div v-else-if="visibleEvents.length" class="list">
      <article v-for="event in visibleEvents" :key="event.id" class="event-card">
        <div class="event-top">
          <span class="badge">{{ event.category }}</span>
          <time :datetime="event.date">{{ formatDate(event.date) }}</time>
        </div>
        <h2>{{ event.title }}</h2>
        <p class="meta">
          {{ event.latitude.toFixed(2) }}°, {{ event.longitude.toFixed(2) }}°
          <span v-if="event.magnitude"> · {{ event.magnitude }}</span>
        </p>
        <a :href="event.link" target="_blank" rel="noopener noreferrer">Ver en EONET ↗</a>
      </article>
    </div>

    <p v-else class="message">No hay eventos activos en esta categoría.</p>
  </div>
</template>

<style scoped lang="scss">
.earth-events { max-width: 900px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 20px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #86efac; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245, 247, 255, 0.78); }
.filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px; -webkit-overflow-scrolling: touch; }
.chip { flex: 0 0 auto; min-height: 44px; padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; cursor: pointer; }
.chip.active { background: rgba(134,239,172,0.16); color: #86efac; border-color: rgba(134,239,172,0.4); }
.list { display: grid; gap: 12px; }
.event-card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px; backdrop-filter: blur(10px); animation: fade-up 0.4s ease both; }
.event-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.badge { display: inline-block; font-size: 0.72rem; padding: 3px 8px; border-radius: 999px; background: rgba(134,239,172,0.14); color: #86efac; }
time { font-size: 0.78rem; color: rgba(245,247,255,0.7); }
h2 { margin: 10px 0 4px; font-size: 1.05rem; }
.meta { margin: 0 0 8px; font-size: 0.84rem; color: rgba(245,247,255,0.72); }
a { color: #7dd3fc; font-size: 0.85rem; }
.status, .message { color: rgba(245,247,255,0.8); }
.message { padding: 24px; border: 1px dashed rgba(255,255,255,0.18); border-radius: 16px; text-align: center; }
.action-btn { min-height: 44px; padding: 10px 16px; border-radius: 12px; border: 0; background: #7dd3fc; color: #082f49; font-weight: 700; cursor: pointer; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .event-card { animation: none; } }
</style>
