import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSpaceWeatherAlerts, normalizeNotifications, summarizeNotification } from './donki';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const raw = {
  messageID: '20261101-AL-001',
  messageType: 'CME',
  messageIssueTime: '2026-11-01T13:28Z',
  messageBody: '## Message Type: CME\n## Message Body:\nSe observó una eyección de masa coronal.',
  messageURL: 'https://example.com/report',
};

describe('donki service', () => {
  beforeEach(() => vi.mocked(axios.get).mockReset());

  it('cleans markdown from the message body', () => {
    expect(summarizeNotification(raw.messageBody)).toBe('Se observó una eyección de masa coronal.');
  });

  it('normalizes notifications with a readable label', () => {
    const [alert] = normalizeNotifications([raw]);
    expect(alert).toMatchObject({
      id: raw.messageID,
      type: 'CME',
      label: 'Eyección de masa coronal',
      url: raw.messageURL,
    });
  });

  it('requests the last N days of alerts', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [raw] } as never);

    const alerts = await getSpaceWeatherAlerts(7);

    expect(alerts).toHaveLength(1);
    expect(vi.mocked(axios.get).mock.calls[0]?.[1]).toMatchObject({
      params: { type: 'all' },
    });
  });
});
