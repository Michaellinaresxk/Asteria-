<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useLocation } from '@/features/astronomy/composables/useLocation';
import { getIssPasses, getIssPosition } from '@/shared/services/iss';
import type { IssPass, IssPosition } from '@/shared/types/iss';

const { location, locating, locationError, requestGeolocation } = useLocation();

const position = ref<IssPosition | null>(null);
const passes = ref<IssPass[]>([]);
const loadingPos = ref(false);
const loadingPasses = ref(false);
const posError = ref('');
const passError = ref('');
let timer: number | undefined;

function formatTime(ts: number) {
  return new Date(ts * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

async function loadPosition() {
  loadingPos.value = true;
  posError.value = '';
  try {
    position.value = await getIssPosition();
  } catch {
    posError.value = 'No se pudo obtener la posición actual de la ISS.';
  } finally {
    loadingPos.value = false;
  }
}

async function loadPasses() {
  loadingPasses.value = true;
  passError.value = '';
  try {
    passes.value = await getIssPasses(location.value.latitude, location.value.longitude);
  } catch {
    passError.value = 'No se pudieron obtener próximos pasos. Puede depender de la API o de la red.';
    passes.value = [];
  } finally {
    loadingPasses.value = false;
  }
}

onMounted(() => {
  void loadPosition();
  void loadPasses();
  timer = window.setInterval(() => { void loadPosition(); }, 10000);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

watch(() => [location.value.latitude, location.value.longitude], () => { void loadPasses(); });
</script>

<template>
  <div class="iss-view">
    <header class="hero">
      <p class="eyebrow">ISS en vivo</p>
      <h1>Rastreador de la Estación Espacial</h1>
      <p class="subtitle">Sigue la posición actual de la ISS y consulta sus próximos pasos sobre tu ubicación.</p>
    </header>

    <div class="grid">
      <section class="card">
        <div class="card-head">
          <div>
            <p class="eyebrow">Posición actual</p>
            <h2>¿Dónde está ahora?</h2>
          </div>
          <button class="refresh-btn" type="button" @click="loadPosition">Actualizar</button>
        </div>

        <p v-if="loadingPos && !position" class="status">Cargando posición...</p>
        <p v-else-if="posError" class="status error">{{ posError }}</p>

        <div v-if="position" class="stats">
          <div class="stat"><span class="label">Latitud</span><strong>{{ position.latitude.toFixed(4) }}</strong></div>
          <div class="stat"><span class="label">Longitud</span><strong>{{ position.longitude.toFixed(4) }}</strong></div>
          <div class="stat"><span class="label">Altitud</span><strong>{{ position.altitude.toFixed(1) }} km</strong></div>
          <div class="stat"><span class="label">Velocidad</span><strong>{{ position.velocity.toFixed(0) }} km/h</strong></div>
          <div class="stat"><span class="label">Visibilidad</span><strong>{{ position.visibility }}</strong></div>
          <div class="stat"><span class="label">Actualizado</span><strong>{{ formatTime(position.timestamp) }}</strong></div>
        </div>

        <a
          v-if="position"
          class="map-link"
          :href="`https://www.google.com/maps?q=${position.latitude},${position.longitude}`"
          target="_blank"
          rel="noopener noreferrer"
        >Ver en mapa</a>
      </section>

      <section class="card">
        <p class="eyebrow">Tu ubicación</p>
        <h2>Próximos pasos</h2>
        <p class="location">{{ location.label }} ({{ location.latitude }}, {{ location.longitude }})</p>
        <button class="refresh-btn" type="button" :disabled="locating" @click="requestGeolocation">
          {{ locating ? 'Obteniendo...' : 'Usar mi ubicación' }}
        </button>
        <p v-if="locationError" class="status error">{{ locationError }}</p>

        <p v-if="loadingPasses" class="status">Buscando próximos pasos...</p>
        <p v-else-if="passError" class="status error">{{ passError }}</p>
        <ul v-else-if="passes.length" class="passes">
          <li v-for="pass in passes" :key="pass.risetime" class="pass-item">
            <span class="pass-time">{{ formatTime(pass.risetime) }}</span>
            <span class="pass-duration">Duración: {{ formatDuration(pass.duration) }}</span>
          </li>
        </ul>
        <p v-else class="status">No hay pasos disponibles.</p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.iss-view { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }
.grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 900px) { .grid { grid-template-columns: 1.2fr 1fr; } }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); animation: fade-up 0.5s ease both; }
.card-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
h2 { margin: 6px 0 14px; font-size: 1.4rem; }
.refresh-btn, .map-link { min-height: 44px; padding: 10px 14px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
.refresh-btn { border: 1px solid rgba(125,211,252,0.3); background: rgba(125,211,252,0.12); color: #7dd3fc; cursor: pointer; }
.map-link { margin-top: 16px; background: #7dd3fc; color: #082f49; }
.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 420px) { .stats { grid-template-columns: 1fr; } }
.stat { padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); }
.label { display: block; font-size: 0.78rem; color: rgba(245,247,255,0.68); margin-bottom: 4px; }
strong { font-size: 1rem; }
.location, .status { color: rgba(245,247,255,0.8); }
.error { color: #fca5a5; }
.passes { list-style: none; padding: 0; margin: 14px 0 0; display: flex; flex-direction: column; gap: 10px; }
.pass-item { padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 4px; }
.pass-time { font-weight: 600; }
.pass-duration { color: rgba(245,247,255,0.72); font-size: 0.9rem; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
</style>
