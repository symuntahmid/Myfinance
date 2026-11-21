"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { addGoal, termFromDate, type GoalTerm } from "@/app/data/goals";
import TermPicker from "@/app/components/TermPicker";
import GoalWherePicker from "@/app/components/GoalWherePicker";
import { useLanguage } from "@/app/context/LanguageContext";
import { GOAL_EMOJIS } from "@/app/data/lifeGoals";
import {
  goalTemplates,
  goalTemplateText,
  type GoalTemplateId,
} from "@/app/data/goalTemplates";

type Props = {
  open: boolean;
  onClose: () => void;
};

const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-base font-semibold text-[var(--foreground)] outline-none focus:border-[var(--primary)]";

export default function AddGoalModal({ open, onClose }: Props) {
  const { language, t } = useLanguage();

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [chosenTerm, setChosenTerm] = useState<GoalTerm | null>(null);
  const [templateId, setTemplateId] = useState<GoalTemplateId | null>(null);
  const [accountId, setAccountId] = useState("");

  if (!open) return null;

  const amount = Number(targetAmount);
  const valid = title.trim() !== "" && amount > 0;

  function reset() {
    setTitle("");
    setEmoji("🎯");
    setTargetAmount("");
    setTargetDate("");
    setChosenTerm(null);
    setTemplateId(null);
    setAccountId("");
  }

  function handleCreateGoal() {
    if (!valid) return;

    addGoal({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      emoji,
      targetAmount: amount,
      savedAmount: 0,
      targetDate,
      createdAt: new Date().toISOString(),
      term: chosenTerm ?? termFromDate(targetDate),
      ...(accountId ? { accountId } : {}),
    });

    reset();
    onClose();
  }

  const label = "mb-1 block text-xs font-semibold text-[var(--muted)]";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-[var(--card)] p-5 pb-8 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{t("createGoal")}</h2>
            <p className="text-sm text-[var(--muted)]">
              {t("createGoalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="rounded-full p-2 text-[var(--muted)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4">
          <p className={label}>
            {goalTemplateText[language].heading} ·{" "}
            {goalTemplateText[language].optional}
          </p>

          <div className="flex flex-wrap gap-2">
            {goalTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setTitle(template.title[language]);
                  setEmoji(template.emoji);
                  setTemplateId(template.id);
                }}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                  templateId === template.id
                    ? "border-[var(--forest)] bg-[var(--forest)] text-[var(--on-forest)]"
                    : "border-[var(--border)] bg-[var(--background)]"
                }`}
              >
                {template.emoji} {template.title[language]}
              </button>
            ))}
          </div>

          {templateId && (
            <p className="mt-3 rounded-xl bg-[var(--gold-soft)] px-3 py-2 text-sm">
              💡 {goalTemplates.find((x) => x.id === templateId)?.tip[language]}
            </p>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className={label}>{t("goalName")}</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("goalNamePlaceholder")}
              className={field}
            />
          </label>

          <div>
            <span className={label}>{t("emojiLabel")}</span>

            <div className="flex flex-wrap gap-2">
              {[...new Set([emoji, "🎯", ...GOAL_EMOJIS])].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  aria-pressed={emoji === item}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl ${
                    emoji === item
                      ? "border-[var(--forest)] bg-[var(--gold-soft)]"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={label}>{t("targetAmount")}</span>
              <input
                inputMode="decimal"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(e.target.value.replace(/[^\d.]/g, ""))
                }
                placeholder="10000"
                className={field}
              />
            </label>

            <label className="block">
              <span className={label}>{t("targetDate")}</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={field}
              />
            </label>
          </div>

          <TermPicker
            value={chosenTerm ?? termFromDate(targetDate)}
            onChange={setChosenTerm}
          />

          <GoalWherePicker value={accountId} onChange={setAccountId} />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-[var(--border)] py-3 text-sm font-semibold"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            disabled={!valid}
            onClick={handleCreateGoal}
            className="flex-1 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {t("createGoal")}
          </button>
        </div>
      </div>
    </div>
  );
}
