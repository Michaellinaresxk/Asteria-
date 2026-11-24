<script setup lang="ts">
import { AdditiveBlending, DoubleSide } from 'three';
import { TresCanvas } from '@tresjs/core';
import { Stars } from '@tresjs/cientos';

import { JOURNEY_BODIES } from '../data/journeyBodies';
import type { JourneyPose } from '../utils/journey';

defineProps<{
  pose: JourneyPose;
  progress: number;
}>();
</script>

<template>
  <div class="journey-scene" :style="{ '--journey-progress': progress }" aria-hidden="true">
    <div class="journey-nebula" />
    <TresCanvas :alpha="true" clear-color="#030716" :clear-alpha="0" :dpr="[1, 1.5]" :antialias="true">
      <TresPerspectiveCamera :fov="60" :position="pose.position" :look-at="pose.target" />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[8, 6, 10]" :intensity="1.4" color="#ffffff" />
      <TresPointLight :position="[0, 0, 0]" :intensity="9" :distance="45" :decay="2" color="#ffb45e" />

      <Stars :radius="120" :depth="60" :count="2600" :size="0.42" :factor="4" :fade="true" />

      <template v-for="body in JOURNEY_BODIES" :key="body.id">
        <TresMesh :position="body.position">
          <TresSphereGeometry :args="[body.radius, 32, 32]" />
          <TresMeshStandardMaterial
            :color="body.color"
            :emissive="body.emissive"
            :emissive-intensity="body.id === 'sun' ? 0.9 : 0.35"
            :roughness="0.9"
            :metalness="0.02"
          />
        </TresMesh>

        <TresMesh v-if="body.id === 'sun'" :position="body.position" :scale="[1.25, 1.25, 1.25]">
          <TresSphereGeometry :args="[body.radius, 24, 24]" />
          <TresMeshBasicMaterial
            color="#ffca70"
            :transparent="true"
            :opacity="0.12"
            :blending="AdditiveBlending"
            :depth-write="false"
          />
        </TresMesh>
        <TresMesh v-if="body.id === 'sun'" :position="body.position" :scale="[1.55, 1.55, 1.55]">
          <TresSphereGeometry :args="[body.radius, 24, 24]" />
          <TresMeshBasicMaterial
            color="#ff9d3d"
            :transparent="true"
            :opacity="0.06"
            :blending="AdditiveBlending"
            :depth-write="false"
          />
        </TresMesh>

        <TresMesh v-if="body.ring" :position="body.position" :rotation="[1.2, 0, 0.3]">
          <TresRingGeometry :args="[body.radius * 1.5, body.radius * 2.4, 96]" />
          <TresMeshBasicMaterial color="#d8c48a" :transparent="true" :opacity="0.5" :side="DoubleSide" />
        </TresMesh>
      </template>
    </TresCanvas>
  </div>
</template>

<style scoped lang="scss">
.journey-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: radial-gradient(circle at 50% 40%, #0c1a38 0%, #050b1c 55%, #02050f 100%);
}

.journey-nebula {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(ellipse at 18% 26%, rgba(125, 211, 252, 0.16), transparent 42%),
    radial-gradient(ellipse at 84% 62%, rgba(167, 139, 250, 0.14), transparent 45%),
    radial-gradient(ellipse at 42% 88%, rgba(56, 189, 248, 0.1), transparent 40%);
  transform: translate3d(calc(var(--journey-progress, 0) * -6%), 0, 0) scale(1.1);
  transition: transform 0.25s linear;
}

@media (prefers-reduced-motion: reduce) {
  .journey-nebula { transition: none; transform: none; }
}
</style>
