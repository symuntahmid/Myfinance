/* ==========================================
   LIFE GOALS + FINANCIAL FREEDOM NUMBER

   Life goals: big things a person wants in life,
   each with an amount (and an optional year).

   Freedom number: monthly living cost x 12 x 25.
   (The "4% rule": with 25 years of costs saved,
   the money can pay for life.)
========================================== */

export type LifeGoal = {
  id: string;
  title: string;
  amount: number;
  year?: number;
  emoji: string;
};

const GOALS_KEY = "myfinance-life-goals";
const FREEDOM_KEY = "myfinance-freedom";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = localStorage.getItem(key);

    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lifeGoalsUpdated"));
}

export function getLifeGoals(): LifeGoal[] {
  const goals = read<LifeGoal[]>(GOALS_KEY, []);

  return Array.isArray(goals) ? goals : [];
}

export function addLifeGoal(goal: Omit<LifeGoal, "id">) {
  write(GOALS_KEY, [
    ...getLifeGoals(),
    { ...goal, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
  ]);
}

export function removeLifeGoal(id: string) {
  write(
    GOALS_KEY,
    getLifeGoals().filter((item) => item.id !== id)
  );
}

export function getMonthlyCost(): number {
  return Number(read<{ monthlyCost?: number }>(FREEDOM_KEY, {}).monthlyCost) || 0;
}

export function saveMonthlyCost(value: number) {
  write(FREEDOM_KEY, { monthlyCost: Math.max(0, value) });
}

export function freedomNumber(monthlyCost: number): number {
  return Math.round(monthlyCost * 12 * 25);
}

export const GOAL_EMOJIS = ["🏠", "🕋", "🎓", "💍", "🚗", "✈️", "👨‍👩‍👧", "🏖️", "💼", "⭐"];
