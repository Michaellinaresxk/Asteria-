import { defineStore } from 'pinia';

import { EARTH_GRAVITY, PLANET_GRAVITY } from '@/features/planets/data/gravity';

export const usePlanetStore = defineStore('planets', {
  state: () => ({
    earthGravity: EARTH_GRAVITY,
    planets: PLANET_GRAVITY,
  }),
});
