export type Lesson = {
  id: number;
  module: number;
  title: string;
  description: string;
  content: string;
  xp: number;
  completed: boolean;

  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
};

const STORAGE_KEY = "myfinance-lessons";

const DEFAULT_LESSONS: Lesson[] = [
  {
  id: 1,
  module: 1,
  title: "What is Saving?",
  description: "Learn why saving money matters.",
  content:
    "Saving means keeping part of your income for future needs instead of spending everything today.",
  xp: 10,
  completed: false,

  duration: "3 min",
  difficulty: "Beginner",
  category: "Money Basics",
},

  {
    id: 2,
    module: 1,
    title: "Budgeting",
    description: "Control your money with a budget.",
    content:
      "A budget helps you plan income and expenses so you always know where your money goes.",
    xp: 10,
    completed: false,

    duration: "4 min",
difficulty: "Beginner",
category: "Budgeting",
  },

  {
    id: 3,
    module: 1,
    title: "Emergency Fund",
    description: "Prepare for unexpected events.",
    content:
      "An emergency fund protects you against job loss, illness, or unexpected expenses.",
    xp: 15,
    completed: false,

    duration: "5 min",
difficulty: "Beginner",
category: "Emergency Fund",
  },

  {
    id: 4,
    module: 1,
    title: "Investing Basics",
    description: "Start growing your wealth.",
    content:
      "Investing allows your money to grow over time through stocks, ETFs, real estate, and more.",
    xp: 20,
    completed: false,

    duration: "7 min",
difficulty: "Intermediate",
category: "Investing",
  },

  {
    id: 5,
    module: 1,
    title: "Compound Interest",
    description: "The most powerful force in investing.",
    content:
      "Compound interest means earning returns on your previous returns, creating exponential growth.",
    xp: 25,
    completed: false,

    duration: "8 min",
difficulty: "Intermediate",
category: "Compound Interest",
  },
];

export function getLessons(): Lesson[] {
  if (typeof window === "undefined")
    return DEFAULT_LESSONS;

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_LESSONS)
    );

    return DEFAULT_LESSONS;
  }

  return JSON.parse(saved);
}

export function completeLesson(id: number) {
  const lessons = getLessons();

  const lesson = lessons.find(
    (lesson) => lesson.id === id
  );

  if (!lesson) return;

  lesson.completed = true;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(lessons)
  );
}

export function getModuleProgress(module: number) {
  const lessons = getLessons().filter(
    (lesson) => lesson.module === module
  );

  const completed = lessons.filter(
    (lesson) => lesson.completed
  ).length;

  return {
    completed,
    total: lessons.length,
    percent:
      (completed / lessons.length) * 100,
  };
}
export function getTodayLesson() {
  const lessons = getLessons();

  const nextLesson = lessons.find(
    (lesson) => !lesson.completed
  );

  return nextLesson ?? lessons[0];
  
}

export function isLessonUnlocked(id: number) {
  const lessons = getLessons();

  const index = lessons.findIndex(
    (lesson) => lesson.id === id
  );

  if (index === 0) return true;

  return lessons[index - 1].completed;
}