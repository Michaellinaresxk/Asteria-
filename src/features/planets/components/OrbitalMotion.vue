<script setup lang="ts">
import type { Object3D } from 'three';
import { useLoop } from '@tresjs/core';
import type { Vec3 } from '@/shared/types/vector';

import { SOLAR_SYSTEM_BODIES } from '../data/solarSystem';
import { getOrbitAngle, getOrbitPosition, getChildPosition } from '../utils/orbits';

const props = defineProps<{
  meshes: Map<string, Object3D>;
}>();

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed, delta }) => {
  const positions = new Map<string, Vec3>();

  for (const item of SOLAR_SYSTEM_BODIES) {
    const angle = getOrbitAngle(item.initialAngle, item.orbitSpeed, elapsed);
    const localPosition = getOrbitPosition(item.orbitRadius, angle, item.inclination);
    const parentPosition = item.parent ? positions.get(item.parent) : undefined;
    const position = parentPosition ? getChildPosition(parentPosition, localPosition) : localPosition;
    positions.set(item.id, position);

    const mesh = props.meshes.get(item.id);
    if (!mesh) continue;
    mesh.position.set(...position);
    mesh.rotation.y += delta * 0.35;
  }
});
</script>

<template>
  <TresGroup />
</template>
