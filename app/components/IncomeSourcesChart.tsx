"use client";

import { getTransactions } from "@/app/data/transactions";

const categoryIcons: Record<string, string> = {
  Salary: "💼",
  Freelancing: "💻",
  Business: "🏢",
  Bonus: "🏆",
  Dividend: "📈",
  Investment: "💹",
  Gift: "🎁",
  Rental: "🏠",
  Interest: "🏦",
  Cashback: "💳",
  Refund: "↩️",
  Other: "💰",
};

export default function IncomeSourcesChart() {
  const income = getTransactions().filter(
    (t) => t.type === "Income"
  );

  const grouped: Record<string, number> = {};

  income.forEach((t) => {
    const category =
      t.category?.trim() || "Other";

    grouped[category] =
      (grouped[category] ?? 0) + t.amount;
  });

  const total = Object.values(grouped).reduce(
    (sum, value) => sum + value,
    0
  );

  const data = Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      percent:
        total === 0 ? 0 : (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="py-20 text-center text-slate-400">
        No income data yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((item) => (
        <div key={item.name}>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {categoryIcons[item.name] ?? "💰"}
              </span>

              <div>
                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-sm text-slate-500">
                  ${item.value.toLocaleString()}
                </p>
              </div>
            </div>

            <span className="font-bold text-emerald-600">
              {item.percent.toFixed(0)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700"
              style={{
                width: `${item.percent}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}