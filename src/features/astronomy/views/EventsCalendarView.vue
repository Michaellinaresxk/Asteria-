<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { getNearEarthObject, type NearEarthObjectDetail } from '@/shared/services/neoWs';
import type { AstronomyEvent } from '@/shared/types/astronomy';
import { getWeekWindow, toIsoDate } from '@/shared/utils/dates';
import { useReminders } from '@/features/reminders/composables/useReminders';
import { useNearEarthObjects } from '../composables/useNearEarthObjects';
import { EVENT_TYPE_LABELS, getMonthDays } from '../utils/calendar';

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());
const selectedDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
const activeFilter = ref<AstronomyEvent['type'] | 'all'>('all');
const { addReminder, hasReminder } = useReminders();
const { events: neoEvents, loading: neoLoading, error: neoError, loadRange } = useNearEarthObjects();

const orbitEventId = ref('');
const orbitDetail = ref<NearEarthObjectDetail | null>(null);
const orbitLoading = ref(false);
const orbitError = ref('');

const filters: Array<{ value: AstronomyEvent['type'] | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  ...Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({ value: value as AstronomyEvent['type'], label })),
];

const monthLabel = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
);

function loadNearEarthObjects(date: Date = selectedDate.value) {
  const week = getWeekWindow(date);
  loadRange(week.start, week.end);
}

watch(selectedDate, (date) => {
  closeOrbit();
  loadNearEarthObjects(date);
}, { immediate: true });

async function showOrbit(event: AstronomyEvent): Promise<void> {
  const match = event.id.match(/^neo-(.+)-\d{4}-\d{2}-\d{2}$/);
  if (!match) return;
  if (orbitEventId.value === event.id && orbitDetail.value) {
    closeOrbit();
    return;
  }

  orbitEventId.value = event.id;
  orbitDetail.value = null;
  orbitError.value = '';
  orbitLoading.value = true;

  try {
    orbitDetail.value = await getNearEarthObject(match[1]!);
  } catch {
    orbitError.value = 'No se pudieron cargar los datos orbitales.';
  } finally {
    orbitLoading.value = false;
  }
}

function closeOrbit(): void {
  orbitEventId.value = '';
  orbitDetail.value = null;
  orbitError.value = '';
}

const filteredDays = computed(() =>
  getMonthDays(currentYear.value, currentMonth.value).map((day) => {
    const iso = toIsoDate(day.date);
    const events = [...day.events, ...neoEvents.value.filter((event) => event.fullDate === iso)];
    return {
      ...day,
      events: activeFilter.value === 'all' ? events : events.filter((e) => e.type === activeFilter.value),
    };
  }),
);

const selectedDayEvents = computed(() => {
  const day = filteredDays.value.find((d) => d.date.toDateString() === selectedDate.value.toDateString());
  return day?.events ?? [];
});

const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value -= 1; }
  else currentMonth.value -= 1;
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value += 1; }
  else currentMonth.value += 1;
}

function selectDay(date: Date) {
  selectedDate.value = new Date(date);
}

function formatSelected(date: Date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
</script>

<template>
  <div class="calendar-view">
    <header class="hero">
      <p class="eyebrow">Calendario</p>
      <h1>Eventos astronómicos</h1>
      <p class="subtitle">Explora eventos por mes, filtra por tipo y consulta los asteroides cercanos (NASA NeoWs).</p>
    </header>

    <p v-if="neoLoading" class="data-status" role="status">Consultando asteroides cercanos a la NASA…</p>
    <div v-else-if="neoError" class="data-status data-status-error" role="alert">
      <span>{{ neoError }}</span>
      <button type="button" @click="loadNearEarthObjects()">Reintentar</button>
    </div>

    <div class="filters" role="tablist" aria-label="Filtro de eventos">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-chip"
        :class="{ active: activeFilter === filter.value }"
        type="button"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <section class="card calendar-card">
      <div class="month-nav">
        <button class="nav-btn" type="button" aria-label="Mes anterior" @click="prevMonth">‹</button>
        <h2 class="month-label">{{ monthLabel }}</h2>
        <button class="nav-btn" type="button" aria-label="Mes siguiente" @click="nextMonth">›</button>
      </div>

      <div class="weekdays">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <div class="days-grid">
        <button
          v-for="day in filteredDays"
          :key="day.date.toISOString()"
          type="button"
          class="day-cell"
          :class="{
            'outside': !day.isCurrentMonth,
            'today': day.isToday,
            'selected': day.date.toDateString() === selectedDate.toDateString(),
          }"
          @click="selectDay(day.date)"
        >
          <span class="day-number">{{ day.date.getDate() }}</span>
          <span v-if="day.events.length" class="event-dot" />
        </button>
      </div>
    </section>

    <section class="card detail-card">
      <p class="eyebrow">Día seleccionado</p>
      <h2 class="selected-date">{{ formatSelected(selectedDate) }}</h2>
      <div v-if="selectedDayEvents.length" class="event-list">
        <article v-for="event in selectedDayEvents" :key="event.id" class="event-item">
          <span class="event-type">{{ EVENT_TYPE_LABELS[event.type] }}</span>
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>

          <button v-if="event.type === 'asteroid'" class="orbit-btn" type="button" @click="showOrbit(event)">
            {{ orbitEventId === event.id && orbitDetail ? 'Ocultar órbita' : 'Ver órbita' }}
          </button>
          <div v-if="orbitEventId === event.id" class="orbit-panel">
            <p v-if="orbitLoading" class="orbit-status" role="status">Cargando datos orbitales…</p>
            <p v-else-if="orbitError" class="orbit-status orbit-error" role="alert">{{ orbitError }}</p>
            <dl v-else-if="orbitDetail" class="orbit-grid">
              <div><dt>Perihelio</dt><dd>{{ orbitDetail.perihelionAu.toFixed(2) }} UA</dd></div>
              <div><dt>Afelio</dt><dd>{{ orbitDetail.aphelionAu.toFixed(2) }} UA</dd></div>
              <div><dt>Excentricidad</dt><dd>{{ orbitDetail.eccentricity.toFixed(3) }}</dd></div>
              <div><dt>Inclinación</dt><dd>{{ orbitDetail.inclinationDeg.toFixed(1) }}°</dd></div>
              <div><dt>Periodo orbital</dt><dd>{{ Math.round(orbitDetail.orbitalPeriodDays) }} días</dd></div>
            </dl>
            <button v-if="orbitDetail || orbitError" class="orbit-close" type="button" @click="closeOrbit">Cerrar datos</button>
          </div>

          <a
            v-if="event.detailUrl"
            class="detail-link"
            :href="event.detailUrl"
            target="_blank"
            rel="noopener noreferrer"
          >Ver datos en JPL ↗</a>
          <button
            class="remind-btn"
            type="button"
            :disabled="hasReminder(event.id)"
            @click="addReminder(event.id, event.title, event.date)"
          >
            {{ hasReminder(event.id) ? 'Recordatorio programado' : 'Recordarme' }}
          </button>
        </article>
      </div>
      <p v-else class="empty">No hay eventos para este día con el filtro seleccionado.</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.calendar-view { max-width: 900px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 20px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }
