<script setup lang="ts">
import { onMounted, ref } from 'vue';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getEpicImages, type EpicImage } from '@/shared/services/epic';

const image = ref<EpicImage | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    image.value = (await getEpicImages(1))[0] ?? null;
  } catch {
    error.value = 'No se pudo cargar la imagen de la Tierra.';
  } finally {
    loading.value = false;
  }
});

function formatDate(date: string): string {
  return new Date(date.replace(' ', 'T') + 'Z').toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <article class="card earth-card">
    <p class="eyebrow">EPIC · DSCOVR</p>
    <h2>La Tierra hoy</h2>

    <div v-if="loading" class="loading-block" aria-label="Cargando">
      <SkeletonLoader height="200px" radius="14px" />
      <SkeletonLoader width="65%" height="16px" />
      <SkeletonLoader width="45%" height="14px" />
    </div>
    <p v-else-if="error" class="status">{{ error }}</p>
    <p v-else-if="!image" class="status">No hay imágenes recientes disponibles.</p>

    <template v-else>
      <img :src="image.imageUrl" :alt="image.caption" class="earth-image" loading="lazy">
      <p class="earth-date">{{ formatDate(image.date) }}</p>
      <p class="earth-coords">Centro: {{ image.lat.toFixed(1) }}°, {{ image.lon.toFixed(1) }}°</p>
      <RouterLink class="gallery-link" to="/fotos">Ver más imágenes →</RouterLink>
    </template>
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
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
h2 { margin: 6px 0 16px; font-size: clamp(1.3rem, 4vw, 1.8rem); }
.earth-image { display: block; width: 100%; max-height: 260px; object-fit: cover; border-radius: 14px; margin-bottom: 12px; }
.earth-date { margin: 0; font-weight: 600; text-transform: capitalize; }
.earth-coords, .status { margin: 6px 0 0; color: rgba(245, 247, 255, 0.72); font-size: 0.88rem; }
.gallery-link { display: inline-block; margin-top: 12px; min-height: 44px; line-height: 44px; color: #7dd3fc; font-weight: 600; }
.loading-block { display: flex; flex-direction: column; gap: 10px; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .card { animation: none; } }
</style>
