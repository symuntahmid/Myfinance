import { updateStreak } from "./player";
import { unlockAchievement } from "./achievements";
import { t } from "./i18n";

export type DailyTaskTranslationKey =
  | "trackExpense"
  | "reviewSpending"
  | "betterMoneyDecision";

export type DailyTask = {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
  translationKey: DailyTaskTranslationKey;
};

const STORAGE_KEY =
  "myfinance-daily-journey";

const DATE_STORAGE_KEY =
  "myfinance-daily-journey-date";

const STREAK_STORAGE_KEY =
  "myfinance-daily-streak";

const STREAK_HISTORY_KEY =
  "myfinance-streak-history";


/* ==========================================
   DEFAULT TASKS
========================================== */

const DEFAULT_TASKS: Omit<
  DailyTask,
  "title"
>[] = [
  {
    id: 1,
    reward: 15,
    completed: false,
    translationKey: "trackExpense",
  },
  {
    id: 2,
    reward: 10,
    completed: false,
    translationKey: "reviewSpending",
  },
  {
    id: 3,
    reward: 20,
    completed: false,
    translationKey: "betterMoneyDecision",
  },
];


/* ==========================================
   BUILD TASKS WITH CURRENT LANGUAGE
========================================== */

function getTranslatedTasks(
  tasks: Omit<DailyTask, "title">[]
): DailyTask[] {
  return tasks.map((task) => ({
    ...task,
    title: t(task.translationKey),
  }));
}


/* ==========================================
   DATE
========================================== */

function getTodayKey() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}


/* ==========================================
   GET DAILY TASKS
========================================== */

export function getDailyTasks(): DailyTask[] {

  if (typeof window === "undefined") {
    return getTranslatedTasks(
      DEFAULT_TASKS
    );
  }


  const today =
    getTodayKey();


  const savedDate =
    localStorage.getItem(
      DATE_STORAGE_KEY
    );


  /* ------------------------------------------
     NEW DAY
  ------------------------------------------ */

  if (savedDate !== today) {

    resetDailyJourney();

    return getTranslatedTasks(
      DEFAULT_TASKS
    );
  }


  const data =
    localStorage.getItem(
      STORAGE_KEY
    );


  /* ------------------------------------------
     FIRST TIME USER
  ------------------------------------------ */

  if (!data) {

    saveDailyTasks(
      getTranslatedTasks(
        DEFAULT_TASKS
      )
    );

    return getTranslatedTasks(
      DEFAULT_TASKS
    );
  }


  try {

    const savedTasks =
      JSON.parse(data) as Partial<DailyTask>[];


    /* ------------------------------------------
       OLD TASK MIGRATION
    ------------------------------------------ */

    const hasOldTask =
      savedTasks.some(
        (task) =>
          task.title ===
            "Read today's lesson" ||
          task.title ===
            "Save $20"
      );


    if (hasOldTask) {

      resetDailyJourney();

      return getTranslatedTasks(
        DEFAULT_TASKS
      );
    }


    /* ------------------------------------------
       VALIDATE TASK STRUCTURE
    ------------------------------------------ */

    const valid =
      savedTasks.length ===
        DEFAULT_TASKS.length &&
      DEFAULT_TASKS.every(
        (defaultTask) => {

          const task =
            savedTasks.find(
              (savedTask) =>
                savedTask.id ===
                defaultTask.id
            );


          return (
            task &&
            task.translationKey ===
              defaultTask.translationKey &&
            task.reward ===
              defaultTask.reward &&
            typeof task.completed ===
              "boolean"
          );
        }
      );


    if (!valid) {

      resetDailyJourney();

      return getTranslatedTasks(
        DEFAULT_TASKS
      );
    }


    /* ------------------------------------------
       RETURN CURRENT LANGUAGE
    ------------------------------------------ */

    const tasks =
      savedTasks.map(
        (task) => ({
          id:
            task.id as number,

          reward:
            task.reward as number,

          completed:
            task.completed as boolean,

          translationKey:
            task.translationKey as DailyTaskTranslationKey,

          title:
            t(
              task.translationKey as DailyTaskTranslationKey
            ),
        })
      );


    return tasks;

  } catch {

    resetDailyJourney();

    return getTranslatedTasks(
      DEFAULT_TASKS
    );
  }
}


/* ==========================================
   SAVE
========================================== */

