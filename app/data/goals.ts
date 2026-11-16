export type Goal = {
  id: string;

  title: string;

  emoji: string;

  targetAmount: number;

  savedAmount: number;

  targetDate: string;

  createdAt: string;

  // Chosen by the person. Old goals have none: we work it out from the date.
  term?: GoalTerm;

  // Set when the goal was made from a festival plan (Eid, Qurbani...)
  occasion?: string;
};

export type GoalTerm = "short" | "medium" | "long";

export const GOAL_TERMS: GoalTerm[] = ["short", "medium", "long"];

/* Whole months from today to a yyyy-mm-dd date. null = no usable date. */
export function monthsLeft(date: string, now: Date = new Date()): number | null {
  const end = new Date(date);

  if (!date || Number.isNaN(end.getTime())) return null;

  return (
    (end.getFullYear() - now.getFullYear()) * 12 +
    (end.getMonth() - now.getMonth())
  );
}

/* Under 1 year = short, 1 to 5 years = medium, over 5 years = long. */
export function termFromDate(date: string): GoalTerm {
  const months = monthsLeft(date);

  if (months === null) return "medium";
  if (months <= 12) return "short";
  if (months <= 60) return "medium";

  return "long";
}

export function termOf(goal: Goal): GoalTerm {
  return goal.term ?? termFromDate(goal.targetDate);
}


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

export function addMoneyToGoal(
  goalId: string,
  amount: number
) {
  const goals = getGoals();

  const updatedGoals = goals.map((goal) => {
    if (goal.id !== goalId) return goal;

    return {
      ...goal,
      savedAmount: goal.savedAmount + amount,
    };
  });

  saveGoals(updatedGoals);
}
export function withdrawMoneyFromGoal(
  id: string,
  amount: number
) {
  const goals = getGoals().map((goal) => {
    if (goal.id !== id) return goal;

    return {
      ...goal,
      savedAmount: Math.max(
        goal.savedAmount - amount,
        0
      ),
    };
  });

  saveGoals(goals);
}