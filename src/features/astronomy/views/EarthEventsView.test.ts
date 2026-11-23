import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNaturalEvents } from '@/shared/services/eonet';

import EarthEventsView from './EarthEventsView.vue';

vi.mock('@/shared/services/eonet', () => ({ getNaturalEvents: vi.fn() }));

describe('EarthEventsView', () => {
  beforeEach(() => vi.mocked(getNaturalEvents).mockReset());

  it('renders events and filters them by category', async () => {
    vi.mocked(getNaturalEvents).mockResolvedValue([
      {
        id: '1',
        title: 'Incendio de prueba',
        category: 'Wildfires',
        date: '2026-11-23T10:00:00Z',
        latitude: 40,
        longitude: -10,
        magnitude: '12 ha',
        link: 'https://example.com/1',
      },
      {
        id: '2',
        title: 'Tormenta de prueba',
        category: 'Storms',
        date: '2026-11-22T10:00:00Z',
        latitude: 20,
        longitude: 5,
        magnitude: '',
        link: 'https://example.com/2',
      },
    ]);

    const wrapper = mount(EarthEventsView);
    await flushPromises();

    expect(wrapper.text()).toContain('Incendio de prueba');
    expect(wrapper.text()).toContain('Tormenta de prueba');

    const stormsChip = wrapper.findAll('.chip').find((chip) => chip.text() === 'Storms');
    await stormsChip!.trigger('click');

    expect(wrapper.text()).toContain('Tormenta de prueba');
    expect(wrapper.text()).not.toContain('Incendio de prueba');
  });
});
