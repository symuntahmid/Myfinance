"use client";

import Link from "next/link";

import ExpenseBreakdownChart from "@/app/components/ExpenseBreakdownChart";
import IncomeSourcesChart from "@/app/components/IncomeSourcesChart";

import { t } from "@/app/data/i18n";

export default function AnalyticsPage() {
  return (
    <div
      className="
      mx-auto
      max-w-7xl
      space-y-8
      px-4
      md:px-0
      "
    >
      {/* Header */}

      <div
        className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        "
      >
        <div>
          <h1
            className="
            font-display
            text-5xl
            font-medium
            tracking-[-0.05em]
            text-[var(--foreground)]
            "
          >
            {t("analytics")}
          </h1>

          <p
            className="
            mt-3
            font-body
            text-sm
            leading-relaxed
            tracking-tight
            text-[var(--muted)]
            "
          >
            {t("moneyAnalyticsDescription")}
          </p>
        </div>

        <Link
          href="/money"
          className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          px-6
          py-3
          font-body
          font-medium
          text-[var(--foreground)]
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
          "
        >
          ← Back
        </Link>
      </div>

      {/* Hero */}

      <div
        className="
        rounded-[36px]
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-slate-900
        p-8
        text-white
        shadow-2xl
        md:p-10
        "
      >
        <p
          className="
          font-body
          text-xs
          font-medium
          uppercase
          tracking-[0.18em]
          text-cyan-300
          "
        >
          {t("analytics")}
        </p>

        <h2
          className="
          mt-5
          font-display
          text-5xl
          font-medium
          leading-tight
          tracking-[-0.05em]
          md:text-6xl
          "
        >
          {t("exploreMoneyAnalytics")}
        </h2>

        <p
          className="
          mt-5
          max-w-2xl
          font-body
          text-base
          leading-relaxed
          text-white/70
          md:text-lg
          "
        >
          {t("moneyAnalyticsDescription")}
        </p>
      </div>

      {/* Charts */}

      <div
        className="
        grid
        gap-8
        xl:grid-cols-2
        "
      >
        <ExpenseBreakdownChart />

        <IncomeSourcesChart />
      </div>
    </div>
  );
}