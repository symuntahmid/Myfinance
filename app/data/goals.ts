export type Goal = {
  id: string;

  title: string;

  emoji: string;

  targetAmount: number;

  savedAmount: number;

  targetDate: string;

  createdAt: string;
};

const STORAGE_KEY = "myfinance-goals";

export function getGoals(): Goal[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

export function saveGoals(goals: Goal[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(goals)
  );

  window.dispatchEvent(
    new CustomEvent("goalsUpdated")
  );
}

export function addGoal(goal: Goal) {
  const goals = getGoals();

  goals.unshift(goal);

  saveGoals(goals);
}

export function updateGoal(goal: Goal) {
  const goals = getGoals().map((g) =>
    g.id === goal.id ? goal : g
  );

  saveGoals(goals);
}

export function deleteGoal(id: string) {
  const goals = getGoals().filter(
    (g) => g.id !== id
  );

  saveGoals(goals);
}