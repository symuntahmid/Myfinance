"use client";

import { useEffect, useState } from "react";

import AIInsightCard from "@/app/components/ai/AIInsightCard";
import GoalProgressCard from "../../components/GoalProgressCard";
import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import InvestmentPieChart from "../../components/InvestmentPieChart";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getPortfolioSummary } from "@/app/data/investments";

export default function InsightsPage() {
  const { t } = useLanguage();

  const [portfolio, setPortfolio] = useState(getPortfolioSummary());

  useEffect(() => {
    const refresh = () => setPortfolio(getPortfolioSummary());

    refresh();

    window.addEventListener("investmentsUpdated", refresh);

    return () => window.removeEventListener("investmentsUpdated", refresh);
  }, []);

  const stats = [
    [t("insInvested"), formatCurrency(portfolio.invested), ""],
    [t("insCurrent"), formatCurrency(portfolio.current), ""],
    [
      t("insProfit"),
      `${portfolio.profit >= 0 ? "+" : "-"}${formatCurrency(Math.abs(portfolio.profit))}`,
      portfolio.profit >= 0 ? "text-emerald-600" : "text-[var(--sun)]",
    ],
    [
      t("insReturn"),
      `${portfolio.returnPercentage.toFixed(2)}%`,
      portfolio.returnPercentage >= 0 ? "text-emerald-600" : "text-[var(--sun)]",
    ],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-4 overflow-x-clip pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {t("insTitle")}
        </h1>

        <p className="mt-0.5 text-sm text-[var(--muted)]">
          {t("insSubtitle")}
        </p>
      </div>

      <AIInsightCard />

      <GoalProgressCard />

      {portfolio.totalAssets > 0 && (
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-3 text-sm font-bold">{t("insPortfolio")}</h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(([label, value, tone]) => (
              <div key={label}>
                <p className="text-xs text-[var(--muted)]">{label}</p>
                <p className={`mt-0.5 text-lg font-bold ${tone}`}>{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <NetWorthChart />
        </div>

        <div className="min-w-0">
          <FinancialInsights />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <IncomeExpenseChart />
        </div>

        <div className="min-w-0">
          <InvestmentPieChart />
        </div>
      </div>
    </div>
  );
}
