"use client";

import { useEffect, useState } from "react";
import { Flame, Coins } from "lucide-react";

import { getPlayer } from "../data/player";
import { getMonthlyReport } from "../data/transactions";

export default function DailyJourneyCard() {
  const [mounted, setMounted] = useState(false);

  const [player, setPlayer] = useState<ReturnType<
    typeof getPlayer
  > | null>(null);

  const [report, setReport] = useState<ReturnType<
    typeof getMonthlyReport
  > | null>(null);

  useEffect(() => {
    setMounted(true);

    const refresh = () => {
      setPlayer(getPlayer());
      setReport(getMonthlyReport());
    };

    refresh();

    window.addEventListener("player-updated", refresh);
    window.addEventListener("transactionsUpdated", refresh);
    window.addEventListener("dailyJourneyUpdated", refresh);

    return () => {
      window.removeEventListener("player-updated", refresh);
      window.removeEventListener("transactionsUpdated", refresh);
      window.removeEventListener("dailyJourneyUpdated", refresh);
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted || !player || !report) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        </div>

        <div className="mt-5 h-28 animate-pulse rounded-2xl bg-slate-100" />
      </section>
    );
  }

  /*
   * Monthly saving = positive monthly net cash flow.
   * If cash flow is negative, saving is $0.
   */
  const monthlySaving = Math.max(report.netCashFlow, 0);

  // Temporary target — can become user-controlled later.
  const monthlySavingTarget = 125;

  const savingProgress =
    monthlySavingTarget > 0
      ? Math.min(
          (monthlySaving / monthlySavingTarget) * 100,
          100
        )
      : 0;

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Your Money Progress
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Keep building better habits
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track your consistency and savings progress.
        </p>
      </div>


      {/* Main Stats */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        {/* Money Streak */}

        <div className="rounded-2xl bg-orange-50 p-5">

          <div className="flex items-center gap-2 text-orange-600">
            <Flame size={20} />

            <span className="text-sm font-semibold">
              Money Streak
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {player.streak}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            consecutive days
          </p>

        </div>


        {/* This Month's Saving */}

        <div className="rounded-2xl bg-emerald-50 p-5">

          <div className="flex items-center gap-2 text-emerald-600">
            <Coins size={20} />

            <span className="text-sm font-semibold">
              This Month's Saving
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {formatMoney(monthlySaving)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            saved this month
          </p>

        </div>

      </div>


      {/* Monthly Saving Progress */}

      <div className="mt-5 rounded-2xl bg-slate-50 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Monthly saving goal
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              Target: {formatMoney(monthlySavingTarget)}
            </p>

          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-600">
            {savingProgress.toFixed(0)}%
          </span>

        </div>


        {/* Progress Bar */}

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
            style={{
              width: `${savingProgress}%`,
            }}
          />

        </div>


        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>
            {formatMoney(monthlySaving)} saved
          </span>

          <span>
            {formatMoney(
              Math.max(monthlySavingTarget - monthlySaving, 0)
            )}{" "}
            remaining
          </span>
        </div>

      </div>

    </section>
  );
}