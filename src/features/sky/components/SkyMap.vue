<script setup lang="ts">
import { computed } from 'vue';

import { PLANET_VISUALS } from '@/features/planets/data/planetVisuals';
import type { VisiblePlanet } from '@/shared/types/sky';

import { planetLabel } from '../utils/labels';

const props = defineProps<{
  planets: VisiblePlanet[];
  selected?: string;
}>();

const emit = defineEmits<{ select: [name: string] }>();

const CENTER = 160;
const RADIUS = 140;

interface PlottedPlanet {
  name: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  texture?: string;
  altitude: number;
}

const plotted = computed<PlottedPlanet[]>(() =>
  props.planets
    .filter((planet) => planet.altitude > 0)
    .map((planet) => {
      const distance = ((90 - Math.min(planet.altitude, 90)) / 90) * RADIUS;
      const angle = (planet.azimuth * Math.PI) / 180;
      const visual = PLANET_VISUALS[planet.name.toLowerCase()];

      return {
        name: planet.name,
        label: planetLabel(planet.name),
        x: CENTER + distance * Math.sin(angle),
        y: CENTER - distance * Math.cos(angle),
        size: Math.max(5, Math.min(13, 8 - planet.magnitude * 1.2)),
        color: visual?.color ?? '#e2e8f0',
        texture: visual?.texture,
        altitude: planet.altitude,
      };
    })
    .sort((a, b) => b.altitude - a.altitude),
);

const stars = (() => {
  let seed = 42;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: 80 }, () => {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * 134;
    return {
      x: CENTER + distance * Math.cos(angle),
      y: CENTER + distance * Math.sin(angle),
      size: 0.5 + random() * 1.4,
      delay: `${(random() * 4).toFixed(2)}s`,
    };
  });
})();
</script>

<template>
  <div class="sky-map">
    <svg viewBox="0 0 320 320" role="img" aria-label="Mapa del cielo con los planetas sobre el horizonte">
      <defs>
        <radialGradient id="sky-gradient" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#152554" />
          <stop offset="65%" stop-color="#0a1330" />
          <stop offset="100%" stop-color="#050b1c" />
        </radialGradient>
        <filter id="planet-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath v-for="(planet, index) in plotted" :id="`planet-clip-${index}`" :key="planet.name">
          <circle :cx="planet.x" :cy="planet.y" :r="planet.size" />
        </clipPath>
      </defs>

      <circle :cx="CENTER" :cy="CENTER" r="150" fill="url(#sky-gradient)" />
      <circle
        v-for="star in stars"
        :key="`${star.x}-${star.y}`"
        class="star"
        :cx="star.x"
        :cy="star.y"
        :r="star.size"
        :style="{ animationDelay: star.delay }"
      />

      <circle class="guide" :cx="CENTER" :cy="CENTER" :r="RADIUS" />
      <circle class="guide guide-inner" :cx="CENTER" :cy="CENTER" :r="RADIUS / 3" />
      <circle class="guide guide-inner" :cx="CENTER" :cy="CENTER" :r="(RADIUS * 2) / 3" />

      <text class="compass" x="160" y="22" text-anchor="middle">N</text>
      <text class="compass" x="300" y="165" text-anchor="middle">E</text>
      <text class="compass" x="160" y="312" text-anchor="middle">S</text>
      <text class="compass" x="20" y="165" text-anchor="middle">O</text>

      <g
        v-for="(planet, index) in plotted"
        :key="planet.name"
        class="planet"
        :class="{ selected: selected === planet.name }"
        role="button"
        tabindex="0"
        :aria-label="`Ver datos de ${planet.label}`"
        @click="emit('select', planet.name)"
        @keydown.enter="emit('select', planet.name)"
        @keydown.space.prevent="emit('select', planet.name)"
      >
        <circle class="glow" :cx="planet.x" :cy="planet.y" :r="planet.size + 4" :fill="planet.color" filter="url(#planet-glow)" />
        <circle class="selection" :cx="planet.x" :cy="planet.y" :r="planet.size + 7" />
        <image
          v-if="planet.texture"
          :href="planet.texture"
          :x="planet.x - planet.size"
          :y="planet.y - planet.size"
          :width="planet.size * 2"
          :height="planet.size * 2"
          preserveAspectRatio="xMidYMid slice"
          :clip-path="`url(#planet-clip-${index})`"
        />
        <circle v-else :cx="planet.x" :cy="planet.y" :r="planet.size" :fill="planet.color" />
        <text class="planet-label" :x="planet.x" :y="planet.y - planet.size - 7" text-anchor="middle">{{ planet.label }}</text>
      </g>
    </svg>

    <p v-if="!plotted.length" class="empty">No hay objetos sobre el horizonte en este momento.</p>
    <p v-else class="legend">Toca un astro en el mapa para ver sus datos · círculos = 30° y 60° de altitud</p>
  </div>
</template>

<style scoped lang="scss">
.sky-map { width: 100%; max-width: 460px; margin: 0 auto; }
svg { display: block; width: 100%; height: auto; }
.star { fill: #fff; animation: twinkle 3.2s ease-in-out infinite; }
.guide { fill: none; stroke: rgba(125, 211, 252, 0.16); stroke-width: 1; }
.guide-inner { stroke-dasharray: 3 6; }
.compass { fill: rgba(245, 247, 255, 0.7); font-size: 11px; font-weight: 700; }
.planet { cursor: pointer; }
.glow { opacity: 0.35; animation: pulse 3s ease-in-out infinite; }
.selection { fill: none; stroke: #7dd3fc; stroke-width: 1.5; opacity: 0; }
.planet.selected .selection { opacity: 1; }
.planet-label { fill: #f5f7ff; font-size: 11px; font-weight: 700; paint-order: stroke; stroke: rgba(5, 11, 28, 0.9); stroke-width: 3px; }
.legend, .empty { margin: 8px 0 0; text-align: center; font-size: 0.8rem; color: rgba(245, 247, 255, 0.7); }
@keyframes twinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }
@keyframes pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) { .star, .glow { animation: none; } }
</style>
