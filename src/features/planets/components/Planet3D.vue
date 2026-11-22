<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { DoubleSide, SRGBColorSpace, TextureLoader, type Texture } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Stars } from '@tresjs/cientos';

import { PLANET_VISUALS } from '../data/planetVisuals';

const props = defineProps<{
  bodyId: string;
}>();

const texture = ref<Texture | null>(null);
const ringTexture = ref<Texture | null>(null);

const visual = computed(() => PLANET_VISUALS[props.bodyId] ?? {
  color: '#7dd3fc',
  emissive: '#1a3a4a',
  atmosphere: '#b8e8f5',
  texture: '',
});

function loadTextures() {
  texture.value = null;
  ringTexture.value = null;
  const loader = new TextureLoader();
  loader.setCrossOrigin('anonymous');

  if (visual.value.texture) {
    loader.load(
      visual.value.texture,
      (tex) => { tex.colorSpace = SRGBColorSpace; texture.value = tex; },
      undefined,
      () => { texture.value = null; },
    );
  }

  if (visual.value.ringTexture) {
    loader.load(
      visual.value.ringTexture,
      (tex) => { tex.colorSpace = SRGBColorSpace; ringTexture.value = tex; },
      undefined,
      () => { ringTexture.value = null; },
    );
  }
}

onMounted(loadTextures);
watch(() => props.bodyId, loadTextures);
</script>

<template>
  <div class="planet-3d">
    <TresCanvas clear-color="#050a19" alpha>
      <TresPerspectiveCamera :position="[0, 0, 4.5]" :look-at="[0, 0, 0]" />
      <OrbitControls :enable-zoom="false" :auto-rotate="true" :auto-rotate-speed="0.8" :enable-pan="false" />

      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight :position="[5, 3, 5]" :intensity="2.8" color="#ffffff" />
      <TresPointLight :position="[-5, -2, -4]" :intensity="0.5" :color="visual.atmosphere" />

      <Stars :radius="80" :depth="40" :count="1800" :size="0.35" />

      <TresMesh>
        <TresSphereGeometry :args="[1.35, 64, 64]" />
        <TresMeshStandardMaterial
          :map="texture || undefined"
          :color="texture ? '#ffffff' : visual.color"
          :emissive="visual.emissive"
          :emissive-intensity="texture ? 0.05 : 0.25"
          :roughness="0.8"
          :metalness="0.05"
        />
      </TresMesh>

      <TresMesh :scale="[1.03, 1.03, 1.03]">
        <TresSphereGeometry :args="[1.35, 32, 32]" />
        <TresMeshBasicMaterial :color="visual.atmosphere" :transparent="true" :opacity="0.07" />
      </TresMesh>

      <TresMesh v-if="visual.ring" :rotation="[1.2, 0, 0]">
        <TresRingGeometry :args="[1.75, 2.7, 128]" />
        <TresMeshStandardMaterial
          :map="ringTexture || undefined"
          :color="ringTexture ? '#ffffff' : '#d8c48a'"
          :transparent="true"
          :opacity="ringTexture ? 0.9 : 0.55"
          :side="DoubleSide"
        />
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
  background: radial-gradient(circle at center, rgba(125,211,252,0.08), rgba(5,10,25,0.35));
}
@media (min-width: 768px) {
  .planet-3d { height: 380px; }
}
</style>
