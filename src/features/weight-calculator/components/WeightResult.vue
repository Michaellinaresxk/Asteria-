<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { searchPlanetImages } from '@/shared/services/nasa';

const props = defineProps<{
  planetChosen: string;
}>();

const results = ref<Array<{ links?: Array<{ href: string }> }>>([]);
const loading = ref(false);
const error = ref('');

const randomIndex = computed(() => {
  if (results.value.length === 0) return 0;
  return Math.floor(Math.random() * results.value.length);
});

const planetPicture = computed(() => {
  const item = results.value[randomIndex.value];
  return item?.links?.[0]?.href ?? '';
});

async function loadImage(planet: string) {
  if (!planet) return;
  loading.value = true;
  error.value = '';
  try {
    results.value = await searchPlanetImages(planet);
  } catch {
    error.value = 'Could not load planet image.';
    results.value = [];
  } finally {
    loading.value = false;
  }
}

watch(() => props.planetChosen, (planet) => {
  void loadImage(planet);
}, { immediate: true });
</script>

<template>
  <div class="result">
    <h2><slot /></h2>
    <p v-if="loading" class="status">Loading image...</p>
    <p v-else-if="error" class="status">{{ error }}</p>
    <img v-else-if="planetPicture" :src="planetPicture" :alt="`${planetChosen} image`">
  </div>
</template>

<style scoped lang="scss">
.result {
  margin-top: 20px;
  color: #fff;

  h2 {
    font-size: clamp(1.4rem, 5vw, 2.1rem);
  }
}

.status {
  font-size: 1rem;
}

img {
  width: min(100%, 300px);
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
