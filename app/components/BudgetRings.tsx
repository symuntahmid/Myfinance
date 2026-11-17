"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getTransactions } from "@/app/data/transactions";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import { computePlan, getPlan, type PlanRow } from "@/app/data/plan";
import { monthOfDate, todayLocal } from "@/app/utils/date";

type Ring = {
  category: string;
  emoji: string;
  name: string;
  pct: number; // spent / what you had, in percent
  over: number; // money over budget, 0 when fine
};

const TEXT = {
  en: {
    set: "Set a budget",
    over: "Over budget on {name} by {x}. Spend less here to get back on track.",
    overMany: "Over budget on {n} things, {name} the most. Hold back a little.",
    left: "left",
    ok: "{x} left in {name}",
  },
  bn: {
    set: "বাজেট দিন",
    over: "{name} এ {x} বেশি খরচ হয়েছে। এখানে খরচ কমালে আবার ঠিক পথে আসবেন।",
    overMany: "{n}টি খাতে বাজেট ছাড়িয়েছে, সবচেয়ে বেশি {name}। একটু রাশ টানুন।",
    left: "বাকি",
    ok: "{name} এ {x} বাকি",
  },
} as const;

const SIZE = 64;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

function colorOf(pct: number): string {
  if (pct > 100) return "#ef4444";
  if (pct >= 80) return "var(--gold)";

  return "var(--primary)";
}

export default function BudgetRings() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [rings, setRings] = useState<Ring[] | null>(null);

  useEffect(() => {
    const load = () => {
      const balances = getBalances();
      const total = getAccounts().reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      const result = computePlan({
        month: monthOfDate(todayLocal()),
        plan: getPlan(),
        transactions: getTransactions(),
        totalBalance: total,
      });

      const next = result.rows
        .map((row: PlanRow) => {
          const had = row.spent + row.available;
          const found = quickExpenseCategories.find(
            (item) => item.value === row.category
          );

          return {
            category: row.category,
            emoji: found ? found.emoji : row.category.split(" ")[0],
            name: found
              ? found[lang]
              : row.category.split(" ").slice(1).join(" ") || row.category,
            budgeted: row.assigned > 0 && had > 0,
            pct: had > 0 ? (row.spent / had) * 100 : 0,
            over: row.available < 0 ? -row.available : 0,
          };
        })
        .filter((item) => item.budgeted)
        .sort((a, b) => b.pct - a.pct)
        .map((item) => ({
          category: item.category,
          emoji: item.emoji,
          name: item.name,
          pct: item.pct,
          over: item.over,
        }));

      setRings(next);
    };

    load();

    const events = [
      "planUpdated",
      "transactionsUpdated",
      "accountsUpdated",
      "languageUpdated",
      "currencyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, load));

    return () =>
      events.forEach((e) => window.removeEventListener(e, load));
  }, [lang]);

  if (!rings) return null;

  const overs = rings.filter((ring) => ring.over > 0);
  const worst = overs[0];

  return (
    <section aria-label="Budgets" className="space-y-3">
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {rings.map((ring) => {
          const bad = ring.pct > 100;
          const shown = Math.min(ring.pct, 100);

          return (
            <Link
              key={ring.category}
              href="/money"
              className="flex w-[72px] shrink-0 flex-col items-center gap-1"
            >
              <span className="relative block" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} className="-rotate-90">
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={STROKE}
                  />
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    fill="none"
                    stroke={colorOf(ring.pct)}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C - (shown / 100) * C}
                  />
                </svg>

                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                  {ring.emoji}
                </span>

                {bad && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {Math.round(ring.pct).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}%
                  </span>
                )}
              </span>

              <span className="w-full truncate text-center text-xs text-[var(--muted)]">
                {ring.name}
              </span>
            </Link>
          );
        })}

        <Link
          href="/money"
          className="flex w-[72px] shrink-0 flex-col items-center gap-1"
        >
          <span
            className="flex items-center justify-center rounded-full bg-[var(--border)] text-[var(--foreground)]"
            style={{ width: SIZE, height: SIZE }}
          >
            <Plus size={26} />
          </span>

          <span className="w-full truncate text-center text-xs text-[var(--muted)]">
            {x.set}
          </span>
        </Link>
      </div>

      {worst && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">
          {overs.length === 1
            ? x.over.replace("{name}", worst.name).replace("{x}", formatCurrency(worst.over))
            : x.overMany
                .replace("{n}", overs.length.toLocaleString(lang === "bn" ? "bn-BD" : "en-US"))
                .replace("{name}", worst.name)}
        </p>
      )}
    </section>
  );
}
