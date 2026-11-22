<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

import ImageLightbox from '@/shared/components/ImageLightbox.vue';
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { searchPlanetImages } from '@/shared/services/nasa';
import { EARTH_GRAVITY } from '@/features/planets/data/gravity';
import { useFavorites } from '@/features/favorites/composables/useFavorites';
import { getBodyById } from '../data/bodies';

const Planet3D = defineAsyncComponent({
  loader: () => import('../components/Planet3D.vue'),
  loadingComponent: SkeletonLoader,
  delay: 200,
});

const route = useRoute();
const body = computed(() => getBodyById(String(route.params.id)));
const { toggleBody, isBodyFavorite } = useFavorites();

const weight = ref<number | null>(null);
const images = ref<string[]>([]);
const imageLoading = ref(false);
const imageError = ref('');
const selectedImage = ref<string | null>(null);

const calculatedWeight = computed(() => {
  if (!body.value || weight.value === null) return null;
  return Math.round((weight.value * body.value.gravity) / EARTH_GRAVITY);
});

async function loadImages(name: string) {
  imageLoading.value = true;
  imageError.value = '';
  images.value = [];
  try {
    const items = await searchPlanetImages(name);
    images.value = items
      .map((item) => item.links?.[0]?.href)
      .filter((href): href is string => Boolean(href))
      .slice(0, 8);
  } catch {
    imageError.value = 'No se pudieron cargar las imágenes.';
  } finally {
    imageLoading.value = false;
  }
}

watch(body, (next) => {
  if (next) void loadImages(next.name);
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
        <button class="favorite-btn" type="button" @click="toggleBody(body.id)">
          {{ isBodyFavorite(body.id) ? '★ Guardado en favoritos' : '☆ Guardar en favoritos' }}
        </button>
      </header>

      <div class="detail-grid">
        <section v-reveal class="card info-card">
          <Planet3D :body-id="body.id" class="planet-3d-view" />

          <div class="gallery-header">
            <p class="eyebrow">Galería NASA</p>
            <h3>Imágenes de {{ body.name }}</h3>
          </div>
          <div v-if="imageLoading" class="gallery-grid">
            <SkeletonLoader v-for="n in 4" :key="n" height="110px" radius="12px" />
          </div>
          <p v-else-if="imageError" class="status">{{ imageError }}</p>
          <div v-else-if="images.length" class="gallery-grid">
            <button
              v-for="(img, idx) in images"
              :key="img + idx"
              type="button"
              class="gallery-item"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`${body.name} ${idx + 1}`" loading="lazy">
            </button>
          </div>

          <dl class="facts">
            <div><dt>Gravedad</dt><dd>{{ body.gravity }} m/s²</dd></div>
            <div><dt>Duración del día</dt><dd>{{ body.dayLength }}</dd></div>
            <div><dt>Duración del año</dt><dd>{{ body.yearLength }}</dd></div>
          </dl>
          <p class="fun-fact"><strong>Dato curioso:</strong> {{ body.funFact }}</p>
        </section>

        <section v-reveal class="card calc-card">
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

    <ImageLightbox
      v-if="selectedImage && body"
      :src="selectedImage"
      :alt="body.name"
      @close="selectedImage = null"
    />
  </div>
</template>

<style scoped lang="scss">
.detail { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.back-link { display: inline-flex; min-height: 44px; align-items: center; color: #7dd3fc; text-decoration: none; font-weight: 600; margin-bottom: 8px; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.82); line-height: 1.6; }
.favorite-btn { margin-top: 14px; min-height: 44px; border-radius: 12px; border: 1px solid rgba(251,191,36,0.35); background: rgba(251,191,36,0.12); color: #fde68a; font-weight: 600; padding: 10px 14px; cursor: pointer; }
.detail-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 900px) { .detail-grid { grid-template-columns: 1.2fr 1fr; align-items: start; } }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); animation: fade-up 0.5s ease both; }
.planet-3d-view { margin-bottom: 16px; }
.gallery-header { margin-bottom: 12px; }
.gallery-header .eyebrow { font-size: 0.72rem; }
.gallery-header h3 { margin: 4px 0 0; font-size: 1.05rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
@media (min-width: 520px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); } }
.gallery-item { padding: 0; border: 0; background: none; border-radius: 12px; overflow: hidden; cursor: pointer; min-height: 44px; }
.gallery-item img { width: 100%; height: 110px; object-fit: cover; display: block; transition: transform .25s ease, filter .25s ease; }
.gallery-item:hover img { transform: scale(1.04); filter: brightness(1.05); }
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
