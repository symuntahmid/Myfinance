"use client";

import { HeartPulse } from "lucide-react";

type FinancialHealthCardProps = {
  score: number;
};

export default function FinancialHealthCard({
  score,
}: FinancialHealthCardProps) {
  let label = "Critical";
  let color = "bg-red-500";

  if (score >= 80) {
    label = "Excellent";
    color = "bg-green-500";
  } else if (score >= 60) {
    label = "Good";
    color = "bg-yellow-500";
  } else if (score >= 40) {
    label = "Fair";
    color = "bg-orange-500";
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

      <p className="mt-4 text-center text-sm text-slate-500">
        Based on your actual income, expenses, savings,
        investments and financial activity this month.
      </p>

    </div>
  );
}