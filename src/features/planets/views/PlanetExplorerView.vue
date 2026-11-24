<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import SolarSystem3D from '../components/SolarSystem3D.vue';
import { CELESTIAL_BODIES, getBodyById } from '../data/bodies';

const typeLabels = { planet: 'Planeta', moon: 'Luna', star: 'Estrella' } as const;
const selectedId = ref<string | null>('earth');
const selectedBody = computed(() => getBodyById(selectedId.value ?? ''));
</script>

<template>
  <div class="explorer">
    <header class="hero">
      <p class="eyebrow">Explorar</p>
      <h1>Sistema solar en 3D</h1>
      <p class="subtitle">Arrastra para girar, acerca con el scroll y toca un cuerpo para conocerlo.</p>
    </header>

    <section class="system-section" aria-label="Sistema solar interactivo">
      <SolarSystem3D :selected-id="selectedId" @select="selectedId = $event" />

      <div class="system-info">
        <p class="eyebrow">Cuerpo seleccionado</p>
        <template v-if="selectedBody">
          <h2>{{ selectedBody.name }}</h2>
          <p>{{ selectedBody.description }}</p>
          <dl>
            <div><dt>Tipo</dt><dd>{{ typeLabels[selectedBody.type] }}</dd></div>
            <div><dt>Gravedad</dt><dd>{{ selectedBody.gravity }} m/s²</dd></div>
            <div><dt>Día</dt><dd>{{ selectedBody.dayLength }}</dd></div>
            <div><dt>Año</dt><dd>{{ selectedBody.yearLength }}</dd></div>
          </dl>
          <RouterLink class="detail-link" :to="`/planetas/${selectedBody.id}`">Ver modelo 3D y datos →</RouterLink>
        </template>
        <template v-else>
          <h2>Elige un mundo</h2>
          <p>Toca el Sol o cualquier planeta del modelo para ver aquí su ficha.</p>
        </template>
        <p class="scale-note">Modelo ilustrativo: tamaños, distancias y velocidades están ajustados para que todo sea visible.</p>
      </div>
    </section>

    <h2 class="catalog-title">Catálogo de cuerpos</h2>
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
        <h3>{{ body.name }}</h3>
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
.subtitle { margin: 0; color: rgba(245, 247, 255, 0.78); }

.system-section {
  display: grid;
  gap: 16px;
  margin-bottom: 36px;
  animation: fade-up 0.5s ease both;
}

.system-info {
  padding: 20px;
  border-radius: 20px;
  background: rgba(10, 18, 40, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);

  h2 { margin: 6px 0 8px; font-size: 1.6rem; }
  p { margin: 0 0 12px; color: rgba(245, 247, 255, 0.84); line-height: 1.5; }
  dl { margin: 0 0 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  dt { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(245, 247, 255, 0.6); }
  dd { margin: 2px 0 0; font-weight: 700; }
}

.detail-link {
  display: inline-block;
  min-height: 44px;
  padding: 10px 0;
  color: #7dd3fc;
  font-weight: 700;
  text-decoration: none;
}

.scale-note { margin-top: 14px !important; font-size: 0.78rem; color: rgba(245, 247, 255, 0.55) !important; }

.catalog-title { margin: 0 0 16px; font-size: 1.4rem; }
.body-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
.body-card {
  display: block; text-decoration: none; color: inherit;
  background: rgba(10, 18, 40, 0.72); border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px; padding: 20px; backdrop-filter: blur(10px);
  animation: fade-up 0.5s ease both;
}
.body-top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 10px; font-size: 0.8rem; }
.body-type { color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.06em; }
.body-gravity { color: rgba(245, 247, 255, 0.7); }
h3 { margin: 0 0 8px; font-size: 1.4rem; }
.cta { color: #7dd3fc; font-weight: 600; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (min-width: 900px) {
  .system-section { grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr); align-items: start; }
}
@media (min-width: 700px) { .body-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .body-grid { grid-template-columns: repeat(3, 1fr); } }
@media (prefers-reduced-motion: reduce) { .hero, .body-card, .system-section { animation: none; } }
</style>
