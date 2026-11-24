import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { JOURNEY_STOPS } from '../data/journeyStops';
import { getActiveStopIndex, getJourneyPose, getScrollProgress } from '../utils/journey';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

/** Scroll + pointer driven camera controls for the dashboard's virtual flight. */
export function useSpaceJourney() {
  const progress = ref(0);
  const pointer = reactive({ x: 0, y: 0 });
  const drift = ref(0);
  const reducedMotion = ref(false);
  let raf = 0;

  function updateProgress() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    progress.value = getScrollProgress(window.scrollY, maxScroll);
  }

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  function animate(time: number) {
    drift.value = time / 1000;
    raf = window.requestAnimationFrame(animate);
  }

  function goToStop(index: number): void {
    const clamped = Math.max(0, Math.min(JOURNEY_STOPS.length - 1, index));
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const top = (clamped / (JOURNEY_STOPS.length - 1)) * maxScroll;
    window.scrollTo({ top, behavior: reducedMotion.value ? 'auto' : 'smooth' });
  }

  onMounted(() => {
    reducedMotion.value = prefersReducedMotion();
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    if (!reducedMotion.value) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      if (typeof window.requestAnimationFrame === 'function') {
        raf = window.requestAnimationFrame(animate);
      }
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress);
    window.removeEventListener('resize', updateProgress);
    window.removeEventListener('pointermove', onPointerMove);
    if (raf && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(raf);
    }
  });

  const pose = computed(() => getJourneyPose(
    progress.value,
    reducedMotion.value ? 0 : pointer.x,
    reducedMotion.value ? 0 : pointer.y,
    reducedMotion.value ? 0 : drift.value,
  ));

  const activeStopIndex = computed(() => getActiveStopIndex(progress.value));
  const activeStop = computed(() => JOURNEY_STOPS[activeStopIndex.value]!);

  return { progress, pointer, reducedMotion, pose, activeStop, activeStopIndex, goToStop };
}
