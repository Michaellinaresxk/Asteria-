import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getNotificationStatus, sendLocalNotification } from './notifications';

describe('notifications utils', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports unsupported when Notification is missing', () => {
    vi.stubGlobal('Notification', undefined);
    expect(getNotificationStatus()).toBe('unsupported');
  });

  it('does not send when permission not granted', () => {
    vi.stubGlobal('Notification', { permission: 'default' });
    expect(sendLocalNotification('Test', 'Body')).toBe(false);
  });
});
