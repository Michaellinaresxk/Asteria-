import { onMounted, onUnmounted, ref } from 'vue';

import { getNotificationStatus, sendLocalNotification } from '@/features/favorites/utils/notifications';
import { createReminderId, getDueReminders, getNextEventTimestamp, type EventReminder } from '../utils/reminders';

const STORAGE_KEY = 'astronomy-reminders';
const reminders = ref<EventReminder[]>(load());
let intervalId: number | undefined;
let consumers = 0;

function load(): EventReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EventReminder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders.value));
}

function checkDue() {
  const due = getDueReminders(reminders.value, Date.now());
  if (!due.length) return;
  const canNotify = getNotificationStatus() === 'granted';
  let changed = false;
  for (const reminder of due) {
    if (canNotify) {
      sendLocalNotification('Recordatorio astronómico', `${reminder.title} es hoy/está próximo.`);
    }
    reminder.notified = true;
    changed = true;
  }
  if (changed) persist();
}

export function useReminders() {
  function addReminder(eventId: string, title: string, eventDate: string) {
    const notifyAt = getNextEventTimestamp(eventDate);
    const id = createReminderId(eventId, notifyAt);
    if (reminders.value.some((r) => r.id === id)) return;
    reminders.value = [...reminders.value, { id, eventId, title, eventDate, notifyAt, notified: false }];
    persist();
  }

  function removeReminder(id: string) {
    reminders.value = reminders.value.filter((r) => r.id !== id);
    persist();
  }

  function hasReminder(eventId: string) {
    return reminders.value.some((r) => r.eventId === eventId && !r.notified);
  }

  onMounted(() => {
    consumers += 1;
    checkDue();
    if (!intervalId) intervalId = window.setInterval(checkDue, 60000);
  });

  onUnmounted(() => {
    consumers -= 1;
    if (consumers <= 0 && intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
      consumers = 0;
    }
  });

  return { reminders, addReminder, removeReminder, hasReminder };
}
