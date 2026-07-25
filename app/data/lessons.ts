export type Lesson = {
  id: number;
  title: string;
  description: string;
  content: string;
  xp: number;
  completed: boolean;
};

const STORAGE_KEY = "myfinance-lessons";

const DEFAULT_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Pay Yourself First",
    description: "The #1 habit of wealthy people.",
    content:
      "Before paying bills or buying anything else, save a percentage of your income first. Even saving 10% consistently can build significant wealth over time because your savings grow before your spending begins.",
    xp: 10,
    completed: false,
  },
  {
    id: 2,
    title: "Needs vs Wants",
    description: "Master your spending decisions.",
    content:
      "Needs are things you must have to live and work. Wants improve comfort but aren't essential. Learning the difference is one of the fastest ways to gain control of your finances.",
    xp: 10,
    completed: false,
  },
  {
    id: 3,
    title: "Emergency Fund",
    description: "Protect your future self.",
    content:
      "Build an emergency fund that covers 3–6 months of expenses. This prevents unexpected events from becoming financial disasters.",
    xp: 10,
    completed: false,
  },
];

export function getLessons(): Lesson[] {
  if (typeof window === "undefined") {
    return DEFAULT_LESSONS;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    saveLessons(DEFAULT_LESSONS);
    return DEFAULT_LESSONS;
  }

  return JSON.parse(data);
}

export function saveLessons(
  lessons: Lesson[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(lessons)
  );
}

export function getTodayLesson(): Lesson {
  const lessons = getLessons();

  const nextLesson = lessons.find(
    (lesson) => !lesson.completed
  );

  return nextLesson ?? lessons[0];
}

export function completeLesson(id: number): void {
  const lessons = getLessons();

  const lesson = lessons.find(
    (lesson) => lesson.id === id
  );

  if (!lesson || lesson.completed) return;

  lesson.completed = true;

  saveLessons(lessons);
}