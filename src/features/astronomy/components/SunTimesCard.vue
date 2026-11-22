<script setup lang="ts">
import { ref, watch } from 'vue';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getSunTimes } from '@/shared/services/sunTimes';
import type { SunTimes, UserLocation } from '@/shared/types/location';

const props = defineProps<{
  location: UserLocation;
}>();

const sunTimes = ref<SunTimes | null>(null);
const loading = ref(false);
const error = ref('');

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDayLength(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    sunTimes.value = await getSunTimes(props.location.latitude, props.location.longitude);
  } catch {
    error.value = 'No se pudieron cargar los horarios solares.';
    sunTimes.value = null;
  } finally {
    loading.value = false;
  }
}

watch(() => [props.location.latitude, props.location.longitude], () => { void load(); }, { immediate: true });
</script>

<template>
  <article class="card sun-card">
    <p class="eyebrow">Sol hoy</p>
    <h2>Amanecer y atardecer</h2>
    <p class="location-label">{{ location.label }}</p>

    <div v-if="loading" class="loading-block" aria-label="Cargando">
      <SkeletonLoader height="52px" />
      <SkeletonLoader height="52px" />
      <SkeletonLoader height="52px" />
    </div>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <div v-else-if="sunTimes" class="times-grid">
      <div class="time-item">
        <span class="icon">🌅</span>
        <div><span class="label">Amanecer</span><strong>{{ formatTime(sunTimes.sunrise) }}</strong></div>
      </div>
      <div class="time-item">
        <span class="icon">🌇</span>
        <div><span class="label">Atardecer</span><strong>{{ formatTime(sunTimes.sunset) }}</strong></div>
      </div>
      <div class="time-item">
        <span class="icon">☀️</span>
        <div><span class="label">Mediodía solar</span><strong>{{ formatTime(sunTimes.solarNoon) }}</strong></div>
      </div>
      <div class="time-item">
        <span class="icon">⏱️</span>
        <div><span class="label">Duración del día</span><strong>{{ formatDayLength(sunTimes.dayLengthSeconds) }}</strong></div>
      </div>
      <div class="time-item">
        <span class="icon">🌆</span>
        <div><span class="label">Crepúsculo civil</span><strong>{{ formatTime(sunTimes.civilTwilightBegin) }} - {{ formatTime(sunTimes.civilTwilightEnd) }}</strong></div>
      </div>
    </div>
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
  text-align: left;
  animation: fade-up 0.5s ease 0.15s both;
}
.eyebrow { margin: 0; color: #fdba74; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
h2 { margin: 6px 0 4px; font-size: clamp(1.2rem, 4vw, 1.6rem); }
.location-label, .status { color: rgba(245,247,255,0.75); font-size: 0.9rem; margin: 0 0 14px; }
.error { color: #fca5a5; }
.loading-block { display: flex; flex-direction: column; gap: 10px; }
.times-grid { display: grid; gap: 12px; }
.time-item { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.08); }
.icon { font-size: 1.5rem; width: 32px; text-align: center; }
.label { display: block; font-size: 0.8rem; color: rgba(245,247,255,0.7); }
strong { font-size: 1rem; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
</style>
