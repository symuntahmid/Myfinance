"use client";

import { getTransactions } from "../data/transactions";

export default function SpendingInsights() {
  const transactions = getTransactions();

  const expenses = transactions.filter(
    (t) => t.type === "Expense"
  );

  const income = transactions.filter(
    (t) => t.type === "Income"
  );

  const totalIncome = income.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const totalExpense = expenses.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const savingRate =
    totalIncome === 0
      ? 0
      : ((totalIncome - totalExpense) /
          totalIncome) *
        100;

  // Biggest Expense Category

  const expenseCategory: Record<string, number> =
    {};

  expenses.forEach((t) => {
    const category = t.category || "Other";

    expenseCategory[category] =
      (expenseCategory[category] || 0) +
      t.amount;
  });

  const topExpense =
    Object.entries(expenseCategory).sort(
      (a, b) => b[1] - a[1]
    )[0];

  // Biggest Income Source

  const incomeSource: Record<string, number> =
    {};

  income.forEach((t) => {
    const source = t.source || "Other";

    incomeSource[source] =
      (incomeSource[source] || 0) +
      t.amount;
  });

  const topIncome =
    Object.entries(incomeSource).sort(
      (a, b) => b[1] - a[1]
    )[0];

  // Highest Spending Transaction

  const highestExpense =
    expenses.sort(
      (a, b) => b.amount - a.amount
    )[0];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="mb-8">

        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          AI Financial Insights
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Today's Summary
        </h2>

      </div>

      <div className="space-y-5">

        <InsightCard
          icon="💸"
          title="Largest Expense"
          value={
            topExpense
              ? `${topExpense[0]} • $${topExpense[1].toLocaleString()}`
              : "No expense"
          }
        />

        <InsightCard
          icon="💰"
          title="Main Income"
          value={
            topIncome
              ? `${topIncome[0]} • $${topIncome[1].toLocaleString()}`
              : "No income"
          }
        />

        <InsightCard
          icon="🎯"
          title="Saving Rate"
          value={`${savingRate.toFixed(1)}%`}
        />

        <InsightCard
          icon="⚠️"
          title="Highest Spending"
          value={
            highestExpense
              ? `$${highestExpense.amount.toLocaleString()}`
              : "-"
          }
        />

      </div>

    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-cyan-300 hover:shadow-md">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {icon}
        </div>

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-1 font-semibold">
            {value}
          </h3>

        </div>

      </div>

    </div>
  );
}