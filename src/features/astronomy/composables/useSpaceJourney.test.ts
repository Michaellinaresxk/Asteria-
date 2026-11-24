import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { JOURNEY_STOPS } from '../data/journeyStops';
import { useSpaceJourney } from './useSpaceJourney';

function mountJourney() {
  const component = defineComponent({
    setup() {
      return useSpaceJourney();
    },
    template: '<div />',
  });
  return mount(component);
}

describe('useSpaceJourney', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    });
    window.requestAnimationFrame = vi.fn(() => 0);
    window.cancelAnimationFrame = vi.fn();
    window.scrollTo = vi.fn() as typeof window.scrollTo;
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('starts at the first stop and follows scroll progress', async () => {
    const wrapper = mountJourney();
    const firstZ = (wrapper.vm.pose as { position: number[] }).position[2];
    expect((wrapper.vm.activeStop as { id: string }).id).toBe(JOURNEY_STOPS[0]!.id);

    window.scrollY = 1000;
    window.dispatchEvent(new Event('scroll'));
    await nextTick();

    const movedZ = (wrapper.vm.pose as { position: number[] }).position[2];
    expect(movedZ).toBeLessThan(firstZ);
    expect((wrapper.vm.progress as number)).toBe(1);
    expect((wrapper.vm.activeStop as { id: string }).id).toBe(JOURNEY_STOPS.at(-1)!.id);
    wrapper.unmount();
  });

  it('scrolls to the requested stop', () => {
    const wrapper = mountJourney();
    (wrapper.vm as unknown as { goToStop: (index: number) => void }).goToStop(2);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
    wrapper.unmount();
  });

  it('keeps camera motion static when reduced motion is requested', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    });
    const wrapper = mountJourney();
    expect((wrapper.vm as unknown as { reducedMotion: boolean }).reducedMotion).toBe(true);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();

    (wrapper.vm as unknown as { goToStop: (index: number) => void }).goToStop(1);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 250, behavior: 'auto' });
    wrapper.unmount();
  });
});
