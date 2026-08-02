"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Goal, addMoneyToGoal } from "@/app/data/goals";
import {
  getSummary,
  addTransaction,
} from "@/app/data/transactions";

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

export default function AddMoneyModal({
  open,
  goal,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");

  if (!open || !goal) return null;

  const summary = getSummary();
  const availableCash = summary.availableCash;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-[32px] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <div>
              <h2 className="text-3xl font-bold">
                Add Money
              </h2>

              <p className="mt-1 text-slate-500">
                Transfer money into this goal.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">

            <div className="rounded-2xl bg-slate-100 p-5">
              <p className="text-sm text-slate-500">
                Selected Goal
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {goal.emoji} {goal.title}
              </h3>

              <p className="mt-2 text-slate-600">
                ${goal.savedAmount.toLocaleString()} of $
                {goal.targetAmount.toLocaleString()}
              </p>
            </div>

            {/* Amount */}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-6 w-full rounded-xl border border-slate-300 p-4"
            />

            {/* Available Cash */}
            <p className="mt-3 text-sm text-slate-500">
              Available Cash:
              <span className="ml-2 font-semibold text-cyan-600">
                ${availableCash.toLocaleString()}
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">

              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const value = Number(amount);

                  if (value <= 0) {
                    alert("Enter a valid amount.");
                    return;
                  }

                  if (value > availableCash) {
                    alert("Not enough available cash.");
                    return;
                  }

                  addMoneyToGoal(goal.id, value);

addTransaction({
  id: Date.now(),

  type: "Transfer",

  source: "Available Cash",

  destination: goal.title,

  amount: value,

  date: new Date().toISOString(),

  note: `Transfer to goal: ${goal.title}`,
});

setAmount("");

onClose();
                }}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white"
              >
                Add Money
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}