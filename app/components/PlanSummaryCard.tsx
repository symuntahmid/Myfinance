"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getTransactions } from "@/app/data/transactions";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import {
  computePlan,
  getPlan,
  type PlanResult,
} from "@/app/data/plan";

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function PlanSummaryCard() {
  const { t, language } = useLanguage();

  const [result, setResult] = useState<PlanResult | null>(null);

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();

      const total = getAccounts().reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      setResult(
        computePlan({
          month: currentMonth(),
          plan: getPlan(),
          transactions: getTransactions(),
          totalBalance: total,
        })
      );
    };

    refresh();

    const events = [
      "planUpdated",
      "transactionsUpdated",
      "accountsUpdated",
      "languageUpdated",
      "currencyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (!result) return null;

  const planned = result.rows
    .filter((row) => row.assigned > 0 || row.spent > 0)
    .slice(0, 3);

  const overspent = result.rows.filter(
    (row) => row.available < 0
  ).length;

  const rta = result.readyToAssign;

  const label = (category: string) => {
    const found = quickExpenseCategories.find(
      (item) => item.value === category
    );

    return found
      ? `${found.emoji} ${found[language]}`
      : category;
  };

  return (
    <Link
      href="/plan"
      className="block rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--foreground)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">
            {t("planCardTitle")}
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("planReadyToAssign")}
          </p>
        </div>

        <p
          className={`text-2xl font-bold ${
            rta < 0
              ? "text-red-500"
              : rta === 0
              ? "text-emerald-600"
              : "text-[var(--primary)]"
          }`}
        >
          {formatCurrency(rta)}
        </p>
      </div>

      {planned.length === 0 ? (
        <p className="mt-4 text-sm">{t("planCardEmpty")}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {planned.map((row) => {
            const had = row.spent + Math.max(row.available, 0);
            const share = had > 0 ? (row.spent / had) * 100 : 0;

            return (
              <div key={row.category}>
                <div className="flex justify-between text-sm">
                  <span>{label(row.category)}</span>

                  <span
                    className={
                      row.available < 0
                        ? "font-semibold text-red-500"
                        : "text-[var(--muted)]"
                    }
                  >
                    {formatCurrency(row.available)}
                  </span>
                </div>

                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
                  <div
                    className={`h-full rounded-full ${
                      row.available < 0
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${row.available < 0 ? 100 : share}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {overspent > 0 && (
        <p className="mt-3 text-xs font-semibold text-red-500">
          {t("planOverspentCount", { count: overspent })}
        </p>
      )}

      <p className="mt-4 text-sm font-semibold text-[var(--primary)]">
        {t("planOpen")} →
      </p>
    </Link>
  );
}
