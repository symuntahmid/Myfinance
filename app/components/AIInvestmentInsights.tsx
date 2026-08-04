"use client";

import { Lightbulb, TrendingUp, ShieldCheck } from "lucide-react";

import {
  getAllocation,
  getPortfolioSummary,
} from "@/app/data/investments";

export default function AIInvestmentInsights() {
  const summary = getPortfolioSummary();
  const allocation = getAllocation();

  const total = summary.current;

  const sorted = Object.entries(allocation).sort(
    (a, b) => b[1] - a[1]
  );

  const largestAsset = sorted[0];

  const largestPercentage = largestAsset
    ? (largestAsset[1] / total) * 100
    : 0;

  let health = "Excellent";

  if (summary.returnPercentage < 0) {
    health = "Needs Attention";
  } else if (summary.returnPercentage < 10) {
    health = "Average";
  }

  return (
    <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-100 p-3">
          <Lightbulb className="h-6 w-6 text-cyan-700" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            AI Portfolio Insights
          </h2>

          <p className="text-slate-500">
            Personalized recommendations based on your portfolio.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">

        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />

          <div>
            <h3 className="font-semibold">
              Portfolio Health
            </h3>

            <p className="text-slate-600">
              Your current portfolio health is
              <span className="font-bold text-cyan-700">
                {" "}
                {health}
              </span>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <TrendingUp className="mt-1 h-5 w-5 text-cyan-600" />

          <div>
            <h3 className="font-semibold">
              Largest Holding
            </h3>

            <p className="text-slate-600">
              {largestAsset
                ? `${largestAsset[0]} represents ${largestPercentage.toFixed(
                    1
                  )}% of your portfolio.`
                : "No investments yet."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-cyan-50 p-5">
          <h3 className="font-semibold">
            AI Recommendation
          </h3>

          <p className="mt-2 text-slate-600">
            {largestPercentage > 70
              ? "Your portfolio is highly concentrated in one asset. Consider diversifying into ETFs, Gold, or Bonds to reduce risk."
              : "Your portfolio is reasonably diversified. Continue investing consistently and review allocations monthly."}
          </p>
        </div>

      </div>
    </div>
  );
}