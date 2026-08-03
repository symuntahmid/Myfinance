"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  Goal,
  withdrawMoneyFromGoal,
} from "@/app/data/goals";

import {
  addTransaction,
} from "@/app/data/transactions";

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

export default function WithdrawMoneyModal({
  open,
  goal,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");

  console.log({
  open,
  goal,
});

  if (!open || !goal) return null;

  // TypeScript now knows this is never null
  const currentGoal = goal;

  function handleWithdraw() {
    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (value > currentGoal.savedAmount) {
      alert("Not enough money in this goal.");
      return;
    }

    withdrawMoneyFromGoal(currentGoal.id, value);

    addTransaction({
      id: Date.now(),
      type: "Transfer",
      source: currentGoal.title,
      destination: "Available Cash",
      amount: value,
      date: new Date().toISOString(),
      note: `Withdraw from goal: ${currentGoal.title}`,
    });

    setAmount("");
    onClose();
  }

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
                Withdraw Money
              </h2>

              <p className="mt-1 text-slate-500">
                Move money back to Available Cash.
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
                {currentGoal.emoji} {currentGoal.title}
              </h3>

              <p className="mt-2 text-slate-600">
                Available: $
                {currentGoal.savedAmount.toLocaleString()}
              </p>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-6 w-full rounded-xl border border-slate-300 p-4"
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleWithdraw}
                className="flex-1 rounded-2xl bg-red-600 py-4 font-semibold text-white"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}