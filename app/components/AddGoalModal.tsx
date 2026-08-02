"use client";

import { useState } from "react";
import { X, Target } from "lucide-react";

import { addGoal } from "@/app/data/goals";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddGoalModal({
  open,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  if (!open) return null;

  function handleCreateGoal() {
    if (!title.trim()) return;

    if (!targetAmount) return;

    addGoal({
      id: Date.now().toString(),
      title: title.trim(),
      emoji,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      targetDate,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setEmoji("🎯");
    setTargetAmount("");
    setTargetDate("");

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
          className="w-full max-w-xl rounded-[32px] bg-white shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-cyan-100 p-3">
                <Target className="text-cyan-600" />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Create Goal
                </h2>

                <p className="mt-1 text-slate-500">
                  Start saving toward something meaningful.
                </p>
              </div>
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
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Goal Name
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Japan Trip"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Emoji
              </label>

              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎯"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Target Amount
              </label>

              <input
                type="number"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(e.target.value)
                }
                placeholder="10000"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Target Date
              </label>

              <input
                type="date"
                value={targetDate}
                onChange={(e) =>
                  setTargetDate(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
              onClick={handleCreateGoal}
              className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              Create Goal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}