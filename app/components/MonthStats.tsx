"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getSummary } from "@/app/data/transactions";
import { getPortfolioSummary } from "@/app/data/investments";

export default function MonthStats() {
  const { t } = useLanguage();

  const [values, setValues] = useState<{
    income: number;
    expense: number;
    invested: number;
  } | null>(null);

  useEffect(() => {
    const refresh = () => {
      const summary = getSummary();

      setValues({
        income: summary.income,
        expense: summary.expense,
        invested: getPortfolioSummary().invested,
      });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "investmentsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (!values) return null;

  // Only show the investments tile once the user invests.
  const tiles: (readonly [string, number, string])[] = [
    [t("monthlyIncome"), values.income, "bg-[var(--success)]"],
    [t("expenses"), values.expense, "bg-[var(--sun)]"],
    ...(values.invested > 0
      ? ([[t("investments"), values.invested, "bg-[var(--gold)]"]] as const)
      : []),
  ];

  return (
    <div
      className={`grid gap-2.5 ${
        tiles.length === 3 ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {tiles.map(([label, value, dot]) => (
        <div
          key={label}
          className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
        >
          <p className="flex items-center gap-1.5 truncate text-[11.5px] text-[var(--muted)]">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span className="truncate">{label}</span>
          </p>

          <p className="font-display mt-1.5 truncate text-[17px] leading-tight text-[var(--foreground)]">
            {formatCurrency(value)}
          </p>
        </div>
      ))}
    </div>
  );
}
