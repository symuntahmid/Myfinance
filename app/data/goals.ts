export type Goal = {
  id: string;

  title: string;

  targetAmount: number;

  savedAmount: number;

  targetDate?: string;

  emoji?: string;

  icon?: string;

  color?: string;

  completed: boolean;

  createdAt: string;

  notes?: string;
};

const STORAGE_KEY = "myfinance-goals";

/* ==========================================
   STORAGE
========================================== */

export function getGoals(): Goal[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  return JSON.parse(saved);
}

export function saveGoals(goals: Goal[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(goals)
  );

  window.dispatchEvent(
    new Event("goalsUpdated")
  );
}

/* ==========================================
   CRUD
========================================== */

export function addGoal(goal: Goal) {
  const goals = getGoals();

  goals.unshift(goal);

  saveGoals(goals);
}

export function updateGoal(updatedGoal: Goal) {
  const goals = getGoals().map((goal) =>
    goal.id === updatedGoal.id
      ? updatedGoal
      : goal
  );

  saveGoals(goals);
}

export function deleteGoal(id: string) {
  const goals = getGoals().filter(
    (goal) => goal.id !== id
  );

  saveGoals(goals);
}

export function clearGoals() {
  saveGoals([]);
}

/* ==========================================
   SUMMARY
========================================== */

export function getGoalSummary() {
  const goals = getGoals();

  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const totalTarget = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.savedAmount,
    0
  );

  const overallProgress =
    totalTarget === 0
      ? 0
      : (totalSaved / totalTarget) * 100;

  return {
    totalGoals,

    completedGoals,

    totalTarget,

    totalSaved,

    overallProgress,
  };
}