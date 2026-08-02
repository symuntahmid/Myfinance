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

  if (!open || !goal) return null;

  function handleWithdraw() {
    // TypeScript safety
    if (!goal) return;

    const value = Number(amount);

    if (
      !value ||
      value <= 0 ||
      value > goal.savedAmount
    ) {
      alert("Invalid amount");
      return;
    }

    withdrawMoneyFromGoal(goal.id, value);

    addTransaction({
      id: Date.now(),

      type: "Transfer",

      source: goal.title,

      destination: "Available Cash",

      amount: value,

      date: new Date().toISOString(),

      note: `Withdraw from goal: ${goal.title}`,
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
                Goal
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {goal.emoji} {goal.title}
              </h3>

              <p className="mt-2 text-slate-600">
                Available: $
                {goal.savedAmount.toLocaleString()}
              </p>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="mt-6 w-full rounded-xl border p-4"
            />

            <button
              onClick={handleWithdraw}
              className="mt-6 w-full rounded-2xl bg-red-600 py-4 font-semibold text-white"
            >
              Withdraw Money
            </button>
          </div>
        </div>
      </div>
    </>
  );
}