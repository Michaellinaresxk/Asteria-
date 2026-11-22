<script setup lang="ts">
import { computed } from 'vue';

import { getMoonPhase } from '../utils/moonPhase';

const moon = computed(() => getMoonPhase(new Date()));
</script>

<template>
  <article class="card moon-card">
    <p class="eyebrow">Luna de hoy</p>
    <div class="moon-header">
      <span class="moon-emoji" aria-hidden="true">{{ moon.emoji }}</span>
      <div>
        <h2>{{ moon.phase }}</h2>
        <p class="illumination">{{ moon.illumination }}% iluminada</p>
      </div>
    </div>
    <p class="description">{{ moon.description }}</p>
    <div class="illumination-bar" role="progressbar" :aria-valuenow="moon.illumination" aria-valuemin="0" aria-valuemax="100">
      <div class="illumination-fill" :style="{ width: `${moon.illumination}%` }" />
    </div>
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
  animation: fade-up 0.5s ease 0.1s both;
}

.eyebrow {
  margin: 0;
  color: #c4b5fd;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.moon-header {
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 10px 0;
}

.moon-emoji {
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 0 12px rgba(196, 181, 253, 0.5));
}

h2 {
  margin: 0;
  font-size: clamp(1.2rem, 4vw, 1.6rem);
}

.illumination,
.description {
  margin: 4px 0 0;
  color: rgba(245, 247, 255, 0.85);
}

.description { margin-top: 12px; line-height: 1.5; }

.illumination-bar {
  margin-top: 16px;
  height: 10px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.illumination-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #7dd3fc);
  border-radius: 999px;
  transition: width 0.8s ease;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
