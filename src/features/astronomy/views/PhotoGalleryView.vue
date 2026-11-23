<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import ImageLightbox from '@/shared/components/ImageLightbox.vue';
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue';
import { getApodArchive } from '@/shared/services/apodArchive';
import { searchCommonsImages } from '@/shared/services/commonsImages';
import { getEpicImages } from '@/shared/services/epic';
import { addDays, toIsoDate } from '@/shared/utils/dates';

interface GalleryItem {
  id: string;
  title: string;
  thumb: string;
  full: string;
  caption: string;
  credit: string;
}

type Source = 'apod' | 'epic' | 'commons';

const sources: Array<{ value: Source; label: string }> = [
  { value: 'apod', label: 'NASA · APOD' },
  { value: 'epic', label: 'Tierra · EPIC' },
  { value: 'commons', label: 'Wikimedia Commons' },
];

const topics = [
  { label: 'Nebulosas', query: 'emission nebula astronomy' },
  { label: 'Galaxias', query: 'spiral galaxy astronomy' },
  { label: 'Planetas', query: 'planet telescope astronomy' },
  { label: 'Auroras', query: 'aurora borealis' },
  { label: 'Cometas', query: 'comet astronomy' },
  { label: 'La Luna', query: 'Moon telescope phase' },
];

const source = ref<Source>('apod');
const activeTopic = ref(topics[0]!.query);
const apodItems = ref<GalleryItem[]>([]);
const epicItems = ref<GalleryItem[]>([]);
const commonsItems = ref<GalleryItem[]>([]);
const loading = ref(false);
const error = ref('');
const lightbox = ref<GalleryItem | null>(null);

const items = computed(() => {
  if (source.value === 'epic') return epicItems.value;
  return source.value === 'apod' ? apodItems.value : commonsItems.value;
});

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';

  try {
    if (source.value === 'apod') {
      const today = new Date();
      const entries = await getApodArchive(toIsoDate(addDays(today, -7)), toIsoDate(today));
      apodItems.value = entries.map((entry) => ({
        id: entry.date,
        title: entry.title,
        thumb: entry.url,
        full: entry.hdurl ?? entry.url,
        caption: entry.explanation,
        credit: entry.copyright ? `© ${entry.copyright}` : 'NASA APOD',
      }));
    } else if (source.value === 'epic') {
      const images = await getEpicImages(8);
      epicItems.value = images.map((image) => ({
        id: image.id,
        title: `La Tierra · ${image.date.slice(0, 10)}`,
        thumb: image.imageUrl,
        full: image.imageUrl,
        caption: `${image.caption} Centro: ${image.lat.toFixed(1)}°, ${image.lon.toFixed(1)}°`,
        credit: 'NASA · EPIC / DSCOVR',
      }));
    } else {
      const images = await searchCommonsImages(activeTopic.value);
      commonsItems.value = images.map((image) => ({
        id: image.id,
        title: image.title,
        thumb: image.thumbUrl,
        full: image.imageUrl,
        caption: image.license ? `Licencia: ${image.license}` : 'Imagen de Wikimedia Commons',
        credit: image.pageUrl,
      }));
    }
  } catch {
    error.value = 'No se pudieron cargar las fotografías. Revisa tu conexión e inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function setSource(next: Source): void {
  if (source.value === next) return;
  source.value = next;
  load();
}

function setTopic(query: string): void {
  if (activeTopic.value === query) return;
  activeTopic.value = query;
  if (source.value === 'commons') load();
}
</script>

<template>
  <div class="gallery-view">
    <header class="hero">
      <p class="eyebrow">Galería</p>
      <h1>Fotos del universo</h1>
      <p class="subtitle">Imágenes reales de la NASA y de Wikimedia Commons. Toca una foto para ampliarla.</p>
    </header>

    <div class="tabs" role="tablist" aria-label="Fuente de las fotos">
      <button
        v-for="option in sources"
        :key="option.value"
        class="tab"
        :class="{ active: source === option.value }"
        type="button"
        role="tab"
        :aria-selected="source === option.value"
        @click="setSource(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="source === 'commons'" class="topics" aria-label="Temas">
      <button
        v-for="topic in topics"
        :key="topic.query"
        class="topic-chip"
        :class="{ active: activeTopic === topic.query }"
        type="button"
        @click="setTopic(topic.query)"
      >
        {{ topic.label }}
      </button>
    </div>

    <p v-if="loading" class="status" role="status">Cargando fotografías…</p>

    <div v-if="loading" class="photo-grid" aria-hidden="true">
      <SkeletonLoader v-for="n in 6" :key="n" height="260px" radius="16px" />
    </div>

    <div v-else-if="error" class="message" role="alert">
      <p>{{ error }}</p>
      <button class="action-btn" type="button" @click="load">Reintentar</button>
    </div>

    <div v-else-if="items.length" class="photo-grid">
      <article v-for="item in items" :key="item.id" class="photo-card">
        <button class="photo-button" type="button" :aria-label="`Ampliar ${item.title}`" @click="lightbox = item">
          <img :src="item.thumb" :alt="item.title" loading="lazy">
        </button>
        <div class="photo-info">
          <h2>{{ item.title }}</h2>
          <p class="caption">{{ item.caption }}</p>
          <p v-if="source === 'commons' && item.credit" class="credit">
            <a :href="item.credit" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons ↗</a>
          </p>
          <p v-else class="credit">{{ item.credit }}</p>
        </div>
      </article>
    </div>

    <p v-else class="message">No se encontraron fotografías para esta selección.</p>

    <ImageLightbox
      v-if="lightbox"
      :src="lightbox.full"
      :alt="lightbox.title"
      @close="lightbox = null"
    />
  </div>
</template>

<style scoped lang="scss">
.gallery-view { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 20px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }

.tabs, .topics { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px; -webkit-overflow-scrolling: touch; }
.tab, .topic-chip { flex: 0 0 auto; min-height: 44px; padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; font-weight: 600; cursor: pointer; }
.tab.active, .topic-chip.active { background: rgba(125,211,252,0.18); color: #7dd3fc; border-color: rgba(125,211,252,0.35); }

.photo-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.photo-card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px); animation: fade-up 0.4s ease both; }
.photo-button { display: block; width: 100%; padding: 0; border: 0; background: none; cursor: zoom-in; }
.photo-button img { display: block; width: 100%; height: 220px; object-fit: cover; }
.photo-info { padding: 14px; }
.photo-info h2 { margin: 0 0 6px; font-size: 1rem; }
.caption { margin: 0; color: rgba(245,247,255,0.8); line-height: 1.5; font-size: 0.88rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.credit { margin: 8px 0 0; font-size: 0.78rem; color: #7dd3fc; }
.credit a { color: inherit; }
.status, .message { color: rgba(245,247,255,0.8); }
.message { padding: 24px; border: 1px dashed rgba(255,255,255,0.18); border-radius: 16px; text-align: center; }
.action-btn { min-height: 44px; padding: 10px 16px; border-radius: 12px; border: 0; background: #7dd3fc; color: #082f49; font-weight: 700; cursor: pointer; }

@media (min-width: 640px) { .photo-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .photo-grid { grid-template-columns: repeat(3, 1fr); } }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .photo-card { animation: none; } }
</style>
