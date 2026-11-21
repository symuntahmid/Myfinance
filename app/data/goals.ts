import { getAccounts, getBalances } from "./accounts";

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

  // Where the money is kept. When set, the saved amount is that account's balance.
  // Without it, the person updates the saved amount by hand.
  accountId?: string;
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

// What is stored: linked goals keep an old copy of the saved amount here.
function getStoredGoals(): Goal[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

// Goals as the app shows them. A goal linked to an account shows that account's
// balance as its saved amount, so it always matches the real money.
export function getGoals(): Goal[] {
  const stored = getStoredGoals();

  if (!stored.some((goal) => goal.accountId)) return stored;

  const accounts = getAccounts();
  const balances = getBalances();

  return stored.map((goal) => {
    const account = goal.accountId ? accounts.find((item) => item.id === goal.accountId) : undefined;

    if (!account) return goal;

    return { ...goal, savedAmount: Math.max(balances[account.id] ?? 0, 0) };
  });
}

// True when the goal follows an account that still exists.
export function isLinked(goal: Goal): boolean {
  return !!goal.accountId && getAccounts().some((item) => item.id === goal.accountId);
}

// Money in goals that is NOT inside an account (so net worth adds it on top of the accounts).
export function goalsHeldOutside(goals: Goal[] = getGoals()): number {
  return goals
    .filter((goal) => !isLinked(goal))
    .reduce((sum, goal) => sum + (Number(goal.savedAmount) || 0), 0);
}

// Set the saved amount by hand (goals that are not linked to an account).
export function setGoalSaved(id: string, value: number) {
  saveGoals(
    getStoredGoals().map((goal) =>
      goal.id === id ? { ...goal, savedAmount: Math.max(0, value) } : goal
    )
  );
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
  const goals = getStoredGoals();

  goals.unshift(goal);

  saveGoals(goals);
}

export function updateGoal(goal: Goal) {
  const goals = getStoredGoals().map((g) =>
    g.id === goal.id ? goal : g
  );

  saveGoals(goals);
}

export function deleteGoal(id: string) {
  const goals = getStoredGoals().filter(
    (g) => g.id !== id
  );

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
