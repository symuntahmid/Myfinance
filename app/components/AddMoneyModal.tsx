"use client";

import { X } from "lucide-react";
import { Goal } from "@/app/data/goals";

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
  if (!open || !goal) return null;

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

            <button
              onClick={onClose}
              className="mt-8 w-full rounded-2xl border border-slate-300 py-4 font-semibold"
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </>
  );
}