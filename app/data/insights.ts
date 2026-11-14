/* ==========================================
   INSIGHTS

   Turns transactions into a few meaningful facts
   about this month, always compared with something
   the person can feel: last month, a goal, or the
   days left.
========================================== */

import { getTransactions, type Transaction } from "@/app/data/transactions";

export const SAVING_GOAL_PERCENT = 20;

export type CategoryMove = {
  raw: string;
  now: number;
  before: number;
  delta: number;
};

export type MonthKept = {
  year: number;
  month: number;
  kept: number;
};

export type Insights = {
  hasData: boolean;
  income: number;
  expense: number;
  invested: number;
  kept: number;
  rate: number;
  lastExpense: number;
  day: number;
  daysInMonth: number;
  daysLeft: number;
  projected: number | null;
  perDay: number | null;
  noSpendDays: number;
  spendDays: number[];
  topCategory: { raw: string; amount: number; share: number } | null;
  biggest: { raw: string; amount: number } | null;
  movers: CategoryMove[];
  months: MonthKept[];
};

function inMonth(item: Transaction, year: number, month: number): boolean {
  const date = new Date(item.date);

  return date.getFullYear() === year && date.getMonth() === month;
}

function sum(items: Transaction[], type: Transaction["type"]): number {
  return items
    .filter((item) => item.type === type)
    .reduce((total, item) => total + item.amount, 0);
}

function byCategory(items: Transaction[]): Map<string, number> {
  const map = new Map<string, number>();

  items
    .filter((item) => item.type === "Expense")
    .forEach((item) => {
      const key = item.category?.trim() || "📦 Others";

      map.set(key, (map.get(key) ?? 0) + item.amount);
    });

  return map;
}

export function buildInsights(now: Date = new Date()): Insights {
  const all = getTransactions().filter(
    (item) =>
      item.amount > 0 && !Number.isNaN(new Date(item.date).getTime())
  );

  const year = now.getFullYear();
  const month = now.getMonth();

  const current = all.filter((item) => inMonth(item, year, month));
  const previous = all.filter((item) => inMonth(item, year, month - 1));

  const income = sum(current, "Income");
  const expense = sum(current, "Expense");
  const invested = sum(current, "Investment");
  const kept = income - expense - invested;

  const day = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysLeft = daysInMonth - day;

  /* Pace: only once there are a few days of data. */

  const projected =
    day >= 3 && expense > 0
      ? Math.round((expense / day) * daysInMonth)
      : null;

  const remaining = income - expense - invested;

  const perDay =
    income > 0 && daysLeft > 0 && remaining > 0
      ? Math.floor(remaining / daysLeft)
      : null;

  /* Days with no spending (today does not count yet). */

  const spendDays = new Set(
    current
      .filter((item) => item.type === "Expense")
      .map((item) => new Date(item.date).getDate())
  );

  let noSpendDays = 0;

  if (all.length > 0) {
    for (let d = 1; d < day; d += 1) {
      if (!spendDays.has(d)) noSpendDays += 1;
    }
  }

  /* Categories */

  const nowCategories = byCategory(current);
  const beforeCategories = byCategory(previous);

  let topCategory: Insights["topCategory"] = null;

  nowCategories.forEach((amount, raw) => {
    if (!topCategory || amount > topCategory.amount) {
      topCategory = {
        raw,
        amount,
        share: expense > 0 ? Math.round((amount / expense) * 100) : 0,
      };
    }
  });

  const movers: CategoryMove[] = [];

  new Set([...nowCategories.keys(), ...beforeCategories.keys()]).forEach(
    (raw) => {
      const nowValue = nowCategories.get(raw) ?? 0;
      const before = beforeCategories.get(raw) ?? 0;

      if (before > 0 && nowValue !== before) {
        movers.push({
          raw,
          now: nowValue,
          before,
          delta: nowValue - before,
        });
      }
    }
  );

  movers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const biggestItem = current
    .filter((item) => item.type === "Expense")
    .sort((a, b) => b.amount - a.amount)[0];

  /* Last six months of money kept. */

  const months: MonthKept[] = [];

  for (let back = 5; back >= 0; back -= 1) {
    const date = new Date(year, month - back, 1);

    const list = all.filter((item) =>
      inMonth(item, date.getFullYear(), date.getMonth())
    );

    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      kept:
        sum(list, "Income") - sum(list, "Expense") - sum(list, "Investment"),
    });
  }

  return {
    hasData: current.length > 0 || previous.length > 0,
    income,
    expense,
    invested,
    kept,
    rate: income > 0 ? Math.round((kept / income) * 100) : 0,
    lastExpense: sum(previous, "Expense"),
    day,
    daysInMonth,
    daysLeft,
    projected,
    perDay,
    noSpendDays,
    spendDays: [...spendDays],
    topCategory,
    biggest: biggestItem
      ? {
          raw:
            biggestItem.note?.trim() ||
            biggestItem.category?.trim() ||
            "📦 Others",
          amount: biggestItem.amount,
        }
      : null,
    movers: movers.slice(0, 3),
    months,
  };
}
