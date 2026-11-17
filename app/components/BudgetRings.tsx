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
    over: "{name} is {x} over budget. Spend less here.",
    overMany: "{n} budgets are over, {name} the most.",
    left: "left",
    ok: "{x} left in {name}",
  },
  bn: {
    set: "বাজেট দিন",
    over: "{name} এ বাজেটের চেয়ে {x} বেশি। এখানে খরচ কমান।",
    overMany: "{n}টি বাজেট ছাড়িয়েছে, সবচেয়ে বেশি {name}।",
    left: "বাকি",
    ok: "{name} এ {x} বাকি",
  },
} as const;

const SIZE = 36;
const STROKE = 4;
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

  const pctText = (pct: number) =>
    `${Math.round(pct).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}%`;

  return (
    <section aria-label="Budgets" className="space-y-1.5">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
        {rings.map((ring) => {
          const bad = ring.pct > 100;
          const shown = Math.min(ring.pct, 100);

          return (
            <Link
              key={ring.category}
              href="/money"
              className={`flex h-12 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-xs font-semibold ${
                bad
                  ? "border-red-500/30 bg-red-500/10 text-red-600"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              <span className="relative block" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden>
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

                <span className="absolute inset-0 flex items-center justify-center text-base">
                  {ring.emoji}
                </span>
              </span>

              <span className="whitespace-nowrap">
                {ring.name} {pctText(ring.pct)}
              </span>
            </Link>
          );
        })}

        <Link
          href="/money"
          className="flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-[var(--border)] px-3 text-xs font-semibold text-[var(--muted)]"
        >
          <Plus size={14} />
          {x.set}
        </Link>
      </div>

      {worst && (
        <p className="truncate text-xs font-semibold text-red-600">
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
