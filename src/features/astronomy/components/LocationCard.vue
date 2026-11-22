<script setup lang="ts">
import { ref, watch } from 'vue';

import type { UserLocation } from '@/shared/types/location';

const props = defineProps<{
  location: UserLocation;
  locating: boolean;
  error: string;
}>();

const emit = defineEmits<{
  'update:location': [location: UserLocation];
  'request-geolocation': [];
}>();

const lat = ref(String(props.location.latitude));
const lng = ref(String(props.location.longitude));
const label = ref(props.location.label);

watch(() => props.location, (next) => {
  lat.value = String(next.latitude);
  lng.value = String(next.longitude);
  label.value = next.label;
});

function submitManual() {
  const latitude = Number(lat.value);
  const longitude = Number(lng.value);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  emit('update:location', {
    latitude,
    longitude,
    label: label.value.trim() || 'Ubicación personalizada',
  });
}
</script>

<template>
  <article class="card location-card">
    <p class="eyebrow">Tu ubicación</p>
    <h2>Personaliza el cielo</h2>
    <p class="current">Actual: <strong>{{ location.label }}</strong> ({{ location.latitude }}, {{ location.longitude }})</p>

    <button class="btn geo-btn" type="button" :disabled="locating" @click="emit('request-geolocation')">
      {{ locating ? 'Obteniendo ubicación...' : 'Usar mi ubicación' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>

    <form class="manual-form" @submit.prevent="submitManual">
      <label class="field">
        <span>Nombre</span>
        <input v-model="label" type="text" placeholder="Mi ciudad">
      </label>
      <div class="coords">
        <label class="field">
          <span>Latitud</span>
          <input v-model="lat" type="number" step="any" required>
        </label>
        <label class="field">
          <span>Longitud</span>
          <input v-model="lng" type="number" step="any" required>
        </label>
      </div>
      <button class="btn save-btn" type="submit">Guardar ubicación</button>
    </form>
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
  animation: fade-up 0.5s ease 0.05s both;
}
.eyebrow { margin: 0; color: #86efac; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
h2 { margin: 6px 0 8px; font-size: clamp(1.2rem, 4vw, 1.6rem); }
.current { margin: 0 0 14px; color: rgba(245,247,255,0.85); font-size: 0.92rem; }
.btn { min-height: 44px; border: 0; border-radius: 12px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
.geo-btn { width: 100%; background: rgba(134,239,172,0.16); color: #86efac; }
.geo-btn:disabled { opacity: 0.6; }
.error { color: #fca5a5; font-size: 0.85rem; margin: 8px 0 0; }
.manual-form { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.coords { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; color: rgba(245,247,255,0.85); }
input { width: 100%; min-height: 44px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; padding: 0 12px; }
.save-btn { background: #7dd3fc; color: #082f49; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 420px) { .coords { grid-template-columns: 1fr; } }
</style>
