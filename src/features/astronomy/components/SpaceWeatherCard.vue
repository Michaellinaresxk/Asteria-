<script setup lang="ts">
import { onMounted, ref } from 'vue';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getSpaceWeatherAlerts, type SpaceWeatherAlert } from '@/shared/services/donki';

const alerts = ref<SpaceWeatherAlert[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    alerts.value = await getSpaceWeatherAlerts(7);
  } catch {
    error.value = 'No se pudo cargar el clima espacial.';
  } finally {
    loading.value = false;
  }
});

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
</script>

<template>
  <article class="card weather-card">
    <p class="eyebrow">DONKI · NASA</p>
    <h2>Clima espacial</h2>
    <p class="hint">Eyecciones solares y alertas geomagnéticas de los últimos 7 días.</p>

    <div v-if="loading" class="loading-block" aria-label="Cargando">
      <SkeletonLoader v-for="n in 3" :key="n" height="64px" radius="12px" />
    </div>
    <p v-else-if="error" class="status">{{ error }}</p>
    <p v-else-if="!alerts.length" class="status">No hay alertas recientes.</p>

    <ul v-else class="alert-list">
      <li v-for="alert in alerts.slice(0, 4)" :key="alert.id" class="alert-item">
        <div class="alert-head">
          <span class="badge">{{ alert.label }}</span>
          <time :datetime="alert.issuedAt">{{ formatDate(alert.issuedAt) }}</time>
        </div>
        <p class="summary">{{ alert.summary }}</p>
        <a v-if="alert.url" :href="alert.url" target="_blank" rel="noopener noreferrer">Ver informe ↗</a>
      </li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.card {
  background: rgba(10, 18, 40, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  color: #f5f7ff;
  animation: fade-up 0.5s ease both;
}
.eyebrow { margin: 0; color: #fbbf24; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
h2 { margin: 6px 0 4px; font-size: clamp(1.3rem, 4vw, 1.8rem); }
.hint, .status { margin: 0 0 12px; color: rgba(245, 247, 255, 0.72); font-size: 0.88rem; }
.alert-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.alert-item { padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.alert-head { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.badge { display: inline-block; font-size: 0.72rem; padding: 3px 8px; border-radius: 999px; background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
time { font-size: 0.78rem; color: rgba(245, 247, 255, 0.7); }
.summary { margin: 8px 0 4px; font-size: 0.88rem; line-height: 1.5; color: rgba(245, 247, 255, 0.86); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
a { color: #7dd3fc; font-size: 0.82rem; }
.loading-block { display: flex; flex-direction: column; gap: 10px; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .card { animation: none; } }
</style>
