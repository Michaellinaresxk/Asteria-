<script setup lang="ts">
import { computed, ref } from 'vue';

import { useLocation } from '@/features/astronomy/composables/useLocation';
import ConstellationMap from '../components/ConstellationMap.vue';
import { CONSTELLATIONS } from '../data/constellations';
import { getSeason, getVisibleConstellations, type Season } from '../utils/visibility';

const { location } = useLocation();
const showOnlyVisible = ref(true);

const seasonLabels: Record<Season, string> = {
  spring: 'Primavera',
  summer: 'Verano',
  autumn: 'Otoño',
  winter: 'Invierno',
};

const currentSeason = computed(() => getSeason(new Date(), location.value.latitude));
const visible = computed(() => getVisibleConstellations(new Date(), location.value.latitude));
const visibleIds = computed(() => new Set(visible.value.map((c) => c.id)));
const displayed = computed(() => showOnlyVisible.value ? visible.value : CONSTELLATIONS);
</script>

<template>
  <div class="constellations">
    <header class="hero">
      <p class="eyebrow">Guía del cielo</p>
      <h1>Constelaciones</h1>
      <p class="subtitle">Constelaciones recomendadas para {{ location.label }} · {{ seasonLabels[currentSeason] }}</p>
    </header>

    <div class="controls card">
      <div>
        <p class="eyebrow">Filtro</p>
        <h2>{{ showOnlyVisible ? 'Visibles ahora' : 'Todas las constelaciones' }}</h2>
      </div>
      <button class="toggle-btn" type="button" @click="showOnlyVisible = !showOnlyVisible">
        {{ showOnlyVisible ? 'Ver todas' : 'Solo visibles' }}
      </button>
    </div>

    <div class="grid">
      <article v-for="c in displayed" :key="c.id" class="card constellation-card">
        <ConstellationMap :constellation="c" :active="visibleIds.has(c.id)" class="map" />
        <div class="card-top">
          <span class="latin">{{ c.latin }}</span>
          <span v-if="visibleIds.has(c.id)" class="badge">Visible ahora</span>
        </div>
        <h2>{{ c.name }}</h2>
        <p class="description">{{ c.description }}</p>
        <dl class="details">
          <div><dt>Destacado</dt><dd>{{ c.highlight }}</dd></div>
          <div><dt>Temporada</dt><dd>{{ c.seasons.map((s) => seasonLabels[s]).join(', ') }}</dd></div>
        </dl>
        <p class="tip"><strong>Tip:</strong> {{ c.tip }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.constellations { max-width: 1100px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); animation: fade-up 0.5s ease both; }
.controls { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 16px; }
.controls h2 { margin: 6px 0 0; font-size: 1.2rem; }
.toggle-btn { min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(125,211,252,0.3); background: rgba(125,211,252,0.12); color: #7dd3fc; font-weight: 600; cursor: pointer; white-space: nowrap; }
.grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
.map { margin-bottom: 14px; }
@media (min-width: 700px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
.card-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; margin-bottom: 8px; }
.latin { color: rgba(245,247,255,0.62); font-size: 0.85rem; font-style: italic; }
.badge { font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: rgba(52,211,153,0.16); color: #86efac; }
.constellation-card h2 { margin: 0 0 8px; font-size: 1.35rem; }
.description { margin: 0 0 14px; color: rgba(245,247,255,0.84); line-height: 1.5; }
.details { margin: 0; display: grid; gap: 8px; }
.details div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); }
dt { color: rgba(245,247,255,0.68); font-size: 0.88rem; }
dd { margin: 0; text-align: right; font-size: 0.88rem; }
.tip { margin: 14px 0 0; color: rgba(245,247,255,0.88); line-height: 1.5; font-size: 0.92rem; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
@media (max-width: 560px) { .controls { flex-direction: column; align-items: stretch; } .toggle-btn { width: 100%; } }
</style>
