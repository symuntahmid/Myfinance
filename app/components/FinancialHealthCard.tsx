"use client";

import { HeartPulse } from "lucide-react";
import { getFinancialHealth } from "@/app/data/player";

export default function FinancialHealthCard() {
  const score = getFinancialHealth();

  let color = "bg-red-500";
  let label = "Poor";

  if (score >= 80) {
    color = "bg-green-500";
    label = "Excellent";
  } else if (score >= 60) {
    color = "bg-yellow-500";
    label = "Good";
  } else if (score >= 40) {
    color = "bg-orange-500";
    label = "Fair";
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">

      <div className="flex items-center gap-3">
        <HeartPulse className="text-red-500" />
        <h2 className="text-2xl font-bold">
          Financial Health
        </h2>
      </div>

      <div className="mt-8 text-center">

        <div className="text-6xl font-extrabold">
          {score}
        </div>

        <p className="mt-2 text-lg text-slate-500">
          {label}
        </p>

      </div>

      <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full ${color} transition-all duration-700`}
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  );
}