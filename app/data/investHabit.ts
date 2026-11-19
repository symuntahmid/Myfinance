import { getTransactions } from "./transactions";
import { monthOfDate } from "@/app/utils/date";

const TARGET_KEY = "myfinance-invest-target";

export function getMonthlyTarget(): number {
  try {
    return Number(localStorage.getItem(TARGET_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function setMonthlyTarget(value: number) {
  try {
    localStorage.setItem(TARGET_KEY, String(Math.max(0, Math.round(value))));
    window.dispatchEvent(new Event("investmentsUpdated"));
  } catch {}
}

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export type Habit = {
  thisMonth: number; // money put into investments this month
  streak: number; // months in a row with at least one deposit
};

export function getHabit(now: Date = new Date()): Habit {
  const byMonth = new Map<string, number>();

  getTransactions()
    .filter((tx) => tx.type === "Investment")
    .forEach((tx) => {
      const key = monthOfDate(tx.date);

      byMonth.set(key, (byMonth.get(key) ?? 0) + tx.amount);
    });

  const current = monthKey(now);
  const thisMonth = byMonth.get(current) ?? 0;

  // Count back from this month. A month still in progress does not break the streak.
  let streak = 0;
  let cursor = new Date(now.getFullYear(), now.getMonth(), 1);

  if (!byMonth.get(current)) cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);

  while (byMonth.get(monthKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
  }

  return { thisMonth, streak };
}

const MILESTONES = [
  10_000, 25_000, 50_000, 100_000, 150_000, 250_000, 500_000, 1_000_000, 2_500_000,
  5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000,
];

export function nextMilestone(value: number): { target: number; pct: number } {
  const target = MILESTONES.find((m) => m > value) ?? Math.ceil((value + 1) / 100_000_000) * 100_000_000;
  const before = [...MILESTONES].reverse().find((m) => m <= value) ?? 0;

  return { target, pct: Math.round(((value - before) / (target - before)) * 100) };
}

// Whole months between two ISO dates (at least 0).
export function monthsBetween(from: string, to: Date = new Date()): number {
  const start = new Date(from);

  if (Number.isNaN(start.getTime())) return 0;

  return Math.max(
    0,
    (to.getFullYear() - start.getFullYear()) * 12 + (to.getMonth() - start.getMonth())
  );
}

export const STALE_DAYS = 30;

export function daysSince(iso: string | undefined, fallback: string, now: Date = new Date()): number {
  const time = Date.parse(iso || fallback);

  if (Number.isNaN(time)) return 0;

  return Math.max(0, Math.floor((now.getTime() - time) / 86_400_000));
}
