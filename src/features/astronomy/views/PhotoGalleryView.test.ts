import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getApodArchive } from '@/shared/services/apodArchive';
import { searchCommonsImages } from '@/shared/services/commonsImages';

import PhotoGalleryView from './PhotoGalleryView.vue';

vi.mock('@/shared/services/apodArchive', () => ({ getApodArchive: vi.fn() }));
vi.mock('@/shared/services/commonsImages', () => ({ searchCommonsImages: vi.fn() }));

describe('PhotoGalleryView', () => {
  beforeEach(() => {
    vi.mocked(getApodArchive).mockReset();
    vi.mocked(searchCommonsImages).mockReset();
  });

  it('renders APOD photos, opens the lightbox and switches to Commons', async () => {
    vi.mocked(getApodArchive).mockResolvedValue([{
      date: '2026-11-23',
      title: 'Nebulosa de prueba',
      explanation: 'Una nebulosa real',
      media_type: 'image',
      url: 'https://example.com/thumb.jpg',
      hdurl: 'https://example.com/full.jpg',
    }]);
    vi.mocked(searchCommonsImages).mockResolvedValue([{
      id: '1',
      title: 'Galaxia de prueba',
      thumbUrl: 'https://example.com/commons-thumb.jpg',
      imageUrl: 'https://example.com/commons-full.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Test.jpg',
      license: 'CC BY-SA 4.0',
    }]);

    const wrapper = mount(PhotoGalleryView);
    await flushPromises();

    expect(wrapper.text()).toContain('Nebulosa de prueba');
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/thumb.jpg');

    await wrapper.find('.photo-button').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    await wrapper.find('.close-btn').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);

    const commonsTab = wrapper.findAll('.tab').find((tab) => tab.text().includes('Commons'));
    await commonsTab!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Galaxia de prueba');
    expect(searchCommonsImages).toHaveBeenCalledTimes(1);
  });
});
