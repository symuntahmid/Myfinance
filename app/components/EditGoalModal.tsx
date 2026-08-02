"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Goal, updateGoal } from "@/app/data/goals";

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

export default function EditGoalModal({
  open,
  goal,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setEmoji(goal.emoji);
      setTargetAmount(goal.targetAmount.toString());
      setTargetDate(goal.targetDate);
    }
  }, [goal]);

  if (!open || !goal) return null;

  function handleSave() {
  if (!goal) return;

  updateGoal({
    id: goal.id,
    title,
    emoji,
    targetAmount: Number(targetAmount),
    savedAmount: goal.savedAmount,
    targetDate,
    createdAt: goal.createdAt,
  });

  onClose();
}

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8">

          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Edit Goal
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="space-y-5">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border p-3"
            />

            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full rounded-xl border p-3"
            />

            <input
              type="number"
              value={targetAmount}
              onChange={(e) =>
                setTargetAmount(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

            <input
              type="date"
              value={targetDate}
              onChange={(e) =>
                setTargetDate(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white"
            >
              Save Changes
            </button>

          </div>

        </div>
      </div>
    </>
  );
}