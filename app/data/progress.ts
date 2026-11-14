/* ==========================================
   PROGRESS

   Four numbers that show whether a person is
   really getting ahead:

   1. Money kept          (income minus spending)
   2. Savings rate        (and its direction)
   3. Safety runway       (months of spending in cash)
   4. Independence        (how much of spending the
                           investments could pay for)
========================================== */

import { getTransactions } from "@/app/data/transactions";
import { getNetWorthNow } from "@/app/data/overview";

export const WINDOW_MONTHS = 6;
export const RATE_TARGET = 20;
export const RUNWAY_TARGET = 6;
export const WITHDRAW_RATE = 0.04;

export type MonthRow = {
  year: number;
  month: number;
  income: number;
  expense: number;
  invested: number;
  kept: number;
};

export type Progress = {
  hasData: boolean;
  months: MonthRow[];
  cumulative: number[];
  keptTotal: number;
  rates: number[];
  rateNow: number | null;
  ratePrev: number | null;
  avgSpend: number | null;
  cash: number;
  runway: number | null;
  investments: number;
  coverage: number | null;
};

function rateOf(rows: MonthRow[]): number | null {
  const income = rows.reduce((sum, row) => sum + row.income, 0);

  if (income <= 0) return null;

  const kept = rows.reduce((sum, row) => sum + row.kept, 0);

  return Math.round((kept / income) * 100);
}

export function buildProgress(now: Date = new Date()): Progress {
  const all = getTransactions().filter(
    (item) =>
      item.amount > 0 && !Number.isNaN(new Date(item.date).getTime())
  );

  const rows: MonthRow[] = [];

  for (let back = WINDOW_MONTHS - 1; back >= 0; back -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - back, 1);

    const list = all.filter((item) => {
      const when = new Date(item.date);

      return (
        when.getFullYear() === date.getFullYear() &&
        when.getMonth() === date.getMonth()
      );
    });

    const add = (type: string) =>
      list
        .filter((item) => item.type === type)
        .reduce((sum, item) => sum + item.amount, 0);

    const income = add("Income");
    const expense = add("Expense");
    const invested = add("Investment");

    rows.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      income,
      expense,
      invested,
      kept: income - expense - invested,
    });
  }

  // Start from the first month that has any activity.
  const first = rows.findIndex(
    (row) => row.income || row.expense || row.invested
  );

  const months = first === -1 ? [] : rows.slice(first);

  let running = 0;

  const cumulative = months.map((row) => {
    running += row.kept;

    return running;
  });

  /* Savings rate: last 3 months vs the 3 before. */

  const recent = months.slice(-3);
  const before = months.slice(-6, -3);

  /* Average monthly spending: completed months first. */

  const completed = months
    .slice(0, -1)
    .filter((row) => row.expense > 0)
    .slice(-3);

  const current = months[months.length - 1];

  const avgSpend =
    completed.length > 0
      ? completed.reduce((sum, row) => sum + row.expense, 0) /
        completed.length
      : current && current.expense > 0
        ? current.expense
        : null;

  const worth = getNetWorthNow();
  const cash = Math.max(worth.accounts, 0);
  const investments = Math.max(worth.investments, 0);

  return {
    hasData: months.length > 0,
    months,
    cumulative,
    keptTotal: running,
    rates: months.map((row) =>
      row.income > 0 ? Math.round((row.kept / row.income) * 100) : 0
    ),
    rateNow: rateOf(recent),
    ratePrev: before.length > 0 ? rateOf(before) : null,
    avgSpend,
    cash,
    runway:
      avgSpend && cash > 0 ? Math.round((cash / avgSpend) * 10) / 10 : null,
    investments,
    coverage:
      avgSpend && investments > 0
        ? Math.round(((investments * WITHDRAW_RATE) / 12 / avgSpend) * 100)
        : null,
  };
}
