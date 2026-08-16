"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";

import {
  getAIWallet,
  rewardAIAd,
} from "@/app/data/aiWallet";

type AIInsightEnergyProps = {
  requiredEnergy?: number;
};

export default function AIInsightEnergy({
  requiredEnergy = 10,
}: AIInsightEnergyProps) {
  const [energy, setEnergy] = useState(0);

  const refreshEnergy = () => {
    const wallet = getAIWallet();

    setEnergy(wallet.credits);
  };

  useEffect(() => {
    refreshEnergy();

    window.addEventListener(
      "aiWalletUpdated",
      refreshEnergy
    );

    return () => {
      window.removeEventListener(
        "aiWalletUpdated",
        refreshEnergy
      );
    };
  }, []);

  const missingEnergy = Math.max(
    requiredEnergy - energy,
    0
  );

  /*
   * Development rewarded-ad simulation.
   *
   * Later this button will be replaced by the
   * real rewarded-ad provider.
   */
  const handleWatchAd = () => {
  rewardAIAd();
};

  const canUnlock = energy >= requiredEnergy;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ==========================================
          CURIOSITY / TEASER
      ========================================== */}

      <div className="p-4">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={19} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-bold text-slate-900">
              Your Smart CFO found something.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              There may be an opportunity in your
              financial activity that could help you
              make a better money decision this month.
            </p>

          </div>

        </div>

        {/* ==========================================
            ENERGY STATUS
        ========================================== */}

        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

          <div className="flex items-center gap-2">

            <Zap
              size={15}
              className="fill-cyan-400 text-cyan-500"
            />

            <span className="text-xs font-semibold text-slate-700">
              Insight Energy
            </span>

          </div>

          <span className="text-xs font-bold text-cyan-600">
            {energy} / {requiredEnergy}
          </span>

        </div>

        {/* ==========================================
            ACTION
        ========================================== */}

        <div className="mt-4">

          {canUnlock ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    Your insight is ready
                  </p>

                  <p className="mt-0.5 text-[11px] text-emerald-600">
                    You have enough Energy to reveal it.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="shrink-0 text-emerald-600"
                />

              </div>

            </div>
          ) : (
            <>
              {/* GAP */}
              <div className="mb-3">

                <p className="text-xs font-semibold text-slate-700">
                  You're only {missingEnergy} Energy away.
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Watch a short ad and we'll add 5 Energy.
                </p>

              </div>

              {/* WATCH AD */}
              <button
                type="button"
                onClick={handleWatchAd}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
              >
                <Play
                  size={14}
                  className="fill-white"
                />

                Watch 1 short ad

                <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-cyan-300">
                  +5 Energy
                </span>
              </button>

              {/* VALUE REINFORCEMENT */}
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Your Energy stays with you after you
                leave the app.
              </p>
            </>
          )}

        </div>

      </div>

      {/* ==========================================
          PREMIUM
      ========================================== */}

      <div className="border-t border-slate-100 bg-gradient-to-r from-amber-50/70 to-violet-50/70 px-4 py-3">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-500 shadow-sm">
            <Crown size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-bold text-slate-800">
              Want unlimited Smart CFO insights?
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Upgrade to remove Energy limits and ads.
            </p>

          </div>

          <button
            type="button"
            className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-violet-600 shadow-sm transition hover:bg-violet-50"
          >
            Upgrade
          </button>

        </div>

      </div>

    </div>
  );
}