<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { AdditiveBlending, BufferGeometry, DoubleSide, Object3D, Vector3 } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Stars } from '@tresjs/cientos';

import { getBodyColor, SOLAR_SYSTEM_BODIES, SUN_VISUAL } from '../data/solarSystem';
import { useSolarSystemTextures } from '../composables/useSolarSystemTextures';
import { getOrbitRingPoints } from '../utils/orbits';
import OrbitalMotion from './OrbitalMotion.vue';

const props = defineProps<{
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

const { textures } = useSolarSystemTextures();
const meshes = new Map<string, Object3D>();
const MAX_POLAR_ANGLE = Math.PI / 2.05;

const orbitRings = SOLAR_SYSTEM_BODIES
  .filter((item) => !item.parent)
  .map((item) => ({
    id: item.id,
    geometry: new BufferGeometry().setFromPoints(
      getOrbitRingPoints(item.orbitRadius, item.inclination).map((point) => new Vector3(...point)),
    ),
  }));

onUnmounted(() => {
  orbitRings.forEach((orbit) => orbit.geometry.dispose());
});

function setMeshRef(id: string, element: unknown): void {
  if (element && typeof element === 'object' && 'position' in element) {
    meshes.set(id, element as Object3D);
  } else {
    meshes.delete(id);
  }
}

function bodyTexture(id: string) {
  return textures.value[id] ?? undefined;
}

const selectedName = computed(() =>
  [...SOLAR_SYSTEM_BODIES, SUN_VISUAL].find((item) => item.id === props.selectedId)?.name ?? '');
</script>

<template>
  <div class="solar-system">
    <TresCanvas :alpha="true" clear-color="#040a1c" :clear-alpha="0" :dpr="[1, 1.5]" :antialias="true">
      <TresPerspectiveCamera :position="[0, 13, 21]" :look-at="[0, 0, 0]" :fov="55" />
      <OrbitControls
        :enable-damping="true"
        :enable-pan="false"
        :min-distance="6"
        :max-distance="45"
        :max-polar-angle="MAX_POLAR_ANGLE"
      />
      <Stars :radius="90" :depth="45" :count="2000" :size="0.35" :factor="4" :fade="true" />
      <OrbitalMotion :meshes="meshes" />

      <TresAmbientLight :intensity="0.35" />
      <TresPointLight :position="[0, 0, 0]" :intensity="14" :distance="60" :decay="2" color="#ffd9a0" />

      <TresLine v-for="orbit in orbitRings" :key="orbit.id" :geometry="orbit.geometry">
        <TresLineBasicMaterial color="#9fb6d9" :transparent="true" :opacity="0.22" />
      </TresLine>

      <TresMesh :position="[0, 0, 0]" @click="emit('select', 'sun')">
        <TresSphereGeometry :args="[SUN_VISUAL.size, 48, 48]" />
        <TresMeshStandardMaterial
          :map="bodyTexture('sun')"
          :color="bodyTexture('sun') ? '#ffffff' : SUN_VISUAL.color"
          :emissive="SUN_VISUAL.emissive"
          :emissive-intensity="0.85"
        />
        <TresMesh :scale="[1.35, 1.35, 1.35]">
          <TresSphereGeometry :args="[SUN_VISUAL.size, 24, 24]" />
          <TresMeshBasicMaterial color="#ffca70" :transparent="true" :opacity="0.1" :blending="AdditiveBlending" :depth-write="false" />
        </TresMesh>
        <TresMesh v-if="selectedId === 'sun'" :scale="[1.7, 1.7, 1.7]">
          <TresSphereGeometry :args="[SUN_VISUAL.size, 24, 24]" />
          <TresMeshBasicMaterial color="#7dd3fc" :transparent="true" :opacity="0.18" :depth-write="false" />
        </TresMesh>
      </TresMesh>

      <TresMesh
        v-for="item in SOLAR_SYSTEM_BODIES"
        :key="item.id"
        :ref="(element) => setMeshRef(item.id, element)"
        @click="emit('select', item.id)"
      >
        <TresSphereGeometry :args="[item.size, 32, 32]" />
        <TresMeshStandardMaterial
          :map="bodyTexture(item.id)"
          :color="bodyTexture(item.id) ? '#ffffff' : getBodyColor(item.id)"
          :emissive="getBodyColor(item.id)"
          :emissive-intensity="0.12"
          :roughness="0.9"
        />
        <TresMesh v-if="item.id === 'saturn'" :rotation="[1.2, 0, 0.3]">
          <TresRingGeometry :args="[item.size * 1.5, item.size * 2.4, 96]" />
          <TresMeshBasicMaterial color="#d8c48a" :transparent="true" :opacity="0.55" :side="DoubleSide" />
        </TresMesh>
        <TresMesh v-if="selectedId === item.id" :scale="[1.6, 1.6, 1.6]">
          <TresSphereGeometry :args="[item.size, 24, 24]" />
          <TresMeshBasicMaterial color="#7dd3fc" :transparent="true" :opacity="0.22" :depth-write="false" />
        </TresMesh>
      </TresMesh>
    </TresCanvas>

    <p v-if="selectedName" class="solar-selection" aria-live="polite">{{ selectedName }}</p>
  </div>
</template>

<style scoped lang="scss">
.solar-system {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: radial-gradient(circle at 50% 45%, #12203f 0%, #060c1e 60%, #03060f 100%);
  cursor: grab;

  &:active { cursor: grabbing; }
}

.solar-selection {
  position: absolute;
  top: 14px;
  left: 16px;
  margin: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(5, 10, 25, 0.65);
  border: 1px solid rgba(125, 211, 252, 0.35);
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 700;
  pointer-events: none;
}

@media (min-width: 768px) {
  .solar-system { height: 540px; }
}
</style>
