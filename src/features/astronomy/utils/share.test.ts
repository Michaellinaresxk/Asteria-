import { describe, expect, it } from 'vitest';

import { buildShareText } from './share';

describe('buildShareText', () => {
  it('includes moon phase and event', () => {
    const text = buildShareText(
      new Date('2026-08-12T12:00:00Z'),
      { phase: 'Luna llena', emoji: '🌕', illumination: 100, description: '' },
      { id: 'perseids', date: '08-12', title: 'Perseidas', description: '', type: 'meteor-shower' },
    );
    expect(text).toContain('Luna llena');
    expect(text).toContain('Perseidas');
  });
});
