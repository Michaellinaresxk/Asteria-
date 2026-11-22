export interface EventReminder {
  id: string;
  eventId: string;
  title: string;
  eventDate: string; // MM-DD
  notifyAt: number; // timestamp ms
  notified: boolean;
}

export function createReminderId(eventId: string, notifyAt: number): string {
  return `${eventId}-${notifyAt}`;
}

export function getNextEventTimestamp(eventDate: string, now = new Date()): number {
  const [mm, dd] = eventDate.split('-').map(Number);
  const year = now.getFullYear();
  let candidate = new Date(year, mm - 1, dd, 9, 0, 0, 0).getTime();
  if (candidate < now.getTime()) {
    candidate = new Date(year + 1, mm - 1, dd, 9, 0, 0, 0).getTime();
  }
  return candidate;
}

export function getDueReminders(reminders: EventReminder[], nowMs: number): EventReminder[] {
  return reminders.filter((r) => !r.notified && r.notifyAt <= nowMs);
}
