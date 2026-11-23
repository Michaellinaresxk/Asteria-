import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNearEarthObjects } from '@/shared/services/neoWs';
import type { NearEarthObject } from '@/shared/types/neo';
import { toIsoDate } from '@/shared/utils/dates';

import EventsCalendarView from './EventsCalendarView.vue';

vi.mock('@/shared/services/neoWs', () => ({ getNearEarthObjects: vi.fn() }));

describe('EventsCalendarView', () => {
  beforeEach(() => {
    vi.mocked(getNearEarthObjects).mockReset();
    localStorage.clear();
  });

  it('shows near-Earth asteroids on the selected day and offers an asteroid filter', async () => {
    const object: NearEarthObject = {
      id: '2026-test',
      name: '(2026 TEST)',
      date: toIsoDate(new Date()),
      jplUrl: 'https://example.com/jpl',
      hazardous: false,
      distanceLunar: 1.5,
      velocityKmS: 8,
      diameterMinM: 5,
      diameterMaxM: 10,
    };
    vi.mocked(getNearEarthObjects).mockResolvedValue([object]);

    const wrapper = mount(EventsCalendarView);
    await flushPromises();

    const text = wrapper.text();
    expect(text).toContain('Acercamiento de 2026 TEST');
    expect(text).toContain('Asteroides');
    expect(text).toContain('Ver datos en JPL');

    expect(wrapper.findAll('.filter-chip').some((chip) => chip.text() === 'Asteroides')).toBe(true);
  });
});
