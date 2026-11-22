<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { CELESTIAL_BODIES } from '../data/bodies';

const typeLabels = { planet: 'Planeta', moon: 'Luna', star: 'Estrella' } as const;
</script>

<template>
  <div class="explorer">
    <header class="hero">
      <p class="eyebrow">Explorar</p>
      <h1>Cuerpos celestes</h1>
      <p class="subtitle">Descubre datos, imágenes y calcula tu peso en cada mundo.</p>
    </header>

    <div class="body-grid">
      <RouterLink
        v-for="body in CELESTIAL_BODIES"
        :key="body.id"
        v-reveal
        :to="`/planetas/${body.id}`"
        class="body-card card"
      >
        <div class="body-top">
          <span class="body-type">{{ typeLabels[body.type] }}</span>
          <span class="body-gravity">{{ body.gravity }} m/s²</span>
        </div>
        <h2>{{ body.name }}</h2>
        <p>{{ body.description }}</p>
        <span class="cta">Ver detalle →</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.explorer { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }
.body-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .body-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .body-grid { grid-template-columns: repeat(3, 1fr); } }
.body-card {
  display: block; text-decoration: none; color: inherit;
  background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px; padding: 20px; backdrop-filter: blur(10px);
  animation: fade-up 0.5s ease both;
}
.body-top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 10px; font-size: 0.8rem; }
.body-type { color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.06em; }
.body-gravity { color: rgba(245,247,255,0.7); }
h2 { margin: 0 0 8px; font-size: 1.4rem; }
p { margin: 0 0 14px; color: rgba(245,247,255,0.84); line-height: 1.5; }
.cta { color: #7dd3fc; font-weight: 600; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .body-card { animation: none; } }
</style>
