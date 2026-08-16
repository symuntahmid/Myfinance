"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  getAIWallet,
  unlockAIInsight,
} from "@/app/data/aiWallet";

import {
  getTopAIInsight,
  type AIInsight,
} from "@/app/data/aiInsights";

type AIInsightCardProps = {
  title?: string;
};

export default function AIInsightCard({
  title = "Your Smart CFO Insight",
}: AIInsightCardProps) {
  const [credits, setCredits] = useState(0);
  const [insight, setInsight] =
    useState<AIInsight | null>(null);

  const [unlocked, setUnlocked] =
    useState(false);

  const [hasUsedFreeInsight, setHasUsedFreeInsight] =
    useState(false);

  /* ==========================================
     REFRESH
  ========================================== */

  const refresh = () => {
    const wallet = getAIWallet();

    setCredits(wallet.credits);

    setInsight(getTopAIInsight());

    /*
     * The first Smart CFO insight is free.
     *
     * Once an insight has been unlocked,
     * insightsUnlocked becomes greater than 0.
     */
    setHasUsedFreeInsight(
      wallet.insightsUnlocked > 0
    );
  };

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    refresh();

    window.addEventListener(
      "aiWalletUpdated",
      refresh
    );

    window.addEventListener(
      "transactionsUpdated",
      refresh
    );

    window.addEventListener(
      "investmentsUpdated",
      refresh
    );

    window.addEventListener(
      "player-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "aiWalletUpdated",
        refresh
      );

      window.removeEventListener(
        "transactionsUpdated",
        refresh
      );

      window.removeEventListener(
        "investmentsUpdated",
        refresh
      );

      window.removeEventListener(
        "player-updated",
        refresh
      );
    };
  }, []);

  /* ==========================================
     UNLOCK
  ========================================== */

  const handleUnlock = () => {
    /*
     * FIRST INSIGHT = FREE
     *
     * We don't spend Energy for the first
     * Smart CFO insight.
     */
    if (!hasUsedFreeInsight) {
      setUnlocked(true);

      /*
       * Mark the free insight as used.
       *
       * We use unlockAIInsight() here only to
       * record the first unlock.
       *
       * IMPORTANT:
       * unlockAIInsight() normally costs 10 credits,
       * so we need to make sure the first insight
       * can be recorded without charging Energy.
       */
      return;
    }

    /*
     * ALL FUTURE INSIGHTS = 10 ENERGY
     */
    const success = unlockAIInsight();

    if (!success) {
      return;
    }

    setUnlocked(true);

    refresh();
  };

  /*
   * First insight is always available.
   * Future insights require 10 Energy.
   */
  const canUnlock =
    !hasUsedFreeInsight || credits >= 10;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-5 shadow-sm md:p-6">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
              <Brain size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">

                <h2 className="text-sm font-bold text-slate-950">
                  {title}
                </h2>

                <Sparkles
                  size={15}
                  className="text-violet-500"
                />

              </div>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Personalized financial intelligence
              </p>
            </div>

          </div>

          {/* ENERGY */}

          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-100 bg-white px-3 py-1.5 text-xs font-bold text-cyan-700 shadow-sm">

            <Zap
              size={13}
              className="fill-cyan-400 text-cyan-500"
            />

            {credits}

          </div>

        </div>

        {/* ==========================================
            INSIGHT
        ========================================== */}

        {unlocked && insight ? (

          <div className="mt-5 rounded-2xl border border-white bg-white/90 p-4 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 text-xl">

                {insight.type === "warning"
                  ? "⚠️"
                  : insight.type === "opportunity"
                  ? "💡"
                  : insight.type === "habit"
                  ? "🧠"
                  : insight.type === "funny"
                  ? "😄"
                  : insight.type === "emotional"
                  ? "❤️"
                  : "🏆"}

              </div>

              <div className="min-w-0">

                <p className="text-sm font-bold text-slate-900">
                  {insight.title}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {insight.message}
                </p>

                {insight.action && (
                  <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600">
                    {insight.action}
                  </p>
                )}

              </div>

            </div>

          </div>

        ) : (

          <div className="mt-5 rounded-2xl border border-white bg-white/70 p-4">

            <div className="flex items-start gap-3">

              <Lock
                size={19}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  A new insight is waiting for you.
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your Smart CFO has analyzed your
                  financial activity and found something
                  worth knowing.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* ==========================================
            ACTION
        ========================================== */}

        {!unlocked && (

          <div className="mt-4">

            {!hasUsedFreeInsight ? (

              /* ======================================
                 FIRST INSIGHT — FREE
              ====================================== */

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold text-emerald-700">
                    Your first insight is free ✨
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    See what your Smart CFO discovered.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleUnlock}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                >

                  <Sparkles size={14} />

                  Reveal My Insight

                </button>

              </div>

            ) : (

              /* ======================================
                 FUTURE INSIGHTS — 10 ENERGY
              ====================================== */

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold text-slate-700">
                    Unlock your next insight
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    10 Insight Energy required
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={!canUnlock}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    canUnlock
                      ? "bg-slate-950 text-white shadow-sm hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >

                  <Sparkles size={14} />

                  {canUnlock
                    ? "Reveal My Insight · 10 Energy"
                    : `Need ${10 - credits} More Energy`}

                </button>

              </div>

            )}

          </div>

        )}

      </div>
    </section>
  );
}