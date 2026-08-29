"use client";

import { useEffect, useRef, useState } from "react";

import AddBudgetModal from "@/app/components/AddBudgetModal";
import BudgetProgressCard from "@/app/components/BudgetProgressCard";

import { getSummary, getTransactions } from "@/app/data/transactions";
import { getBudgets, deleteBudget, Budget } from "@/app/data/budgets";
import { formatCurrency } from "@/app/utils/currency";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

// Categories are stored as "🍔 Food" style strings in some places and as
// plain names in others. Strip any leading emoji/symbol + space so budgets
// and transactions can be compared on the same basis.
function normalizeCategory(category?: string) {
  return category?.replace(/^[^\s]+\s/, "") ?? "";
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = getSummary().expense;

  useEffect(() => {
    loadBudgets();

    const refresh = () => loadBudgets();

    window.addEventListener("budgetsUpdated", refresh);
    return () => window.removeEventListener("budgetsUpdated", refresh);
  }, []);

  // Close the open dropdown menu when clicking anywhere outside of it.
  useEffect(() => {
    if (!menuOpenId) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  function loadBudgets() {
    setBudgets(getBudgets());
  }

  function calculateSpent(budget: Budget) {
    return getTransactions()
      .filter((transaction) => {
        if (transaction.type !== "Expense") return false;

        const month = transaction.date.slice(0, 7);
        const category = normalizeCategory(transaction.category);

        return (
          month === budget.month &&
          category === normalizeCategory(budget.category)
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function handleDelete(budget: Budget) {
    const confirmed = window.confirm(`Delete "${budget.category}" budget?`);
    if (!confirmed) return;

    deleteBudget(budget.id);
    loadBudgets();
    setMenuOpenId(null);

    window.dispatchEvent(new Event("budgetsUpdated"));
  }

  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-medium tracking-[-0.05em] text-[var(--foreground)] md:text-6xl">
              Budgeting
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--muted)]">
              Plan and manage your monthly spending.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-body font-medium text-white transition hover:opacity-90"
          >
            + Add Budget
          </button>
        </div>

        {/* PROGRESS */}
        <div>
          <BudgetProgressCard budget={totalBudget} spent={totalSpent} />
        </div>

        {/* EMPTY STATE */}
        {budgets.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-16 text-center shadow-sm">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[var(--foreground)]">
              No Budgets Yet
            </h2>
            <p className="mt-3 font-body text-sm text-[var(--muted)]">
              Create your first monthly budget.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget) => {
              const spent = calculateSpent(budget);
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

              const isMenuOpen = menuOpenId === budget.id;

              return (
                <div
                  key={budget.id}
                  className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
                >
                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        {budget.category}
                      </h3>

                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <button
                      onClick={() => setMenuOpenId(isMenuOpen ? null : budget.id)}
                      className="rounded-xl p-2 transition hover:bg-[var(--background)]"
                      aria-label="Budget options"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* MENU */}
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-6 top-16 z-20 w-44 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl"
                    >
                      <button
                        onClick={() => {
                          setEditingBudget(budget);
                          setOpenModal(true);
                          setMenuOpenId(null);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 font-body text-sm text-[var(--foreground)] transition hover:bg-[var(--background)]"
                      >
                        <Pencil size={16} />
                        Edit Budget
                      </button>

                      <button
                        onClick={() => handleDelete(budget)}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 font-body text-sm text-red-600 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                        Delete Budget
                      </button>
                    </div>
                  )}

                  <p className="mt-2 font-body text-sm text-[var(--muted)]">
                    {budget.month}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-6">
                    <div className="mb-3 flex justify-between font-body text-sm">
                      <span className="text-[var(--muted)]">Spent</span>
                      <span className="font-medium text-[var(--foreground)]">
                        {formatCurrency(spent)} {" / "} {formatCurrency(budget.amount)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[var(--background)]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          status === "over"
                            ? "bg-red-500"
                            : status === "warning"
                            ? "bg-amber-500"
                            : "bg-cyan-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* VALUES */}
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-[var(--background)] p-4">
                      <p className="font-body text-xs text-[var(--muted)]">Budget</p>
                      <p className="mt-2 font-display text-lg font-medium tracking-tight text-[var(--foreground)]">
                        {formatCurrency(budget.amount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[var(--background)] p-4">
                      <p className="font-body text-xs text-[var(--muted)]">Spent</p>
                      <p className="mt-2 font-display text-lg font-medium tracking-tight text-red-500">
                        {formatCurrency(spent)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[var(--background)] p-4">
                      <p className="font-body text-xs text-[var(--muted)]">Left</p>
                      <p className="mt-2 font-display text-lg font-medium tracking-tight text-green-600">
                        {formatCurrency(Math.max(remaining, 0))}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                    {status === "good" && (
                      <div className="flex items-start gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                          <p className="font-body font-medium text-green-600">
                            You&apos;re on track
                          </p>
                          <p className="mt-1 font-body text-sm text-[var(--muted)]">
                            Great job! Your spending is within budget.
                          </p>
                        </div>
                      </div>
                    )}

                    {status === "warning" && (
                      <div className="flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                          <p className="font-body font-medium text-amber-600">
                            Budget almost used
                          </p>
                          <p className="mt-1 font-body text-sm text-[var(--muted)]">
                            You&apos;ve used {percentage.toFixed(0)}% of this budget.
                          </p>
                        </div>
                      </div>
                    )}

                    {status === "over" && (
                      <div className="flex items-start gap-3">
                        <span className="text-xl">🚨</span>
                        <div>
                          <p className="font-body font-medium text-red-600">
                            Budget exceeded
                          </p>
                          <p className="mt-1 font-body text-sm text-[var(--muted)]">
                            You&apos;re over budget by {formatCurrency(Math.abs(remaining))}
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