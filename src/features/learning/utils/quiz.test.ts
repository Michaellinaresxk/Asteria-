import { describe, expect, it } from 'vitest';

import { QUIZ_QUESTIONS } from '../data/lessons';
import { calculateQuizScore } from './quiz';

describe('calculateQuizScore', () => {
  it('calculates correct score', () => {
    const score = calculateQuizScore(QUIZ_QUESTIONS, { q1: 1, q2: 2, q3: 1 });
    expect(score).toBe(3);
  });

  it('counts incorrect answers', () => {
    const score = calculateQuizScore(QUIZ_QUESTIONS, { q1: 0, q2: 0, q3: 0 });
    expect(score).toBe(0);
  });
});
