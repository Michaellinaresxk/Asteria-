import { onMounted, onUnmounted, ref } from 'vue';
import { SRGBColorSpace, TextureLoader, type Texture } from 'three';

import { PLANET_VISUALS } from '../data/planetVisuals';

/** Loads the shared planet textures once for the solar system scene. */
export function useSolarSystemTextures() {
  const textures = ref<Record<string, Texture>>({});

  onMounted(() => {
    const loader = new TextureLoader();
    loader.setCrossOrigin('anonymous');

    Object.entries(PLANET_VISUALS).forEach(([id, visual]) => {
      if (!visual.texture) return;
      loader.load(
        visual.texture,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          textures.value[id] = texture;
        },
        undefined,
        () => { /* flat color fallback is handled by the material */ },
      );
    });
  });

  onUnmounted(() => {
    Object.values(textures.value).forEach((texture) => texture.dispose());
  });

  return { textures };
}
