export type DailyTask = {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
};

const STORAGE_KEY = "myfinance-daily-journey";

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 1,
    title: "Track one expense",
    reward: 15,
    completed: false,
  },
  {
    id: 2,
    title: "Read today's lesson",
    reward: 10,
    completed: false,
  },
  {
    id: 3,
    title: "Save $20",
    reward: 20,
    completed: false,
  },
];

export function getDailyTasks(): DailyTask[] {
  if (typeof window === "undefined") {
    return DEFAULT_TASKS;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    saveDailyTasks(DEFAULT_TASKS);
    return DEFAULT_TASKS;
  }

  return JSON.parse(data);
}

export function saveDailyTasks(tasks: DailyTask[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );
}

export function completeTask(id: number) {
  const tasks = getDailyTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task || task.completed) return;

  task.completed = true;

  saveDailyTasks(tasks);
}

export function getJourneyProgress() {
  const tasks = getDailyTasks();

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  return {
    completed,
    total: tasks.length,
    percent: (completed / tasks.length) * 100,
  };
}

export function completeLessonTask() {
  const tasks = getDailyTasks();

  const lessonTask = tasks.find(
    (task) => task.title === "Read today's lesson"
  );

  if (!lessonTask || lessonTask.completed) return;

  lessonTask.completed = true;

  saveDailyTasks(tasks);
}