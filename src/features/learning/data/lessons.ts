export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'mass-vs-weight',
    title: 'Masa vs. peso',
    summary: 'No son lo mismo: la masa no cambia, el peso sí.',
    content: 'La masa es la cantidad de materia de un objeto y se mantiene igual en cualquier lugar. El peso es la fuerza con la que la gravedad atrae esa masa. Por eso en la Luna pesas menos, pero tu masa sigue siendo la misma.',
  },
  {
    id: 'moon-phases',
    title: 'Fases lunares',
    summary: 'La Luna cambia de aspecto por su posición respecto al Sol y la Tierra.',
    content: 'La Luna no produce luz propia; refleja la luz del Sol. A medida que orbita la Tierra, vemos diferentes porciones iluminadas: luna nueva, creciente, llena y menguante. El ciclo completo dura unos 29.5 días.',
  },
  {
    id: 'eclipses',
    title: 'Eclipses',
    summary: 'Ocurren cuando un cuerpo bloquea la luz de otro.',
    content: 'Un eclipse solar ocurre cuando la Luna pasa entre la Tierra y el Sol. Un eclipse lunar ocurre cuando la Tierra proyecta su sombra sobre la Luna. No hay eclipses cada mes porque la órbita lunar está inclinada.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '¿Qué cambia cuando viajas a otro planeta?',
    options: ['Tu masa', 'Tu peso', 'Tu materia', 'Tu número de átomos'],
    answerIndex: 1,
    explanation: 'La masa se mantiene; el peso cambia según la gravedad.',
  },
  {
    id: 'q2',
    question: '¿Cuánto dura aproximadamente un ciclo lunar completo?',
    options: ['7 días', '14 días', '29.5 días', '365 días'],
    answerIndex: 2,
    explanation: 'El mes sinódico dura alrededor de 29.5 días.',
  },
  {
    id: 'q3',
    question: '¿Cuándo ocurre un eclipse solar?',
    options: ['La Tierra bloquea al Sol', 'La Luna pasa entre la Tierra y el Sol', 'El Sol pasa detrás de Marte', 'La Luna entra en fase llena'],
    answerIndex: 1,
    explanation: 'En un eclipse solar, la Luna bloquea parte o toda la luz solar vista desde la Tierra.',
  },
];
