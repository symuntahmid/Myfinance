"use client";

import { useEffect, useState } from "react";

import AddBudgetModal from "@/app/components/AddBudgetModal";

import {
  getBudgets,
  Budget,
} from "@/app/data/budgets";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [openModal, setOpenModal] = useState(false);

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
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold">
                  {budget.category}
                </h3>

                <p className="mt-2 text-slate-500">
                  {budget.month}
                </p>

                <div className="mt-6 text-3xl font-bold">
                  ${budget.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddBudgetModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}