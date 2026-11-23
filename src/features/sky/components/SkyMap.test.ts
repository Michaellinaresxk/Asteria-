import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { VisiblePlanet } from '@/shared/types/sky';

import SkyMap from './SkyMap.vue';

const planets: VisiblePlanet[] = [
  { name: 'Mars', constellation: 'Aries', altitude: 45, azimuth: 90, magnitude: -1.2, nakedEyeObject: true },
  { name: 'Sun', constellation: 'Scorpius', altitude: -30, azimuth: 200, magnitude: -26, nakedEyeObject: true },
];

describe('SkyMap', () => {
  it('only plots objects above the horizon and emits selection', async () => {
    const wrapper = mount(SkyMap, { props: { planets } });

    expect(wrapper.text()).toContain('Marte');
    expect(wrapper.text()).not.toContain('Sol');

    await wrapper.find('.planet').trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual(['Mars']);
  });

  it('shows an empty state when nothing is above the horizon', () => {
    const wrapper = mount(SkyMap, { props: { planets: [planets[1]!] } });
    expect(wrapper.text()).toContain('No hay objetos sobre el horizonte');
  });
});
