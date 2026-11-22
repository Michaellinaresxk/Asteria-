<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { CELESTIAL_BODIES } from '@/features/planets/data/bodies';
import { ASTRONOMY_EVENTS } from '@/features/astronomy/data/dailyEvents';
import { useFavorites } from '../composables/useFavorites';
import { getNotificationStatus, requestNotificationPermission, sendLocalNotification } from '../utils/notifications';

const { state, toggleBody, toggleEvent } = useFavorites();
const notificationStatus = ref(getNotificationStatus());

const favoriteBodies = computed(() => CELESTIAL_BODIES.filter((b) => state.value.bodies.includes(b.id)));
const favoriteEvents = computed(() => ASTRONOMY_EVENTS.filter((e) => state.value.events.includes(e.id)));

async function enableNotifications() {
  notificationStatus.value = await requestNotificationPermission();
  if (notificationStatus.value === 'granted') {
    sendLocalNotification('Astronomía', 'Las notificaciones están activadas.');
  }
}

function testReminder() {
  const sent = sendLocalNotification('Recordatorio astronómico', 'Revisa los eventos de hoy en tu dashboard.');
  if (!sent) notificationStatus.value = getNotificationStatus();
}
</script>

<template>
  <div class="favorites">
    <header class="hero">
      <p class="eyebrow">Personal</p>
      <h1>Mis favoritos</h1>
      <p class="subtitle">Guarda cuerpos celestes y eventos para encontrarlos rápido.</p>
    </header>

    <section class="card">
      <p class="eyebrow">Notificaciones</p>
      <h2>Recordatorios</h2>
      <p class="status">Estado: <strong>{{ notificationStatus }}</strong></p>
      <div class="actions">
        <button class="primary-btn" type="button" @click="enableNotifications">Activar notificaciones</button>
        <button class="secondary-btn" type="button" @click="testReminder">Probar recordatorio</button>
      </div>
    </section>

    <section class="card">
      <p class="eyebrow">Cuerpos celestes</p>
      <h2>Favoritos</h2>
      <div v-if="favoriteBodies.length" class="list">
        <div v-for="body in favoriteBodies" :key="body.id" class="list-item">
          <RouterLink :to="`/planetas/${body.id}`" class="item-link">{{ body.name }}</RouterLink>
          <button class="remove-btn" type="button" @click="toggleBody(body.id)">Quitar</button>
        </div>
      </div>
      <p v-else class="empty">Aún no tienes cuerpos favoritos. Explora <RouterLink to="/planetas">Planetas</RouterLink>.</p>
    </section>

    <section class="card">
      <p class="eyebrow">Eventos</p>
      <h2>Eventos guardados</h2>
      <div v-if="favoriteEvents.length" class="list">
        <div v-for="event in favoriteEvents" :key="event.id" class="list-item">
          <div>
            <span class="event-date">{{ event.date }}</span>
            <span class="item-name">{{ event.title }}</span>
          </div>
          <button class="remove-btn" type="button" @click="toggleEvent(event.id)">Quitar</button>
        </div>
      </div>
      <p v-else class="empty">Aún no tienes eventos guardados. Visita <RouterLink to="/eventos">Eventos</RouterLink>.</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.favorites { max-width: 900px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle, .status, .empty { color: rgba(245,247,255,0.8); }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); margin-bottom: 16px; animation: fade-up 0.5s ease both; }
h2 { margin: 6px 0 14px; font-size: 1.3rem; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.primary-btn, .secondary-btn, .remove-btn { min-height: 44px; border-radius: 12px; padding: 10px 14px; font-weight: 600; cursor: pointer; border: 0; }
.primary-btn { background: #7dd3fc; color: #082f49; }
.secondary-btn { background: rgba(255,255,255,0.08); color: #fff; }
.remove-btn { background: rgba(248,113,113,0.14); color: #fca5a5; }
.list { display: flex; flex-direction: column; gap: 10px; }
.list-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.08); }
.item-link, .item-name { color: #fff; font-weight: 600; text-decoration: none; }
.event-date { color: #7dd3fc; font-size: 0.85rem; margin-right: 8px; }
.empty a { color: #7dd3fc; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card { animation: none; } }
</style>
