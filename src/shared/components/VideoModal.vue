<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{
  title: string;
  src: string;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{ close: [] }>();

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div class="video-modal" role="dialog" aria-modal="true" :aria-label="title" @click.self="emit('close')">
    <div class="panel">
      <div class="panel-head">
        <h2>{{ title }}</h2>
        <button class="close-btn" type="button" aria-label="Cerrar vídeo" @click="emit('close')">×</button>
      </div>
      <p v-if="loading" class="status" role="status">Cargando vídeo…</p>
      <p v-else-if="error" class="status error" role="alert">{{ error }}</p>
      <video v-else-if="src" :src="src" controls autoplay playsinline class="player" />
      <p v-else class="status">Este vídeo no está disponible.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-modal { position: fixed; inset: 0; z-index: 110; background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 16px; }
.panel { width: min(100%, 900px); background: rgba(10, 18, 40, 0.95); border: 1px solid rgba(255,255,255,0.14); border-radius: 16px; padding: 16px; }
.panel-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
h2 { margin: 0 0 12px; font-size: 1rem; color: #f5f7ff; }
.close-btn { width: 44px; height: 44px; flex: 0 0 auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); color: #fff; font-size: 1.6rem; line-height: 1; cursor: pointer; }
.player { display: block; width: 100%; max-height: 75vh; border-radius: 10px; background: #000; }
.status { color: rgba(245,247,255,0.82); }
.error { color: #fca5a5; }
</style>
