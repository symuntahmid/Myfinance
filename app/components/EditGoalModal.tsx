"use client";

import { useLanguage } from "@/app/context/LanguageContext";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Goal, updateGoal } from "@/app/data/goals";

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

const emojis = [
  "🎯",
  "✈️",
  "🏠",
  "🚗",
  "💻",
  "🎓",
  "💍",
  "📱",
  "🏍️",
  "🛒",
  "💰",
  "❤️",
];

export default function EditGoalModal({
  open,
  goal,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] =
    useState("");
  const [targetDate, setTargetDate] =
    useState("");

  const { t } = useLanguage();

  useEffect(() => {
    if (!goal) return;

    setTitle(goal.title);
    setEmoji(goal.emoji);
    setTargetAmount(
      goal.targetAmount.toString()
    );
    setTargetDate(goal.targetDate);
  }, [goal]);

  if (!open || !goal) return null;

  function handleSave() {
    if (!goal) return;

    if (!title.trim()) {
      alert(t("enterGoalName"));
      return;
    }

    if (
      !targetAmount ||
      Number(targetAmount) <= 0
    ) {
      alert(t("enterValidTarget"));
      return;
    }

    updateGoal({
      id: goal.id,

      title: title.trim(),

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
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-[32px] bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <h2 className="text-3xl font-bold">
              {t("editGoal")}
            </h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-6 p-8">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t("goalName")}
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold">
                {t("emojiLabel")}
              </label>

              <div className="grid grid-cols-6 gap-3">
                {emojis.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setEmoji(item)
                    }
                    className={`rounded-2xl border p-3 text-3xl transition ${
                      emoji === item
                        ? "border-cyan-500 bg-cyan-100"
                        : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t("targetAmount")}
              </label>

              <input
                type="number"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t("targetDate")}
              </label>

              <input
                type="date"
                value={targetDate}
                onChange={(e) =>
                  setTargetDate(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="flex gap-4 px-8 pb-8">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold hover:bg-slate-50"
            >
              {t("cancel")}
            </button>

            <button
              onClick={handleSave}
              className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:scale-[1.02]"
            >
              {t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}