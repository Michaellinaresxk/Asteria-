import type { Directive } from 'vue';

const observer = typeof window !== 'undefined' && 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 })
  : null;

export const reveal: Directive<HTMLElement> = {
  mounted(el) {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !observer) {
      el.classList.add('is-revealed');
      return;
    }
    el.classList.add('reveal');
    observer.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
