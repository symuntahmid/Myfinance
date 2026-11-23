"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getGoals, goalPlan } from "@/app/data/goals";

const TEXT = {
  en: {
    title: "Save for your goals",
    sub: "{n} goals · this month",
    soon: "Includes {x} due within a month",
  },
  bn: {
    title: "লক্ষ্যের জন্য জমান",
    sub: "{n}টি লক্ষ্য · এই মাসে",
    soon: "এর মধ্যে মাসের ভেতরে মেয়াদ: {x}",
  },
} as const;

// One calm line on Budget: how much to put aside this month for all goals.
export default function GoalsMonthlyLine() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];
  const [info, setInfo] = useState<{ total: number; count: number; soon: number } | null>(null);

  useEffect(() => {
    const load = () => {
      let total = 0;
      let soon = 0;
      let count = 0;

      getGoals().forEach((goal) => {
        const plan = goalPlan(goal);

        if (plan.status === "done" || plan.status === "late") return;

        // More than a month away: the monthly share. Due within a month: whatever is left.
        const need = plan.perMonth > 0 ? plan.perMonth : plan.dueTotal;

        if (need <= 0) return;

        total += need;
        count += 1;

        if (plan.perMonth === 0) soon += need;
      });

      setInfo(count > 0 ? { total, count, soon } : null);
    };

    load();

    const events = ["goalsUpdated", "accountsUpdated", "transactionsUpdated", "languageUpdated", "currencyUpdated"];

    events.forEach((e) => window.addEventListener(e, load));

    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, []);

  if (!info) return null;

  const num = (v: number) => v.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  return (
    <Link
      href="/goals"
      className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
        <Target size={20} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{x.title}</span>
        <span className="block text-xs text-[var(--muted)]">
          {x.sub.replace("{n}", num(info.count))}
          {info.soon > 0 ? ` · ${x.soon.replace("{x}", formatCurrency(info.soon))}` : ""}
        </span>
      </span>

      <span className="shrink-0 text-base font-bold [font-variant-numeric:tabular-nums]">
        {formatCurrency(info.total)}
      </span>
    </Link>
  );
}
