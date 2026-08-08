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
    title: "Review your spending",
    reward: 10,
    completed: false,
  },
  {
    id: 3,
    title: "Make one better money decision",
    reward: 20,
    completed: false,
  },
];

/* ==========================================
   GET DAILY TASKS
========================================== */

export function getDailyTasks(): DailyTask[] {
  if (typeof window === "undefined") {
    return DEFAULT_TASKS;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    saveDailyTasks(DEFAULT_TASKS);
    return DEFAULT_TASKS;
  }

  try {
    const tasks = JSON.parse(data) as DailyTask[];

    /*
      Detect old Daily Journey structure
    */
    const hasOldTask = tasks.some(
      (task) =>
        task.title === "Read today's lesson" ||
        task.title === "Save $20"
    );

    if (hasOldTask) {
      resetDailyJourney();
      return getDailyTasks();
    }

    /*
      Validate current structure
    */
    const valid =
      tasks.length === DEFAULT_TASKS.length &&
      DEFAULT_TASKS.every((defaultTask) => {
        const task = tasks.find(
          (t) => t.id === defaultTask.id
        );

        return (
          task &&
          task.title === defaultTask.title &&
          typeof task.reward === "number" &&
          typeof task.completed === "boolean"
        );
      });

    if (!valid) {
      resetDailyJourney();
      return getDailyTasks();
    }

    return tasks;

  } catch {
    resetDailyJourney();
    return getDailyTasks();
  }
}

/* ==========================================
   SAVE
========================================== */

export function saveDailyTasks(
  tasks: DailyTask[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}

/* ==========================================
   COMPLETE TASK
========================================== */

export function completeTask(
  id: number
): boolean {

  const tasks = getDailyTasks();

  const task = tasks.find(
    (task) => task.id === id
  );

  if (!task || task.completed) {
    return false;
  }

  task.completed = true;

  saveDailyTasks(tasks);

  return true;
}

/* ==========================================
   PROGRESS
========================================== */

export function getJourneyProgress() {

  const tasks = getDailyTasks();

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  return {
    completed,
    total: tasks.length,
    percent:
      tasks.length === 0
        ? 0
        : (completed / tasks.length) * 100,
  };
}

/* ==========================================
   RESET DAILY JOURNEY
========================================== */

export function resetDailyJourney() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DEFAULT_TASKS)
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}