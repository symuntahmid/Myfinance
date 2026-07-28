"use client";

import MoneyTrendChart from "@/app/components/MoneyTrendChart";
import FloatingActionButton from "@/app/components/FloatingActionButton";

export default function MoneyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-0">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold tracking-tight">
          My Money
        </h1>

        <p className="mt-2 text-slate-500">
          Good morning, Symun 👋
        </p>

        {/* Motivation Card */}

        <div className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-7 text-white shadow-xl">

          <h2 className="text-xl md:text-2xl font-bold">
            You're saving 18% more than last month.
          </h2>

          <p className="mt-2 text-white/80">
            Keep it up. You're building strong financial habits.
          </p>

        </div>

      </div>

      {/* Balance */}

      <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">

        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Current Balance
        </p>

        <h2 className="mt-4 text-4xl md:text-6xl font-bold">
          $12,540
        </h2>

        <div className="mt-5 inline-flex rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-300">
          ▲ +8.2% this month
        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-3 md:gap-6">

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Income
          </p>

          <h3 className="mt-4 text-4xl font-bold text-green-600">
            +$3,200
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            This Month
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Expenses
          </p>

          <h3 className="mt-4 text-4xl font-bold text-red-500">
            -$1,180
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            This Month
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Savings
          </p>

          <h3 className="mt-4 text-4xl font-bold text-cyan-600">
            $2,020
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            63% Saving Rate
          </p>

        </div>

      </div>

      {/* Chart */}

      <MoneyTrendChart />

<FloatingActionButton />

      {/* Recent Activity */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <h2 className="text-xl md:text-2xl font-bold">
            Recent Activity
          </h2>

          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View All
          </button>

        </div>

        <div className="mt-8 space-y-5">

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div>

              <p className="font-semibold">
                Salary
              </p>

              <p className="text-sm text-slate-500">
                Today
              </p>

            </div>

            <p className="text-xl font-bold text-green-600">
              +$2,500
            </p>

          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div>

              <p className="font-semibold">
                Grocery Shopping
              </p>

              <p className="text-sm text-slate-500">
                Yesterday
              </p>

            </div>

            <p className="text-xl font-bold text-red-500">
              -$85
            </p>

          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div>

              <p className="font-semibold">
                Netflix
              </p>

              <p className="text-sm text-slate-500">
                2 days ago
              </p>

            </div>

            <p className="text-xl font-bold text-red-500">
              -$16
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}