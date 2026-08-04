"use client";

import { useState } from "react";

import {
  addBudget,
  BudgetCategory,
} from "@/app/data/budgets";

type Props = {
  open: boolean;
  onClose: () => void;
};

const categories: BudgetCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

export default function AddBudgetModal({
  open,
  onClose,
}: Props) {
  const [category, setCategory] =
    useState<BudgetCategory>("Food");

  const [amount, setAmount] =
    useState("");

  const [month, setMonth] =
    useState(
      new Date().toISOString().slice(0, 7)
    );

  if (!open) return null;

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    addBudget({
      id: crypto.randomUUID(),
      category,
      amount: Number(amount),
      month,
    });

    setCategory("Food");
    setAmount("");
    setMonth(
      new Date().toISOString().slice(0, 7)
    );

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h2 className="mb-6 text-2xl font-bold">
          Add Budget
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target
                    .value as BudgetCategory
                )
              }
              className="w-full rounded-2xl border p-3"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Budget Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-2xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              className="w-full rounded-2xl border p-3"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-5 py-3 font-semibold text-white"
          >
            Save Budget
          </button>
        </div>
      </form>
    </div>
  );
}