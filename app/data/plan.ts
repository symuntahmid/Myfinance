/* ==========================================
   MONTHLY PLAN (YNAB style: "give every taka a job")

   Ready to assign = money in your accounts
                   - money already given a job.

   Each category, for a month:
     available = what was left over from last month
               + assigned this month
               - spent this month

   Left-over money rolls into next month. If a category is
   overspent, it starts again from 0 next month and that
   money is simply gone from "Ready to assign".
========================================== */

import { quickExpenseCategories } from "./quickAdd";

export const PLAN_KEY = "myfinance-plan";

// { "2026-11": { "🍔 Food": 3000 } }
export type PlanData = Record<string, Record<string, number>>;

export type PlanRow = {
  category: string;
  assigned: number;
  spent: number;
  available: number;
};

export type PlanResult = {
  rows: PlanRow[];
  readyToAssign: number;
  totalAssigned: number;
  totalSpent: number;
};

type PlanTransaction = {
  type: string;
  category?: string;
  amount: number;
  date: string;
};


/* ==========================================
   MONTH HELPERS ("yyyy-mm")
========================================== */

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function shiftMonth(month: string, by: number): string {
  const [year, m] = month.split("-").map(Number);
  const index = year * 12 + (m - 1) + by;

  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}


/* ==========================================
   CALCULATION
========================================== */

export function computePlan(input: {
  month: string;
  plan: PlanData;
  transactions: PlanTransaction[];
  totalBalance: number;
}): PlanResult {
  const { month, plan, transactions, totalBalance } = input;

  const expenses = transactions.filter(
    (item) => item.type === "Expense" && item.category
  );

  // Every category we know about: the Quick Add ones, anything
  // the user planned, and anything they actually spent on.
  const categories = new Set<string>(
    quickExpenseCategories.map((item) => item.value)
  );

  Object.values(plan).forEach((month_) =>
    Object.keys(month_).forEach((key) => categories.add(key))
  );

  expenses.forEach((item) => categories.add(item.category as string));

  // Start from the earliest month that has anything in it.
  const months = [
    ...Object.keys(plan),
    ...expenses.map((item) => monthOf(item.date)),
    month,
  ].sort();

  let cursor = months[0] < month ? months[0] : month;

  const carry: Record<string, number> = {};

  let rows: PlanRow[] = [];

  for (let guard = 0; guard < 600; guard++) {
    rows = Array.from(categories).map((category) => {
      const assigned = plan[cursor]?.[category] ?? 0;

      const spent = expenses
        .filter(
          (item) =>
            item.category === category &&
            monthOf(item.date) === cursor
        )
        .reduce((sum, item) => sum + item.amount, 0);

      const available = round2(
        (carry[category] ?? 0) + assigned - spent
      );

      return { category, assigned, spent, available };
    });

    if (cursor === month) break;

    rows.forEach((row) => {
      carry[row.category] = Math.max(row.available, 0);
    });

    cursor = shiftMonth(cursor, 1);
  }

  const given = rows.reduce(
    (sum, row) => sum + Math.max(row.available, 0),
    0
  );

  rows.sort(
    (a, b) =>
      b.assigned - a.assigned ||
      b.spent - a.spent ||
      a.category.localeCompare(b.category)
  );

  return {
    rows,
    readyToAssign: round2(totalBalance - given),
    totalAssigned: round2(
      rows.reduce((sum, row) => sum + row.assigned, 0)
    ),
    totalSpent: round2(
      rows.reduce((sum, row) => sum + row.spent, 0)
    ),
  };
}


/* ==========================================
   STORAGE
========================================== */

export function getPlan(): PlanData {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(
      localStorage.getItem(PLAN_KEY) || "{}"
    );

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePlan(plan: PlanData) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  window.dispatchEvent(new Event("planUpdated"));
}

export function setAssigned(
  month: string,
  category: string,
  amount: number
) {
  const plan = getPlan();

  const next = { ...(plan[month] ?? {}) };

  if (amount > 0) {
    next[category] = round2(amount);
  } else {
    delete next[category];
  }

  savePlan({ ...plan, [month]: next });
}

// Copy last month's amounts into this month (this month's own
// amounts are kept where they already exist).
export function copyFromPreviousMonth(month: string) {
  const plan = getPlan();
  const previous = plan[shiftMonth(month, -1)] ?? {};

  savePlan({
    ...plan,
    [month]: { ...previous, ...(plan[month] ?? {}) },
  });
}
