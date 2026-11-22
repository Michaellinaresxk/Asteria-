export type NotificationSupport = 'unsupported' | 'default' | 'granted' | 'denied';

export function getNotificationStatus(): NotificationSupport {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationSupport> {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function sendLocalNotification(title: string, body: string): boolean {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;
  new Notification(title, { body });
  return true;
}
