import type { QuizQuestion } from '../data/lessons';

export function calculateQuizScore(questions: QuizQuestion[], answers: Record<string, number>): number {
  return questions.reduce((score, q) => score + (answers[q.id] === q.answerIndex ? 1 : 0), 0);
}
