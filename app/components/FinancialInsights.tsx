"use client";

import { getSummary } from "../data/transactions";
import { t } from "@/app/data/i18n";

export default function FinancialInsights() {
  const summary = getSummary();

  const savings = summary.income - summary.expense;

  const savingsRate =
    summary.income > 0
      ? Math.round((savings / summary.income) * 100)
      : 0;

  const insights: string[] = [];

  if (summary.income === 0) {
    insights.push(
      t("addFirstIncome")
    );
  } else {

    if (savingsRate >= 50) {
      insights.push(
        t("excellentSavings")
      );
    }

    else if (savingsRate >= 30) {
      insights.push(
        t("healthySavings")
      );
    }

    else if (savingsRate >= 10) {
      insights.push(
        t("consistentSavings")
      );
    }

    else {
      insights.push(
        t("reduceExpenses")
      );
    }
  }


  if (
    summary.investment >
    summary.income * 0.5
  ) {
    insights.push(
      t("investmentsMajorWealth")
    );
  }


  if (
    summary.expense >
    summary.income
  ) {
    insights.push(
      t("expensesHigherIncome")
    );
  }


  return (

    <div
      className="
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-8
        shadow-sm
      "
    >

      <h2
        className="
          font-display
          text-3xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
        "
      >
        {t("financialInsights")}
      </h2>


      <p
        className="
          mt-3
          text-sm
          font-normal
          leading-relaxed
          tracking-tight
          text-[var(--muted)]
        "
      >
        {t("personalizedObservations")}
      </p>


      <div
        className="
          mt-6
          space-y-4
        "
      >

        {insights.map(
          (item, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                p-4
                text-sm
                font-normal
                leading-7
                tracking-tight
                text-[var(--foreground)]
              "
            >
              💡 {item}
            </div>

          )
        )}

      </div>

    </div>
  );
}