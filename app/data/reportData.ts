/* ==========================================
   MONTH REPORT

   Plain numbers for one month, worked out from
   the entries. Kept apart from the screen.
========================================== */

import { getTransactions, type Transaction } from "@/app/data/transactions";

export type MonthReport = {
  month: string; // yyyy-mm
  days: number;
  income: number;
  spent: number;
  invested: number;
  kept: number; // income - spent
  keptPct: number | null; // null when there is no income
  categories: { raw: string; amount: number; pct: number }[];
  daily: number[]; // spending for day 1..days
  biggestDay: { day: number; amount: number } | null;
  biggest: { raw: string; amount: number } | null;
  avgPerDay: number;
  noSpendDays: number;
  entries: Transaction[];
  hasData: boolean;
};

export const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split("-").map(Number);

  return monthKey(new Date(y, m - 1 + by, 1));
}

// The entry's own calendar day, with no time-zone drift.
function dayKey(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);

  const d = new Date(date);

  return Number.isNaN(d.getTime())
    ? ""
    : `${monthKey(d)}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildMonthReport(
  month: string,
  now: Date = new Date()
): MonthReport {
  const [y, m] = month.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();

  const entries = getTransactions()
    .filter((item) => dayKey(item.date).startsWith(month))
    .sort(
      (a, b) =>
        dayKey(b.date).localeCompare(dayKey(a.date)) || b.id - a.id
    );

  const sum = (type: Transaction["type"]) =>
    entries
      .filter((item) => item.type === type)
      .reduce((total, item) => total + item.amount, 0);

  const income = sum("Income");
  const spent = sum("Expense");
  const invested = sum("Investment");

  const byCategory = new Map<string, number>();
  const daily = Array.from({ length: days }, () => 0);

  entries
    .filter((item) => item.type === "Expense")
    .forEach((item) => {
      const raw = item.category?.trim() || "📦 Others";

      byCategory.set(raw, (byCategory.get(raw) ?? 0) + item.amount);

      const day = Number(dayKey(item.date).slice(8, 10));

      if (day >= 1 && day <= days) daily[day - 1] += item.amount;
    });

  const categories = [...byCategory.entries()]
    .map(([raw, amount]) => ({
      raw,
      amount,
      pct: spent > 0 ? Math.round((amount / spent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const peak = daily.reduce(
    (best, value, index) => (value > best.amount ? { day: index + 1, amount: value } : best),
    { day: 0, amount: 0 }
  );

  // Days that have passed so far (the whole month if it is over).
  const isNow = month === monthKey(now);
  const passed = isNow ? now.getDate() : month > monthKey(now) ? 0 : days;

  const noSpendDays = daily
    .slice(0, passed)
    .filter((value) => value === 0).length;

  return {
    month,
    days,
    income,
    spent,
    invested,
    kept: income - spent,
    keptPct: income > 0 ? Math.round(((income - spent) / income) * 100) : null,
    categories,
    daily,
    biggestDay: peak.amount > 0 ? peak : null,
    biggest: categories[0] ? { raw: categories[0].raw, amount: categories[0].amount } : null,
    avgPerDay: passed > 0 ? spent / passed : 0,
    noSpendDays,
    entries,
    hasData: entries.length > 0,
  };
}

/* CSV text for a month, ready to save. */
export function reportCsv(report: MonthReport): string {
  const esc = (value: string | number | undefined) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = report.entries.map((item) =>
    [
      dayKey(item.date),
      item.type,
      item.category,
      item.source,
      item.amount,
      item.note,
    ]
      .map(esc)
      .join(",")
  );

  return ["date,type,category,account,amount,note", ...rows].join("\n");
}
