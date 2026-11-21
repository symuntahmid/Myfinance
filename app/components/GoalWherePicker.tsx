"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { accountName, getAccounts, getBalances } from "@/app/data/accounts";
import { getGoals } from "@/app/data/goals";
import { formatCurrency } from "@/app/utils/currency";

const TEXT = {
  en: {
    label: "Where is this money kept?",
    manual: "I will update it myself",
    manualHint: "Use this for cash at home or money the app cannot see.",
    linkedHint: "The saved amount follows this account's balance. To save more, move money into it with Transfer.",
    taken: "used by {n}",
  },
  bn: {
    label: "এই টাকা কোথায় জমা আছে?",
    manual: "আমি নিজে আপডেট করব",
    manualHint: "ঘরে রাখা নগদ বা অ্যাপ যা দেখতে পায় না, তার জন্য এটি বেছে নিন।",
    linkedHint: "জমার অঙ্ক এই অ্যাকাউন্টের ব্যালান্সের সঙ্গে চলবে। আরও জমাতে ট্রান্সফার দিয়ে টাকা সরান।",
    taken: "{n}-এ ব্যবহৃত",
  },
} as const;

// "" means the person keeps the number up to date by hand.
export default function GoalWherePicker({
  value,
  onChange,
  goalId,
}: {
  value: string;
  onChange: (accountId: string) => void;
  goalId?: string;
}) {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];
  const balances = getBalances();
  const goals = getGoals();

  const chip = (on: boolean, off: boolean) =>
    `rounded-2xl border px-3 py-2 text-left text-sm font-semibold ${
      on
        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
        : off
        ? "border-[var(--border)] opacity-45"
        : "border-[var(--border)]"
    }`;

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{x.label}</span>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange("")} className={chip(value === "", false)}>
          ✍️ {x.manual}
        </button>

        {getAccounts().map((account) => {
          const user = goals.find((goal) => goal.accountId === account.id && goal.id !== goalId);

          return (
            <button
              key={account.id}
              type="button"
              disabled={!!user}
              onClick={() => onChange(account.id)}
              className={chip(value === account.id, !!user)}
            >
              <span className="block">
                {account.emoji} {accountName(account, lang)}
              </span>

              <span className={`block text-[11px] font-normal ${value === account.id ? "opacity-85" : "text-[var(--muted)]"}`}>
                {user ? x.taken.replace("{n}", user.title) : formatCurrency(balances[account.id] ?? 0)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-[var(--muted)]">{value ? x.linkedHint : x.manualHint}</p>
    </div>
  );
}
