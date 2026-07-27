"use client";

import { Target } from "lucide-react";
import { getPlayer } from "@/app/data/player";

export default function FinancialGoalsCard() {
  const player = getPlayer();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">

      <div className="flex items-center gap-3">
        <Target className="text-indigo-600" />
        <h2 className="text-2xl font-bold">
          Financial Goals
        </h2>
      </div>

      <div className="mt-6 space-y-5">

        <div>
          <div className="mb-2 flex justify-between">
            <span>Net Worth Goal</span>
            <strong>
              ${player.netWorth.toLocaleString()} / $100,000
            </strong>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${Math.min(
                  (player.netWorth / 100000) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span>Emergency Fund</span>
            <strong>40%</strong>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: "40%" }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span>Investment Goal</span>
            <strong>
              ${player.investments.toLocaleString()} / $50,000
            </strong>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{
                width: `${Math.min(
                  (player.investments / 50000) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}