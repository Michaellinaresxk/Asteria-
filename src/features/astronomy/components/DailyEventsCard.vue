<script setup lang="ts">
import { computed } from 'vue';

import { getEventsForDate } from '../data/dailyEvents';

const events = computed(() => getEventsForDate(new Date(), 14));

const typeLabel: Record<string, string> = {
  'meteor-shower': 'Meteoros',
  eclipse: 'Eclipse',
  conjunction: 'Conjunción',
  planet: 'Planeta',
  moon: 'Luna',
  season: 'Estación',
};
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
            <span class="event-type">{{ typeLabel[event.type] ?? event.type }}</span>
          </div>
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="status">No hay eventos destacados en los próximos días.</p>
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

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
