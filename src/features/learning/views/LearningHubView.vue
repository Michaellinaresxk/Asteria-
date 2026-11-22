<script setup lang="ts">
import { computed, ref } from 'vue';

import { LESSONS, QUIZ_QUESTIONS } from '../data/lessons';
import { useLearningProgress } from '../composables/useLearningProgress';
import { calculateQuizScore } from '../utils/quiz';

const { progress, toggleLesson, setQuizScore, isLessonCompleted } = useLearningProgress();
const openLesson = ref<string | null>(LESSONS[0]?.id ?? null);
const answers = ref<Record<string, number>>({});
const quizSubmitted = ref(false);

const completedCount = computed(() => progress.value.completedLessons.length);
const progressPercent = computed(() => Math.round((completedCount.value / LESSONS.length) * 100));
const score = computed(() => calculateQuizScore(QUIZ_QUESTIONS, answers.value));

function selectAnswer(questionId: string, optionIndex: number) {
  if (quizSubmitted.value) return;
  answers.value = { ...answers.value, [questionId]: optionIndex };
}

function submitQuiz() {
  quizSubmitted.value = true;
  setQuizScore(score.value);
}

function resetQuiz() {
  answers.value = {};
  quizSubmitted.value = false;
}
</script>

<template>
  <div class="learning">
    <header class="hero">
      <p class="eyebrow">Aprende</p>
      <h1>Explora el universo</h1>
      <p class="subtitle">Lecciones cortas, quiz rápido y progreso guardado en tu dispositivo.</p>
    </header>

    <section class="card progress-card">
      <div class="progress-top">
        <h2>Tu progreso</h2>
        <span>{{ completedCount }}/{{ LESSONS.length }} lecciones</span>
      </div>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
      </div>
      <p class="progress-note" v-if="progress.quizScore !== null">Último puntaje del quiz: {{ progress.quizScore }}/{{ QUIZ_QUESTIONS.length }}</p>
    </section>

    <section class="lessons">
      <article v-for="lesson in LESSONS" :key="lesson.id" class="card lesson-card">
        <button class="lesson-header" type="button" @click="openLesson = openLesson === lesson.id ? null : lesson.id">
          <div>
            <p class="lesson-status">{{ isLessonCompleted(lesson.id) ? 'Completada' : 'Lección' }}</p>
            <h2>{{ lesson.title }}</h2>
            <p class="summary">{{ lesson.summary }}</p>
          </div>
          <span class="chevron">{{ openLesson === lesson.id ? '−' : '+' }}</span>
        </button>
        <div v-if="openLesson === lesson.id" class="lesson-body">
          <p>{{ lesson.content }}</p>
          <button class="complete-btn" type="button" @click="toggleLesson(lesson.id)">
            {{ isLessonCompleted(lesson.id) ? 'Marcar como pendiente' : 'Marcar como completada' }}
          </button>
        </div>
      </article>
    </section>

    <section class="card quiz-card">
      <p class="eyebrow">Quiz rápido</p>
      <h2>Pon a prueba lo aprendido</h2>

      <div v-for="q in QUIZ_QUESTIONS" :key="q.id" class="question">
        <h3>{{ q.question }}</h3>
        <div class="options">
          <button
            v-for="(option, idx) in q.options"
            :key="option"
            type="button"
            class="option"
            :class="{
              selected: answers[q.id] === idx,
              correct: quizSubmitted && idx === q.answerIndex,
              wrong: quizSubmitted && answers[q.id] === idx && idx !== q.answerIndex,
            }"
            @click="selectAnswer(q.id, idx)"
          >
            {{ option }}
          </button>
        </div>
        <p v-if="quizSubmitted" class="explanation">{{ q.explanation }}</p>
      </div>

      <div class="quiz-actions">
        <button class="primary-btn" type="button" @click="submitQuiz" :disabled="quizSubmitted || Object.keys(answers).length < QUIZ_QUESTIONS.length">
          {{ quizSubmitted ? `Puntaje: ${score}/${QUIZ_QUESTIONS.length}` : 'Ver resultado' }}
        </button>
        <button v-if="quizSubmitted" class="secondary-btn" type="button" @click="resetQuiz">Reintentar</button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.learning { max-width: 900px; margin: 0 auto; color: #f5f7ff; }
.hero { margin-bottom: 24px; animation: fade-up 0.4s ease both; }
.eyebrow { margin: 0; color: #7dd3fc; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
h1 { margin: 4px 0; font-size: clamp(2rem, 8vw, 3rem); }
.subtitle { margin: 0; color: rgba(245,247,255,0.78); }
.card { background: rgba(10,18,40,0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); margin-bottom: 16px; animation: fade-up 0.5s ease both; }
.progress-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.progress-top h2 { margin: 0; font-size: 1.2rem; }
.progress-bar { margin-top: 14px; height: 10px; background: rgba(255,255,255,0.12); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #34d399, #7dd3fc); transition: width 0.4s ease; }
.progress-note { margin: 12px 0 0; color: rgba(245,247,255,0.78); }
.lessons { display: grid; gap: 16px; }
.lesson-header { width: 100%; background: none; border: 0; color: inherit; text-align: left; display: flex; justify-content: space-between; gap: 16px; cursor: pointer; padding: 0; }
.lesson-status { margin: 0; color: #86efac; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; }
.lesson-header h2 { margin: 4px 0; font-size: 1.25rem; }
.summary { margin: 0; color: rgba(245,247,255,0.8); }
.chevron { font-size: 1.6rem; color: #7dd3fc; line-height: 1; }
.lesson-body { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); }
.lesson-body p { margin: 0 0 14px; line-height: 1.6; color: rgba(245,247,255,0.88); }
.complete-btn, .primary-btn, .secondary-btn { min-height: 44px; border-radius: 12px; padding: 10px 14px; font-weight: 600; cursor: pointer; border: 0; }
.complete-btn { background: rgba(134,239,172,0.16); color: #86efac; width: 100%; }
.quiz-card h2 { margin: 6px 0 16px; font-size: 1.4rem; }
.question { padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.08); }
.question h3 { margin: 0 0 12px; font-size: 1rem; }
.options { display: grid; gap: 8px; }
.option { min-height: 44px; text-align: left; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #fff; cursor: pointer; }
.option.selected { border-color: rgba(125,211,252,0.45); background: rgba(125,211,252,0.12); }
.option.correct { border-color: rgba(52,211,153,0.6); background: rgba(52,211,153,0.16); }
.option.wrong { border-color: rgba(248,113,113,0.6); background: rgba(248,113,113,0.14); }
.explanation { margin: 10px 0 0; color: rgba(245,247,255,0.78); font-size: 0.92rem; }
.quiz-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
.primary-btn { background: #7dd3fc; color: #082f49; }
.primary-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.secondary-btn { background: rgba(255,255,255,0.08); color: #fff; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero, .card, .progress-fill { animation: none; transition: none; } }
</style>