export function saveDailyTasks(
  tasks: DailyTask[]
) {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  /*
   * Save the stable task information.
   *
   * The title is NOT used as the source
   * of truth because it depends on language.
   */

  const tasksToSave =
    tasks.map(
      (task) => ({
        id:
          task.id,

        reward:
          task.reward,

        completed:
          task.completed,

        translationKey:
          task.translationKey,
      })
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      tasksToSave
    )
  );


  localStorage.setItem(
    DATE_STORAGE_KEY,
    getTodayKey()
  );


  window.dispatchEvent(
    new Event(
      "dailyJourneyUpdated"
    )
  );


  window.dispatchEvent(
    new Event(
      "player-updated"
    )
  );
}


/* ==========================================
   COMPLETE TASK
========================================== */

export function completeTask(
  id: number
): boolean {

  const tasks =
    getDailyTasks();


  const task =
    tasks.find(
      (task) =>
        task.id === id
    );


  /*
   * Already completed today.
   */

  if (
    !task ||
    task.completed
  ) {
    return false;
  }


  task.completed =
    true;


  const completed =
    tasks.every(
      (task) =>
        task.completed
    );


  /*
   * Update streak when
   * all daily tasks are complete.
   */

  if (completed) {

    updateDailyStreak();
  }


  saveDailyTasks(
    tasks
  );


  return true;
}


/* ==========================================
   PROGRESS
========================================== */

export function getJourneyProgress() {

  const tasks =
    getDailyTasks();


  const completed =
    tasks.filter(
      (task) =>
        task.completed
    ).length;


  return {

    completed,

    total:
      tasks.length,

    percent:
      tasks.length === 0
        ? 0
        : (
            completed /
            tasks.length
          ) * 100,

  };
}


/* ==========================================
   STREAK SYSTEM
========================================== */

function getStreakData() {

  const saved =
    localStorage.getItem(
      STREAK_STORAGE_KEY
    );


  if (!saved) {

    return {
      streak: 0,
      lastCompleted: "",
    };
  }


  return JSON.parse(
    saved
  );
}


function saveStreakData(
  data: {
    streak: number;
    lastCompleted: string;
  }
) {

  localStorage.setItem(
    STREAK_STORAGE_KEY,
    JSON.stringify(data)
  );
}


function updateDailyStreak() {

  const today =
    getTodayKey();


  const history =
    JSON.parse(
      localStorage.getItem(
        STREAK_HISTORY_KEY
      ) || "[]"
    );


  /*
   * Prevent duplicate completion
   * on the same day.
   */

  if (
    history.includes(today)
  ) {
    return;
  }


  history.push(today);


  localStorage.setItem(
    STREAK_HISTORY_KEY,
    JSON.stringify(history)
  );


  let streak =
    1;


  const sortedHistory =
    history.sort(
      (
        a: string,
        b: string
      ) =>
        new Date(b).getTime() -
        new Date(a).getTime()
    );


  for (
    let i = 0;
    i <
      sortedHistory.length - 1;
    i++
  ) {

    const current =
      new Date(
        sortedHistory[i]
      );


    const previous =
      new Date(
        sortedHistory[i + 1]
      );


    const difference =
      (
        current.getTime() -
        previous.getTime()
      ) /
      (
        1000 *
        60 *
        60 *
        24
      );


    if (
      difference === 1
    ) {

      streak++;

    } else {

      break;

    }
  }


  saveStreakData({

    streak,

    lastCompleted:
      today,

  });


  updateStreak(
    streak
  );


  /* ------------------------------------------
     ACHIEVEMENTS
  ------------------------------------------ */

  if (
    streak >= 3
  ) {

    unlockAchievement(4);
  }


  if (
    streak >= 7
  ) {

    unlockAchievement(5);
  }


  if (
    streak >= 30
  ) {

    unlockAchievement(6);
  }
}


/* ==========================================
   RESET DAILY JOURNEY
========================================== */

export function resetDailyJourney() {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const freshTasks =
    getTranslatedTasks(
      DEFAULT_TASKS.map(
        (task) => ({
          ...task,
          completed: false,
        })
      )
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      freshTasks.map(
        (task) => ({
          id:
            task.id,

          reward:
            task.reward,

          completed:
            false,

          translationKey:
            task.translationKey,
        })
      )
    )
  );


  localStorage.setItem(
    DATE_STORAGE_KEY,
    getTodayKey()
  );


  window.dispatchEvent(
    new Event(
      "dailyJourneyUpdated"
    )
  );


  window.dispatchEvent(
    new Event(
      "player-updated"
    )
  );
}