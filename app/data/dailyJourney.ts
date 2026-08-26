import { updateStreak } from "./player";
import { unlockAchievement } from "./achievements";

export type DailyTask = {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
};

const STORAGE_KEY = "myfinance-daily-journey";
const DATE_STORAGE_KEY = "myfinance-daily-journey-date";
const STREAK_STORAGE_KEY =
  "myfinance-daily-streak";

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
    return DEFAULT_TASKS;
  }

  const today = getTodayKey();

  const savedDate = localStorage.getItem(
    DATE_STORAGE_KEY
  );

  /*
   * ------------------------------------------
   * NEW DAY
   * ------------------------------------------
   *
   * If the stored date is different from today,
   * start a fresh Daily Journey.
   */

  if (savedDate !== today) {
    resetDailyJourney();

    return DEFAULT_TASKS.map((task) => ({
      ...task,
    }));
  }

  const data = localStorage.getItem(
    STORAGE_KEY
  );

  /*
   * First-time user.
   */

  if (!data) {
    saveDailyTasks(DEFAULT_TASKS);

    localStorage.setItem(
      DATE_STORAGE_KEY,
      today
    );

    return DEFAULT_TASKS.map((task) => ({
      ...task,
    }));
  }

  try {
    const tasks = JSON.parse(
      data
    ) as DailyTask[];

    /*
     * ------------------------------------------
     * OLD TASK MIGRATION
     * ------------------------------------------
     */

    const hasOldTask = tasks.some(
      (task) =>
        task.title === "Read today's lesson" ||
        task.title === "Save $20"
    );

    if (hasOldTask) {
      resetDailyJourney();

      return DEFAULT_TASKS.map((task) => ({
        ...task,
      }));
    }

    /*
     * ------------------------------------------
     * VALIDATE CURRENT STRUCTURE
     * ------------------------------------------
     */

    const valid =
      tasks.length ===
        DEFAULT_TASKS.length &&
      DEFAULT_TASKS.every(
        (defaultTask) => {
          const task = tasks.find(
            (t) =>
              t.id === defaultTask.id
          );

          return (
            task &&
            task.title ===
              defaultTask.title &&
            typeof task.reward ===
              "number" &&
            typeof task.completed ===
              "boolean"
          );
        }
      );

    if (!valid) {
      resetDailyJourney();

      return DEFAULT_TASKS.map((task) => ({
        ...task,
      }));
    }

    return tasks;
  } catch {
    resetDailyJourney();

    return DEFAULT_TASKS.map((task) => ({
      ...task,
    }));
  }
}

/* ==========================================
   SAVE
========================================== */

export function saveDailyTasks(
  tasks: DailyTask[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

  /*
   * Make sure today's date is recorded.
   */

  localStorage.setItem(
    DATE_STORAGE_KEY,
    getTodayKey()
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


  /*
   * Already completed today.
   */

  if (!task || task.completed) {
    return false;
  }



  task.completed = true;



  const completed =
    tasks.every(
      (task) => task.completed
    );



  /*
   * Update streak BEFORE
   * notifying the UI.
   */

  if (completed) {

    updateDailyStreak();

  }



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

  return JSON.parse(saved);

}



function saveStreakData(data:any){

  localStorage.setItem(
    STREAK_STORAGE_KEY,
    JSON.stringify(data)
  );

}



function updateDailyStreak(){

  const today =
    getTodayKey();


  const data =
    getStreakData();



  if(
    data.lastCompleted === today
  ){
    return;
  }



  const yesterday =
    new Date();


  yesterday.setDate(
    yesterday.getDate() - 1
  );


  const yesterdayKey =
    [
      yesterday.getFullYear(),
      String(
        yesterday.getMonth()+1
      ).padStart(2,"0"),
      String(
        yesterday.getDate()
      ).padStart(2,"0"),
    ].join("-");



  if(
    data.lastCompleted === yesterdayKey
  ){

    data.streak += 1;

  }
  else{

    data.streak = 1;

  }



  data.lastCompleted = today;



  saveStreakData(data);



  updateStreak(
    data.streak
  );



  // Achievements

  if(data.streak >= 3){

    unlockAchievement(4);

  }


  if(data.streak >= 7){

    unlockAchievement(5);

  }


  if(data.streak >= 30){

    unlockAchievement(6);

  }


}


/* ==========================================
   RESET DAILY JOURNEY
========================================== */

export function resetDailyJourney() {
  if (typeof window === "undefined") {
    return;
  }

  const freshTasks = DEFAULT_TASKS.map(
    (task) => ({
      ...task,
      completed: false,
    })
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(freshTasks)
  );

  localStorage.setItem(
    DATE_STORAGE_KEY,
    getTodayKey()
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}