"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { Goal, updateGoal } from "@/app/data/goals";

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
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [open]);

  if (!open || !goal) return null;

function handleAddMoney() {
  if (!goal) return;

  const value = Number(amount);

  if (value <= 0) return;

  updateGoal({
    ...goal,
    savedAmount: goal.savedAmount + value,
  });

  onClose();
}

  return (
    <>
      {/* Backdrop */}

      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-[32px] bg-white shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <div>
              <h2 className="text-3xl font-bold">
                Add Money
              </h2>

              <p className="mt-1 text-slate-500">
                Increase progress toward your goal.
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

          <div className="space-y-6 p-8">
            {/* Goal */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Goal
              </label>

              <input
                disabled
                value={goal.title}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3"
              />
            </div>

            {/* Current Saved */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Current Saved
              </label>

              <input
                disabled
                value={`$${goal.savedAmount.toLocaleString()}`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3"
              />
            </div>

            {/* Amount */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Amount to Add
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="500"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* Note */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Note (optional)
              </label>

              <textarea
                rows={3}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Monthly savings..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex gap-4 px-8 pb-8">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleAddMoney}
              className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              Add Money
            </button>
          </div>
        </div>
      </div>
    </>
  );
}