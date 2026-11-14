/* ==========================================
   CASH FLOW

   Turns transactions into a flow:
   where money comes from  ->  where it goes.

   Left side : income sources (+ "from savings"
               when spending is more than income)
   Right side: expense categories, money invested,
               and money kept (savings)
========================================== */

import { getTransactions } from "@/app/data/transactions";

export type CashFlowRange =
  | "thisMonth"
  | "lastMonth"
  | "threeMonths"
  | "year";

export type FlowItem = {
  key: string;
  raw: string;
  amount: number;
  count: number;
};

export type CashFlow = {
  totalIn: number;
  sources: FlowItem[];
  expenses: FlowItem[];
  invested: number;
  saved: number;
  shortfall: number;
};

const MAX_ITEMS = 5;

function rangeBounds(range: CashFlowRange): [Date, Date] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (range) {
    case "lastMonth":
      return [
        new Date(year, month - 1, 1),
        new Date(year, month, 1),
      ];
    case "threeMonths":
      return [
        new Date(year, month - 2, 1),
        new Date(year, month + 1, 1),
      ];
    case "year":
      return [new Date(year, 0, 1), new Date(year + 1, 0, 1)];
    default:
      return [
        new Date(year, month, 1),
        new Date(year, month + 1, 1),
      ];
  }
}

function group(
  entries: { raw: string; amount: number }[]
): FlowItem[] {
  const map = new Map<string, FlowItem>();

  entries.forEach((entry) => {
    const found = map.get(entry.raw);

    if (found) {
      found.amount += entry.amount;
      found.count += 1;
    } else {
      map.set(entry.raw, {
        key: entry.raw,
        raw: entry.raw,
        amount: entry.amount,
        count: 1,
      });
    }
  });

  const sorted = [...map.values()].sort(
    (a, b) => b.amount - a.amount
  );

  if (sorted.length <= MAX_ITEMS) return sorted;

  const rest = sorted.slice(MAX_ITEMS - 1);

  return [
    ...sorted.slice(0, MAX_ITEMS - 1),
    {
      key: "__other",
      raw: "__other",
      amount: rest.reduce((sum, item) => sum + item.amount, 0),
      count: rest.reduce((sum, item) => sum + item.count, 0),
    },
  ];
}

export function buildCashFlow(range: CashFlowRange): CashFlow {
  const [from, to] = rangeBounds(range);

  const items = getTransactions().filter((item) => {
    const date = new Date(item.date);

    return (
      !Number.isNaN(date.getTime()) &&
      date >= from &&
      date < to &&
      item.amount > 0
    );
  });

  const income = items.filter((item) => item.type === "Income");
  const expense = items.filter((item) => item.type === "Expense");
  const investment = items.filter(
    (item) => item.type === "Investment"
  );

  const incomeTotal = income.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = expense.reduce((sum, item) => sum + item.amount, 0);
  const invested = investment.reduce((sum, item) => sum + item.amount, 0);

  const kept = incomeTotal - expenseTotal - invested;

  return {
    totalIn: Math.max(incomeTotal, expenseTotal + invested),
    sources: group(
      income.map((item) => ({
        raw: item.category?.trim() || item.source?.trim() || "Income",
        amount: item.amount,
      }))
    ),
    expenses: group(
      expense.map((item) => ({
        raw: item.category?.trim() || "📦 Others",
        amount: item.amount,
      }))
    ),
    invested,
    saved: Math.max(kept, 0),
    shortfall: Math.max(-kept, 0),
  };
}
