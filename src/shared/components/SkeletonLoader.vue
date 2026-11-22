<script setup lang="ts">
withDefaults(defineProps<{
  width?: string;
  height?: string;
  radius?: string;
}>(), {
  width: '100%',
  height: '16px',
  radius: '10px',
});
</script>

<template>
  <div class="skeleton" :style="{ width, height, borderRadius: radius }" aria-hidden="true" />
</template>

<style scoped lang="scss">
.skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
</style>
