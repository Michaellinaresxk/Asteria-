import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { JOURNEY_STOPS } from '../data/journeyStops';
import SpaceJourneyHero from './SpaceJourneyHero.vue';

const goToStop = vi.fn();

vi.mock('../composables/useSpaceJourney', () => ({
  useSpaceJourney: () => ({
    pose: ref({ position: [0, 1, 16], target: [0, 0, 0] }),
    progress: ref(0),
    activeStop: ref(JOURNEY_STOPS[0]),
    activeStopIndex: ref(0),
    goToStop,
  }),
}));

describe('SpaceJourneyHero', () => {
  it('shows the active stop and lets the user jump to another one', async () => {
    const wrapper = mount(SpaceJourneyHero, {
      global: { stubs: { SpaceJourneyScene: true } },
    });

    expect(wrapper.text()).toContain(JOURNEY_STOPS[0]!.title);
    expect(wrapper.findAll('.journey-stop')).toHaveLength(JOURNEY_STOPS.length);

    await wrapper.findAll('.journey-stop')[2]!.trigger('click');
    expect(goToStop).toHaveBeenCalledWith(2);
  });
});
