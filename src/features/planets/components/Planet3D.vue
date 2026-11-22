<script setup lang="ts">
import { computed } from 'vue';
import { DoubleSide } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Stars } from '@tresjs/cientos';

import { PLANET_VISUALS } from '../data/planetVisuals';

const props = defineProps<{
  bodyId: string;
}>();

const visual = computed(() => PLANET_VISUALS[props.bodyId] ?? {
  color: '#7dd3fc',
  emissive: '#1a3a4a',
  atmosphere: '#b8e8f5',
});
</script>

<template>
  <div class="planet-3d">
    <TresCanvas clear-color="#050a19" alpha>
      <TresPerspectiveCamera :position="[0, 0, 4.5]" :look-at="[0, 0, 0]" />
      <OrbitControls :enable-zoom="false" :auto-rotate="true" :auto-rotate-speed="1.2" />

      <TresAmbientLight :intensity="0.45" />
      <TresDirectionalLight :position="[5, 3, 5]" :intensity="2.2" />
      <TresPointLight :position="[-4, -2, -4]" :intensity="0.4" :color="visual.atmosphere" />

      <Stars :radius="80" :depth="40" :count="2000" :size="0.3" />

      <TresMesh>
        <TresSphereGeometry :args="[1.35, 64, 64]" />
        <TresMeshStandardMaterial
          :color="visual.color"
          :emissive="visual.emissive"
          :emissive-intensity="0.25"
          :roughness="0.65"
          :metalness="0.1"
        />
      </TresMesh>

      <TresMesh :scale="[1.08, 1.08, 1.08]">
        <TresSphereGeometry :args="[1.35, 32, 32]" />
        <TresMeshBasicMaterial :color="visual.atmosphere" :transparent="true" :opacity="0.08" />
      </TresMesh>

      <TresMesh v-if="visual.ring" :rotation="[1.2, 0, 0]">
        <TresRingGeometry :args="[1.8, 2.6, 64]" />
        <TresMeshStandardMaterial color="#d8c48a" :transparent="true" :opacity="0.55" :side="DoubleSide" />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<style scoped lang="scss">
.planet-3d {
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(125,211,252,0.08), rgba(5,10,25,0.2));
}
@media (min-width: 768px) {
  .planet-3d { height: 380px; }
}
</style>