.data-status { margin: 0 0 12px; font-size: 0.85rem; color: #7dd3fc; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.data-status-error { color: #fca5a5; }
.data-status button { min-height: 32px; padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(252,165,165,0.4); background: rgba(252,165,165,0.1); color: inherit; cursor: pointer; }
.filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px; -webkit-overflow-scrolling: touch; }
.filter-chip { flex: 0 0 auto; min-height: 40px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; font-weight: 600; }
.filter-chip.active { background: rgba(125,211,252,0.18); color: #7dd3fc; border-color: rgba(125,211,252,0.35); }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); margin-bottom: 16px; animation: fade-up 0.5s ease both; }
.month-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.month-label { margin: 0; font-size: 1.2rem; text-transform: capitalize; }
.nav-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; font-size: 1.5rem; cursor: pointer; }
.weekdays, .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.weekdays { margin-bottom: 8px; text-align: center; font-size: 0.75rem; color: rgba(245,247,255,0.65); }
.day-cell { min-height: 48px; border-radius: 12px; border: 1px solid transparent; background: rgba(255,255,255,0.03); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; padding: 4px; }
.day-cell.outside { opacity: 0.35; }
.day-cell.today { border-color: rgba(125,211,252,0.45); }
.day-cell.selected { background: rgba(125,211,252,0.18); border-color: rgba(125,211,252,0.45); }
.day-number { font-size: 0.9rem; }
.event-dot { width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; }
.detail-card .selected-date { margin: 4px 0 14px; font-size: 1.2rem; text-transform: capitalize; }
.event-list { display: flex; flex-direction: column; gap: 12px; }
.event-item { padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
.event-type { display: inline-block; font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: rgba(125,211,252,0.15); color: #7dd3fc; margin-bottom: 4px; }
.event-item h3 { margin: 0; font-size: 1rem; }
.event-item p, .empty { margin: 4px 0 0; color: rgba(245,247,255,0.82); line-height: 1.5; }
.detail-link { display: inline-block; margin-top: 8px; min-height: 32px; color: #7dd3fc; font-size: 0.85rem; }
.orbit-btn { margin-top: 8px; min-height: 40px; padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(251,191,36,0.3); background: rgba(251,191,36,0.1); color: #fbbf24; font-weight: 600; cursor: pointer; }
.orbit-panel { margin-top: 10px; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
.orbit-status { margin: 0; font-size: 0.85rem; color: rgba(245,247,255,0.8); }
.orbit-error { color: #fca5a5; }
.orbit-grid { margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px 12px; }
.orbit-grid dt { font-size: 0.72rem; color: rgba(245,247,255,0.6); }
.orbit-grid dd { margin: 2px 0 0; font-weight: 700; }
.orbit-close { margin-top: 10px; min-height: 36px; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; }
.remind-btn { margin-top: 10px; min-height: 40px; padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(125,211,252,0.3); background: rgba(125,211,252,0.12); color: #7dd3fc; font-weight: 600; cursor: pointer; }
.remind-btn:disabled { opacity: 0.55; cursor: default; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
</style>
