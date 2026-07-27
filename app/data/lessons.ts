export type Lesson = {
  id: number;
  module: number;

  title: string;
  description: string;

  content: string;

  keyTakeaway: string;

  example: {
    title: string;
    description: string;
  };

  question: string;

  options: string[];

  correct: number;

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
      "Saving means setting aside part of your income instead of spending everything today. It gives you financial security and helps you prepare for future goals and emergencies.",
    keyTakeaway:
      "Pay yourself first. Save before you spend.",
    example: {
      title: "Real-Life Example",
      description:
        "Sarah earns $500 every month and saves $50 before spending anything. After one year she has saved $600.",
    },
    question: "Why should you save money?",
    options: [
      "To prepare for future needs",
      "To spend more",
      "To avoid working",
      "To increase debt",
    ],
    correct: 0,
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
      "A budget helps you plan your income and expenses before you spend your money.",
    keyTakeaway:
      "A budget gives every dollar a job.",
    example: {
      title: "Real-Life Example",
      description:
        "Income: $2,000\nRent: $700\nFood: $300\nSavings: $400\nEverything else: $600",
    },
    question: "Why is a budget important?",
    options: [
      "It helps track your money",
      "It increases debt",
      "It removes taxes",
      "It guarantees wealth",
    ],
    correct: 0,
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
      "An emergency fund protects you against job loss, medical emergencies, or unexpected repairs.",
    keyTakeaway:
      "Save 3–6 months of living expenses.",
    example: {
      title: "Real-Life Example",
      description:
        "John lost his job but had six months of expenses saved, so he never needed a loan.",
    },
    question:
      "What is the primary purpose of an emergency fund?",
    options: [
      "Handle unexpected expenses",
      "Buy luxury items",
      "Invest in crypto",
      "Pay subscriptions",
    ],
    correct: 0,
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
      "Investing helps your money grow through stocks, ETFs, mutual funds, bonds, and real estate.",
    keyTakeaway:
      "Invest for the long term.",
    example: {
      title: "Real-Life Example",
      description:
        "Investing $100 every month into an index fund can grow significantly over many years.",
    },
    question:
      "Why do people invest?",
    options: [
      "To grow wealth",
      "To lose money",
      "To avoid income",
      "To spend faster",
    ],
    correct: 0,
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
      "Compound interest means your money earns returns, and those returns continue earning more returns over time.",
    keyTakeaway:
      "Start early because time is your greatest advantage.",
    example: {
      title: "Real-Life Example",
      description:
        "Investing $100 every month starting at age 20 can grow much larger than starting at age 30 because of compound growth.",
    },
    question:
      "Why is compound interest so powerful?",
    options: [
      "Interest earns interest",
      "It removes all risk",
      "It doubles your salary",
      "It guarantees profits",
    ],
    correct: 0,
    xp: 25,
    completed: false,
    duration: "8 min",
    difficulty: "Intermediate",
    category: "Compound Interest",
  },
];

export function getLessons(): Lesson[] {
  if (typeof window === "undefined") {
    return DEFAULT_LESSONS;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_LESSONS)
    );

    return DEFAULT_LESSONS;
  }

  const lessons = JSON.parse(saved);

  // If old lesson format exists, reset automatically
  if (!lessons[0]?.options) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_LESSONS)
    );

    return DEFAULT_LESSONS;
  }

  return lessons;
}

export function completeLesson(id: number) {
  const lessons = getLessons();

  const lesson = lessons.find((lesson) => lesson.id === id);

  if (!lesson) return;

  lesson.completed = true;
  if (typeof window !== "undefined") {
  const audio = new Audio("/sounds/success.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

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
    percent: (completed / lessons.length) * 100,
  };
}

export function getTodayLesson() {
  const lessons = getLessons();

  return lessons.find((lesson) => !lesson.completed) ?? lessons[0];
}

export function isLessonUnlocked(id: number) {
  const lessons = getLessons();

  const index = lessons.findIndex(
    (lesson) => lesson.id === id
  );

  if (index === 0) return true;

  return lessons[index - 1].completed;
}

export function getLessonById(id: number) {
  return getLessons().find((lesson) => lesson.id === id);
}

export function resetLessons() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DEFAULT_LESSONS)
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}