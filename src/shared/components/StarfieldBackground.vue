<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;

onMounted(() => {
  const c = canvas.value;
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.6 + 0.2,
    a: Math.random() * 0.8 + 0.2,
    s: Math.random() * 0.002 + 0.0005,
  }));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c!.width = Math.floor(c!.clientWidth * dpr);
    c!.height = Math.floor(c!.clientHeight * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t = 0) {
    const w = c!.clientWidth;
    const h = c!.clientHeight;
    ctx!.clearRect(0, 0, w, h);
    for (const star of stars) {
      const twinkle = reduce ? 1 : 0.7 + Math.sin(t * star.s + star.x * 10) * 0.3;
      ctx!.globalAlpha = star.a * twinkle;
      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
    if (!reduce) raf = window.requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    if (raf) window.cancelAnimationFrame(raf);
  });
});
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true"></canvas>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
