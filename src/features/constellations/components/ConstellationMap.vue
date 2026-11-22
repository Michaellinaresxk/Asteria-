<script setup lang="ts">
import { ref } from 'vue';

import type { Constellation } from '../data/constellations';

defineProps<{
  constellation: Constellation;
  active?: boolean;
}>();

const hovered = ref<number | null>(null);
const filterId = `glow-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div class="constellation-map" :class="{ active }">
    <svg viewBox="0 0 100 100" role="img" :aria-label="`Mapa de la constelación ${constellation.name}`">
      <defs>
        <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g class="lines">
        <line
          v-for="(line, idx) in constellation.lines"
          :key="idx"
          :x1="constellation.stars[line[0]].x"
          :y1="constellation.stars[line[0]].y"
          :x2="constellation.stars[line[1]].x"
          :y2="constellation.stars[line[1]].y"
        />
      </g>

      <g v-for="(star, idx) in constellation.stars" :key="idx" class="star-group"
         @mouseenter="hovered = idx" @mouseleave="hovered = null" @click="hovered = hovered === idx ? null : idx">
        <circle class="star-glow" :cx="star.x" :cy="star.y" :r="(star.size ?? 2.5) * 2.2" />
        <circle class="star" :cx="star.x" :cy="star.y" :r="(star.size ?? 2.5) / 2.2" :filter="`url(#${filterId})`" />
        <text v-if="star.label && (hovered === idx || active)" :x="star.x" :y="star.y - 4" class="star-label">{{ star.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.constellation-map {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  background: radial-gradient(circle at 30% 20%, rgba(125,211,252,0.12), rgba(5,10,25,0.2) 60%);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
}
svg { width: 100%; height: 100%; display: block; }
.lines line {
  stroke: rgba(125, 211, 252, 0.45);
  stroke-width: 0.6;
  stroke-linecap: round;
}
.star-glow {
  fill: rgba(125, 211, 252, 0.18);
  transition: fill 0.2s ease;
}
.star {
  fill: #f8fafc;
}
.star-group { cursor: pointer; }
.star-group:hover .star-glow { fill: rgba(125, 211, 252, 0.35); }
.star-label {
  fill: #e0f2fe;
  font-size: 3px;
  text-anchor: middle;
  font-family: inherit;
  pointer-events: none;
}
.active .lines line { stroke: rgba(125, 211, 252, 0.7); }
@media (prefers-reduced-motion: reduce) {
  .star-glow { transition: none; }
}
</style>
