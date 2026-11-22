<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="hero-title">
    <h1>{{ title }}</h1>
  </header>
</template>

<style scoped lang="scss">
.hero-title h1 {
  color: #fff;
  margin-top: -10px;
  font-size: clamp(1.8rem, 7vw, 3rem);
}
</style>
