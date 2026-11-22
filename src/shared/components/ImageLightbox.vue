<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{
  src: string;
  alt: string;
}>();

const emit = defineEmits<{ close: [] }>();

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div class="lightbox" role="dialog" aria-modal="true" @click.self="emit('close')">
    <button class="close-btn" type="button" aria-label="Cerrar" @click="emit('close')">×</button>
    <img :src="src" :alt="alt" class="lightbox-image">
  </div>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 24px;
}
.lightbox-image {
  max-width: min(100%, 1000px);
  max-height: 85vh;
  width: auto;
  height: auto;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}
</style>
