import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNearEarthObject, getNearEarthObjects } from '@/shared/services/neoWs';
import type { NearEarthObject } from '@/shared/types/neo';
import { toIsoDate } from '@/shared/utils/dates';

import EventsCalendarView from './EventsCalendarView.vue';

vi.mock('@/shared/services/neoWs', () => ({ getNearEarthObjects: vi.fn(), getNearEarthObject: vi.fn() }));

describe('EventsCalendarView', () => {
  beforeEach(() => {
    vi.mocked(getNearEarthObjects).mockReset();
    vi.mocked(getNearEarthObject).mockReset();
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

  it('loads and shows the orbital detail of an asteroid', async () => {
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
    vi.mocked(getNearEarthObject).mockResolvedValue({
      id: '2026-test',
      name: '2026 TEST',
      jplUrl: 'https://example.com/jpl',
      absoluteMagnitude: 26,
      hazardous: false,
      perihelionAu: 0.9,
      aphelionAu: 1.2,
      eccentricity: 0.14,
      inclinationDeg: 3.5,
      orbitalPeriodDays: 365,
    });

    const wrapper = mount(EventsCalendarView);
    await flushPromises();

    await wrapper.find('.orbit-btn').trigger('click');
    await flushPromises();

    expect(getNearEarthObject).toHaveBeenCalledWith('2026-test');
    expect(wrapper.text()).toContain('0.90 UA');
    expect(wrapper.text()).toContain('365 días');
  });
});
