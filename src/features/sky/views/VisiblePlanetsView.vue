<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useLocation } from '@/features/astronomy/composables/useLocation';
import { getVisiblePlanets } from '@/shared/services/visiblePlanets';
import type { VisiblePlanet } from '@/shared/types/sky';

const { location, locating, locationError, requestGeolocation } = useLocation();
const planets = ref<VisiblePlanet[]>([]);
const loading = ref(false);
const error = ref('');
const aboveHorizonOnly = ref(true);

const filtered = computed(() =>
  planets.value
    .filter((p) => !aboveHorizonOnly.value || p.altitude > 0)
    .sort((a, b) => b.altitude - a.altitude),
);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    planets.value = await getVisiblePlanets(location.value.latitude, location.value.longitude);
  } catch {
    error.value = 'No se pudieron cargar los planetas visibles. Intenta de nuevo.';
    planets.value = [];
  } finally {
    loading.value = false;
  }
}

function formatDirection(azimuth: number) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(azimuth / 45) % 8];
}

onMounted(load);
watch(() => [location.value.latitude, location.value.longitude], load);
</script>

<template>
  <div class="sky-view">
    <header class="hero">
      <p class="eyebrow">Cielo esta noche</p>
      <h1>Planetas visibles</h1>
      <p class="subtitle">Qué puedes ver desde {{ location.label }} ahora mismo.</p>
    </header>

    <section class="card controls">
      <div class="controls-row">
        <button class="action-btn" type="button" :disabled="locating" @click="requestGeolocation">
          {{ locating ? 'Obteniendo...' : 'Usar mi ubicación' }}
        </button>
        <button class="action-btn secondary" type="button" @click="load">Actualizar</button>
      </div>
      <label class="toggle">
        <input v-model="aboveHorizonOnly" type="checkbox">
        <span>Solo sobre el horizonte</span>
      </label>
      <p v-if="locationError" class="status error">{{ locationError }}</p>
    </section>

    <p v-if="loading" class="status">Cargando planetas visibles...</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <div v-else class="planet-grid">
      <article v-for="planet in filtered" :key="planet.name" class="card planet-card">
        <div class="top">
          <h2>{{ planet.name }}</h2>
          <span class="badge" :class="{ visible: planet.altitude > 0 }">
            {{ planet.altitude > 0 ? 'Sobre horizonte' : 'Bajo horizonte' }}
          </span>
        </div>
        <p class="constellation">Constelación: {{ planet.constellation }}</p>
        <dl class="stats">
          <div><dt>Altitud</dt><dd>{{ planet.altitude.toFixed(1) }}°</dd></div>
          <div><dt>Dirección</dt><dd>{{ formatDirection(planet.azimuth) }} ({{ planet.azimuth.toFixed(0) }}°)</dd></div>
          <div><dt>Magnitud</dt><dd>{{ planet.magnitude.toFixed(2) }}</dd></div>
          <div><dt>A simple vista</dt><dd>{{ planet.nakedEyeObject ? 'Sí' : 'No' }}</dd></div>
        </dl>
      </article>
      <p v-if="!filtered.length" class="status">No hay planetas para mostrar con este filtro.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sky-view { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle, .status { margin: 0; color: rgba(245,247,255,0.78); }
.error { color: #fca5a5; margin-top: 8px; }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); animation: fade-up 0.5s ease both; }
.controls { margin-bottom: 16px; }
.controls-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.action-btn { min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 0; background: #7dd3fc; color: #082f49; font-weight: 600; cursor: pointer; }
.action-btn.secondary { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.12); }
.action-btn:disabled { opacity: 0.6; }
.toggle { display: inline-flex; gap: 8px; align-items: center; min-height: 44px; color: rgba(245,247,255,0.9); }
.toggle input { width: 20px; height: 20px; }
.planet-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .planet-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .planet-grid { grid-template-columns: repeat(3, 1fr); } }
.top { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
.planet-card h2 { margin: 0; font-size: 1.35rem; }
.badge { font-size: 0.72rem; padding: 3px 8px; border-radius: 999px; background: rgba(255,255,255,0.08); color: rgba(245,247,255,0.8); white-space: nowrap; }
.badge.visible { background: rgba(52,211,153,0.16); color: #86efac; }
.constellation { margin: 8px 0 14px; color: rgba(245,247,255,0.76); }
.stats { margin: 0; display: grid; gap: 8px; }
.stats div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); }
dt { color: rgba(245,247,255,0.68); font-size: 0.88rem; }
dd { margin: 0; font-weight: 600; font-size: 0.88rem; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
</style>
