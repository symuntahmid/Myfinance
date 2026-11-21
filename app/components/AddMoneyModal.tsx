"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { Goal, setGoalSaved } from "@/app/data/goals";
import { formatCurrency } from "@/app/utils/currency";

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

const TEXT = {
  en: {
    title: "Update saved amount",
    hint: "Type how much you have saved for this goal now. Your account balances do not change.",
    label: "Saved so far",
    save: "Save",
    cancel: "Cancel",
    of: "{a} of {b}",
    bad: "Enter a valid amount",
  },
  bn: {
    title: "জমার অঙ্ক আপডেট",
    hint: "এই লক্ষ্যে এখন মোট কত জমেছে, তা লিখুন। আপনার অ্যাকাউন্টের ব্যালান্স বদলাবে না।",
    label: "এ পর্যন্ত জমেছে",
    save: "সেভ করুন",
    cancel: "বাতিল",
    of: "{b}-এর মধ্যে {a}",
    bad: "সঠিক অঙ্ক লিখুন",
  },
} as const;

// For goals the person tracks by hand. This only changes the goal, never an account.
export default function AddMoneyModal({ open, goal, onClose }: Props) {
  if (!open || !goal) return null;

  return <Panel goal={goal} onClose={onClose} />;
}

function Panel({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];
  const [value, setValue] = useState(String(goal.savedAmount || ""));

  const save = () => {
    const amount = Number(value);

    if (value === "" || isNaN(amount) || amount < 0) {
      alert(x.bad);

      return;
    }

    setGoalSaved(goal.id, amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md rounded-t-3xl bg-[var(--card)] p-5 pb-8 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{x.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{x.hint}</p>
          </div>

          <button type="button" onClick={onClose} className="rounded-full p-2 text-[var(--muted)]">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-[var(--background)] p-4">
          <p className="text-base font-bold">
            {goal.emoji} {goal.title}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {x.of.replace("{a}", formatCurrency(goal.savedAmount)).replace("{b}", formatCurrency(goal.targetAmount))}
          </p>
        </div>

        <label className="mt-4 block text-xs font-semibold text-[var(--muted)]">
          {x.label}
          <input
            autoFocus
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
            placeholder="0"
            className="mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-2xl font-semibold text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
        </label>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[var(--border)] py-3 text-sm font-semibold">
            {x.cancel}
          </button>

          <button type="button" onClick={save} className="flex-1 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white">
            {x.save}
          </button>
        </div>
      </div>
    </div>
  );
}
