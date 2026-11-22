<script setup lang="ts">
import ApodCard from '../components/ApodCard.vue';
import DailyEventsCard from '../components/DailyEventsCard.vue';
import LocationCard from '../components/LocationCard.vue';
import MoonPhaseCard from '../components/MoonPhaseCard.vue';
import ShareCard from '../components/ShareCard.vue';
import SunTimesCard from '../components/SunTimesCard.vue';
import { useLocation } from '../composables/useLocation';

const { location, locating, locationError, saveLocation, requestGeolocation } = useLocation();

const today = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-hero">
      <p class="eyebrow">Astronomía</p>
      <h1>Hoy en el cielo</h1>
      <p class="date">{{ today }}</p>
    </header>

    <div class="dashboard-grid">
      <MoonPhaseCard />
      <LocationCard
        :location="location"
        :locating="locating"
        :error="locationError"
        @update:location="saveLocation"
        @request-geolocation="requestGeolocation"
      />
      <SunTimesCard :location="location" />
      <ApodCard class="grid-apod" />
      <DailyEventsCard />
      <ShareCard />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-hero {
  color: #f5f7ff;
  margin-bottom: 24px;
  animation: fade-up 0.4s ease both;
}

.eyebrow {
  margin: 0;
  color: #7dd3fc;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1 {
  margin: 4px 0;
  font-size: clamp(2rem, 8vw, 3.5rem);
  line-height: 1.1;
}

.date {
  margin: 0;
  color: rgba(245, 247, 255, 0.78);
  text-transform: capitalize;
}

.dashboard-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .grid-apod {
    grid-row: span 2;
  }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-hero,
  :deep(.card) {
    animation: none;
    transition: none;
  }
}
</style>
