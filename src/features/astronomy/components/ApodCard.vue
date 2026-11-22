<script setup lang="ts">
import { onMounted, ref } from 'vue';

import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getAstronomyPictureOfDay } from '@/shared/services/apod';
import type { ApodResponse } from '@/shared/types/astronomy';

const apod = ref<ApodResponse | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    apod.value = await getAstronomyPictureOfDay();
  } catch {
    error.value = 'No se pudo cargar la foto astronómica del día.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <article class="card apod-card">
    <p class="eyebrow">NASA APOD</p>
    <h2>Foto astronómica del día</h2>

    <div v-if="loading" class="loading-block" aria-label="Cargando">
      <SkeletonLoader height="220px" radius="14px" />
      <SkeletonLoader width="70%" height="20px" />
      <SkeletonLoader height="14px" />
      <SkeletonLoader height="14px" />
      <SkeletonLoader width="90%" height="14px" />
    </div>
    <p v-else-if="error" class="status">{{ error }}</p>

    <template v-else-if="apod">
      <img
        v-if="apod.media_type === 'image'"
        :src="apod.url"
        :alt="apod.title"
        class="apod-image"
        loading="lazy"
      >
      <a v-else :href="apod.url" target="_blank" rel="noopener noreferrer" class="video-link">
        Ver contenido del día
      </a>

      <h3 class="apod-title">{{ apod.title }}</h3>
      <p class="apod-explanation">{{ apod.explanation }}</p>
      <p v-if="apod.copyright" class="apod-credit">© {{ apod.copyright }}</p>
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
  text-align: left;
  animation: fade-up 0.5s ease both;
}

.eyebrow {
  margin: 0;
  color: #7dd3fc;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 6px 0 16px;
  font-size: clamp(1.3rem, 4vw, 1.8rem);
}

.apod-image {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 14px;
}

.apod-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.apod-explanation {
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  color: rgba(245, 247, 255, 0.9);
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.apod-credit,
.status {
  color: rgba(245, 247, 255, 0.72);
  font-size: 0.85rem;
}

.video-link {
  display: inline-block;
  margin-bottom: 12px;
  color: #7dd3fc;
}

.loading-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
