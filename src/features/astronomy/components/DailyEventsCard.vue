<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { getWeekWindow, toIsoDate } from '@/shared/utils/dates';
import { useNearEarthObjects } from '../composables/useNearEarthObjects';
import { getEventsForDate } from '../data/dailyEvents';
import { EVENT_TYPE_LABELS } from '../utils/calendar';

const { events: neoEvents, loadRange } = useNearEarthObjects();
const week = getWeekWindow(new Date());

onMounted(() => loadRange(week.start, week.end));

const events = computed(() => {
  const today = toIsoDate(new Date());
  const end = toIsoDate(week.end);
  const nearbyNeos = neoEvents.value
    .filter((event) => event.fullDate && event.fullDate >= today && event.fullDate <= end)
    .slice(0, 5);

  return [...getEventsForDate(new Date(), 14), ...nearbyNeos].slice(0, 8);
});
</script>

<template>
  <article class="card events-card">
    <p class="eyebrow">Eventos cercanos</p>
    <h2>Calendario astronómico</h2>

    <ul v-if="events.length" class="events-list">
      <li v-for="event in events" :key="event.id" class="event-item">
        <div class="event-date">{{ event.date }}</div>
        <div>
          <div class="event-meta">
            <span class="event-type">{{ EVENT_TYPE_LABELS[event.type] ?? event.type }}</span>
          </div>
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="status">No hay eventos destacados en los próximos días.</p>
    <p class="data-source">Asteroides cercanos: NASA NeoWs</p>
  </article>
</template>

<style scoped lang="scss">
.card {
  background: rgba(10, 18, 40, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  color: #f5f7ff;
  text-align: left;
  animation: fade-up 0.5s ease 0.2s both;
}

.eyebrow {
  margin: 0;
  color: #fbbf24;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 { margin: 6px 0 16px; font-size: clamp(1.3rem, 4vw, 1.8rem); }

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.event-date {
  font-weight: 700;
  color: #7dd3fc;
  font-size: 0.95rem;
}

.event-type {
  display: inline-block;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.15);
  color: #7dd3fc;
  margin-bottom: 4px;
}

h3 { margin: 0; font-size: 1rem; }
p { margin: 4px 0 0; color: rgba(245, 247, 255, 0.82); line-height: 1.5; font-size: 0.92rem; }
.status { color: rgba(245, 247, 255, 0.72); }
.data-source { margin-top: 14px; font-size: 0.72rem; color: rgba(245, 247, 255, 0.5); }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
