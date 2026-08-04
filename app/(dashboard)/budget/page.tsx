"use client";

import { useEffect, useState } from "react";

import AddBudgetModal from "@/app/components/AddBudgetModal";
import BudgetProgressCard from "@/app/components/BudgetProgressCard";
import { getSummary } from "@/app/data/transactions";
import { getTransactions } from "@/app/data/transactions";

import {
  getBudgets,
  deleteBudget,
  Budget,
} from "@/app/data/budgets";

import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingBudget, setEditingBudget] =
  useState<Budget | null>(null);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const totalBudget = budgets.reduce(
  (sum, budget) => sum + budget.amount,
  0
);

// Temporary
const totalSpent = getSummary().expense;

  useEffect(() => {
    loadBudgets();

    function refresh() {
      loadBudgets();
    }

    window.addEventListener(
      "budgetsUpdated",
      refresh
    );

    return () =>
      window.removeEventListener(
        "budgetsUpdated",
        refresh
      );
  }, []);

  function loadBudgets() {
    setBudgets(getBudgets());
  }

  return (
    <>
      <div className="space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Budgeting
            </h1>

            <p className="mt-2 text-slate-500">
              Plan and manage your monthly spending.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-white"
          >
            + Add Budget
          </button>
        </div>

        <div className="mb-8">
  <BudgetProgressCard
    budget={totalBudget}
    spent={totalSpent}
  />
</div>

{budgets.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              No Budgets Yet
            </h2>

            <p className="mt-3 text-slate-500">
              Create your first monthly budget.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget) => {
  const spent = getTransactions()
  .filter((transaction) => {
    if (transaction.type !== "Expense") return false;

    const month = transaction.date.slice(0, 7);

    const category = transaction.category
      ?.replace(/^[^\s]+\s/, "");

    return (
      month === budget.month &&
      category === budget.category
    );
  })
  .reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const remaining = budget.amount - spent;

  const percentage =
    budget.amount === 0
      ? 0
      : Math.min((spent / budget.amount) * 100, 100);

      const status =
  spent > budget.amount
    ? "over"
    : percentage >= 90
    ? "warning"
    : "good";

  return (
    <div
      key={budget.id}
      className="rounded-3xl bg-white p-6 shadow-sm"
    >
      <div className="relative flex items-center justify-between">
  <div className="flex items-center gap-3">
    <h3 className="text-xl font-bold">
      {budget.category}
    </h3>

    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
      {percentage.toFixed(0)}%
    </span>
  </div>

  <button
    onClick={() =>
      setMenuOpenId(
        menuOpenId === budget.id
          ? null
          : budget.id
      )
    }
    className="rounded-xl p-2 transition hover:bg-slate-100"
  >
    <MoreVertical size={18} />
</button>

{menuOpenId === budget.id && (
  <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border bg-white p-2 shadow-xl">
    <button
  onClick={() => {
    setEditingBudget(budget);

    setOpenModal(true);

    setMenuOpenId(null);
  }}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-100"
>
  <Pencil size={16} />
  Edit Budget
</button>

    <button
      onClick={() => {
        const confirmed = window.confirm(
          `Delete "${budget.category}" budget?`
        );

        if (!confirmed) return;

        deleteBudget(budget.id);

        setMenuOpenId(null);
      }}
      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-red-600 hover:bg-red-50"
    >
      <Trash2 size={16} />
      Delete Budget
    </button>
  </div>
)}
</div>

      <p className="mt-2 text-slate-500">
        {budget.month}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-slate-500">
          <span>
            ${spent.toLocaleString()}
          </span>

          <span>
            ${budget.amount.toLocaleString()}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-700"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-500">
            Budget
          </p>

          <p className="mt-1 font-bold">
            ${budget.amount.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Spent
          </p>

          <p className="mt-1 font-bold text-red-500">
            ${spent.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Left
          </p>

          <p className="mt-1 font-bold text-green-600">
            ${remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
  {status === "good" && (
    <div className="flex items-center gap-2 text-green-600">
      <span className="text-xl">✅</span>

      <div>
        <p className="font-semibold">
          You're on track
        </p>

        <p className="text-sm text-slate-500">
          Great job! Your spending is within budget.
        </p>
      </div>
    </div>
  )}

  {status === "warning" && (
    <div className="flex items-center gap-2 text-amber-600">
      <span className="text-xl">⚠️</span>

      <div>
        <p className="font-semibold">
          Budget almost used
        </p>

        <p className="text-sm text-slate-500">
          You've used {percentage.toFixed(0)}% of this budget.
        </p>
      </div>
    </div>
  )}

  {status === "over" && (
    <div className="flex items-center gap-2 text-red-600">
      <span className="text-xl">🚨</span>

      <div>
        <p className="font-semibold">
          Budget exceeded
        </p>

        <p className="text-sm text-slate-500">
          You're over budget by $
          {Math.abs(remaining).toLocaleString()}.
        </p>
      </div>
    </div>
  )}
</div>
    </div>
  );
})}
          </div>
        )}
      </div>

      <AddBudgetModal
  open={openModal}
  editingBudget={editingBudget}
  onClose={() => {
    setOpenModal(false);

    setEditingBudget(null);
  }}
/>
    </>
  );
}