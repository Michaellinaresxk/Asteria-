<script setup lang="ts">
import GravityCalculator from '@/features/weight-calculator/components/GravityCalculator.vue';
import HeroTitle from '@/features/weight-calculator/components/HeroTitle.vue';
</script>

<template>
  <div class="home-view">
    <HeroTitle title="Your weight on space" />
    <GravityCalculator />
  </div>
</template>
