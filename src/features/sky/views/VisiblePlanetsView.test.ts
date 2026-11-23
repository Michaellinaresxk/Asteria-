import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getVisiblePlanets } from '@/shared/services/visiblePlanets';

import SkyMap from '../components/SkyMap.vue';
import VisiblePlanetsView from './VisiblePlanetsView.vue';

vi.mock('@/shared/services/visiblePlanets', () => ({ getVisiblePlanets: vi.fn() }));

describe('VisiblePlanetsView', () => {
  beforeEach(() => {
    vi.mocked(getVisiblePlanets).mockReset();
    localStorage.clear();
  });

  it('renders the interactive sky map alongside the planet data', async () => {
    vi.mocked(getVisiblePlanets).mockResolvedValue([
      { name: 'Mars', constellation: 'Aries', altitude: 45, azimuth: 90, magnitude: -1.2, nakedEyeObject: true },
    ]);

    const wrapper = mount(VisiblePlanetsView);
    await flushPromises();

    const text = wrapper.text();
    expect(text).toContain('Mapa del cielo');
    expect(text).toContain('Marte');
    expect(wrapper.findComponent(SkyMap).exists()).toBe(true);
  });
});
