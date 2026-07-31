"use client";

import Link from "next/link";

import ExpenseBreakdownChart from "@/app/components/ExpenseBreakdownChart";
import IncomeSourcesChart from "@/app/components/IncomeSourcesChart";
import FinancialHealthCard from "@/app/components/FinancialHealthCard";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold tracking-tight">
            Money Analytics
          </h1>

          <p className="mt-2 text-slate-500 text-lg">
            Deep insights into your financial behavior.
          </p>

        </div>

        <Link
          href="/money"
          className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          ← Back
        </Link>

      </div>

      {/* Hero */}

      <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl">

        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
          AI ANALYTICS
        </p>

        <h2 className="mt-5 text-5xl font-bold leading-tight">
          Understand
          <br />
          your money.
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-white/70">
          See where your income comes from, where your expenses go,
          and whether your financial habits are improving every month.
        </p>

      </div>

      {/* Charts */}

      <div className="grid gap-8 xl:grid-cols-2">

        <ExpenseBreakdownChart />

        <IncomeSourcesChart />

      </div>

      {/* Financial Health */}

      <FinancialHealthCard />

    </div>
  );
}