<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { searchPlanetImages } from '@/shared/services/nasa';
import { EARTH_GRAVITY } from '@/features/planets/data/gravity';
import { getBodyById } from '../data/bodies';

const route = useRoute();
const body = computed(() => getBodyById(String(route.params.id)));

const weight = ref<number | null>(null);
const imageUrl = ref('');
const imageLoading = ref(false);
const imageError = ref('');

const calculatedWeight = computed(() => {
  if (!body.value || weight.value === null) return null;
  return Math.round((weight.value * body.value.gravity) / EARTH_GRAVITY);
});

async function loadImage(name: string) {
  imageLoading.value = true;
  imageError.value = '';
  imageUrl.value = '';
  try {
    const items = await searchPlanetImages(name);
    const pick = items[Math.floor(Math.random() * Math.min(items.length, 50))];
    imageUrl.value = pick?.links?.[0]?.href ?? '';
  } catch {
    imageError.value = 'No se pudo cargar la imagen.';
  } finally {
    imageLoading.value = false;
  }
}

watch(body, (next) => {
  if (next) void loadImage(next.name);
}, { immediate: true });
</script>

<template>
  <div class="detail">
    <RouterLink to="/planetas" class="back-link">← Volver a explorar</RouterLink>

    <div v-if="!body" class="card not-found">
      <h1>Cuerpo no encontrado</h1>
      <p>No encontramos ese cuerpo celeste.</p>
    </div>

    <template v-else>
      <header class="hero">
        <p class="eyebrow">{{ body.type === 'moon' ? 'Luna' : body.type === 'star' ? 'Estrella' : 'Planeta' }}</p>
        <h1>{{ body.name }}</h1>
        <p class="subtitle">{{ body.description }}</p>
      </header>

      <div class="detail-grid">
        <section class="card info-card">
          <div v-if="imageLoading" class="loading-block"><SkeletonLoader height="240px" radius="14px" /></div>
          <img v-else-if="imageUrl" :src="imageUrl" :alt="body.name" class="body-image" loading="lazy">
          <p v-else-if="imageError" class="status">{{ imageError }}</p>

          <dl class="facts">
            <div><dt>Gravedad</dt><dd>{{ body.gravity }} m/s²</dd></div>
            <div><dt>Duración del día</dt><dd>{{ body.dayLength }}</dd></div>
            <div><dt>Duración del año</dt><dd>{{ body.yearLength }}</dd></div>
          </dl>
          <p class="fun-fact"><strong>Dato curioso:</strong> {{ body.funFact }}</p>
        </section>

        <section class="card calc-card">
          <p class="eyebrow">Calculadora</p>
          <h2>Tu peso en {{ body.name }}</h2>
          <label class="field">
            <span>Tu peso en la Tierra (kg)</span>
            <input v-model.number="weight" type="number" min="0" step="any" placeholder="Ej: 70">
          </label>

          <div v-if="calculatedWeight !== null" class="result" aria-live="polite">
            <span class="result-label">Pesarías</span>
            <strong class="result-value">{{ calculatedWeight }} kg</strong>
            <span class="result-note">en {{ body.name }}</span>
          </div>
          <p v-else class="hint">Ingresa tu peso para ver el resultado.</p>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.detail { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.back-link { display: inline-flex; min-height: 44px; align-items: center; color: #7dd3fc; text-decoration: none; font-weight: 600; margin-bottom: 8px; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.82); line-height: 1.6; }
.detail-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 900px) { .detail-grid { grid-template-columns: 1.2fr 1fr; align-items: start; } }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); animation: fade-up 0.5s ease both; }
.body-image { width: 100%; max-height: 300px; object-fit: cover; border-radius: 14px; margin-bottom: 16px; }
.facts { display: grid; gap: 12px; margin: 0; }
.facts div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); }
dt { color: rgba(245,247,255,0.7); }
dd { margin: 0; font-weight: 600; text-align: right; }
.fun-fact { margin: 16px 0 0; line-height: 1.6; color: rgba(245,247,255,0.88); }
.calc-card h2 { margin: 6px 0 16px; font-size: 1.4rem; }
.field { display: flex; flex-direction: column; gap: 6px; color: rgba(245,247,255,0.85); }
input { width: 100%; min-height: 44px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; padding: 0 12px; font-size: 1rem; }
.result { margin-top: 20px; padding: 20px; border-radius: 16px; background: rgba(125,211,252,0.12); text-align: center; }
.result-label, .result-note { display: block; color: rgba(245,247,255,0.8); }
.result-value { display: block; font-size: clamp(2rem, 8vw, 3rem); color: #7dd3fc; margin: 4px 0; }
.hint, .status { color: rgba(245,247,255,0.72); margin-top: 16px; }
.loading-block { margin-bottom: 16px; }
.not-found h1 { font-size: 1.8rem; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
</style>
