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

/* =====================================================
   GOAL MATHS (days, status, pace)
===================================================== */

export type GoalStatus = "done" | "late" | "ahead" | "onTrack" | "risk" | "new";

export type GoalPlan = {
  daysLeft: number | null; // null = no usable date
  perMonth: number; // 0 when due within a month or done
  dueTotal: number; // money still needed
  status: GoalStatus;
  finish: Date | null; // when it ends at the current saving pace
};

const DAY_MS = 86_400_000;

// A yyyy-mm-dd date as local midnight (new Date("yyyy-mm-dd") would be UTC).
function localDay(text: string): Date | null {
  const [y, m, d] = (text || "").slice(0, 10).split("-").map(Number);

  if (!y || !m || !d) return null;

  return new Date(y, m - 1, d);
}

export function goalPlan(goal: Goal, now: Date = new Date()): GoalPlan {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = localDay(goal.targetDate);
  const start = localDay(goal.createdAt.slice(0, 10)) ?? today;
  const left = Math.max(goal.targetAmount - goal.savedAmount, 0);

  if (!end) {
    return { daysLeft: null, perMonth: 0, dueTotal: left, status: left === 0 ? "done" : "new", finish: null };
  }

  const daysLeft = Math.round((end.getTime() - today.getTime()) / DAY_MS);

  if (left === 0) return { daysLeft, perMonth: 0, dueTotal: 0, status: "done", finish: null };
  if (daysLeft < 0) return { daysLeft, perMonth: 0, dueTotal: left, status: "late", finish: null };

  // Whole months only when there is more than a month to go.
  const perMonth = daysLeft > 31 ? Math.ceil(left / (daysLeft / 30.4375)) : 0;

  // Straight-line: how much should be saved by today.
  const total = Math.max((end.getTime() - start.getTime()) / DAY_MS, 1);
  const elapsed = Math.max((today.getTime() - start.getTime()) / DAY_MS, 0);
  const expected = goal.targetAmount * Math.min(elapsed / total, 1);

  let status: GoalStatus = "onTrack";

  if (elapsed < 3) status = "new";
  else if (goal.savedAmount >= expected * 1.1) status = "ahead";
  else if (goal.savedAmount >= expected * 0.9) status = "onTrack";
  else status = "risk";

  // When it would finish at the pace so far.
  let finish: Date | null = null;

  if (goal.savedAmount > 0 && elapsed >= 7) {
    const pace = goal.savedAmount / elapsed; // money per day
    const days = Math.ceil(left / pace);

    if (days < 365 * 40) finish = new Date(today.getTime() + days * DAY_MS);
  }

  return { daysLeft, perMonth, dueTotal: left, status, finish };
}
