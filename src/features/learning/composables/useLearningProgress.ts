import { ref, watch } from 'vue';

const STORAGE_KEY = 'learning-progress';

interface LearningProgress {
  completedLessons: string[];
  quizScore: number | null;
}

function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedLessons: [], quizScore: null };
    const parsed = JSON.parse(raw) as LearningProgress;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      quizScore: typeof parsed.quizScore === 'number' ? parsed.quizScore : null,
    };
  } catch {
    return { completedLessons: [], quizScore: null };
  }
}

export function useLearningProgress() {
  const progress = ref<LearningProgress>(loadProgress());

  watch(progress, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, { deep: true });

  function toggleLesson(id: string) {
    const set = new Set(progress.value.completedLessons);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    progress.value.completedLessons = [...set];
  }

  function setQuizScore(score: number) {
    progress.value.quizScore = score;
  }

  function isLessonCompleted(id: string) {
    return progress.value.completedLessons.includes(id);
  }

  return { progress, toggleLesson, setQuizScore, isLessonCompleted };
}
