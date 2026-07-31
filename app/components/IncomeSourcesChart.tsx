"use client";

import {
  Briefcase,
  Laptop,
  Building2,
  Gift,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { getTransactions } from "@/app/data/transactions";

const categoryIcons: Record<
  string,
  React.ElementType
> = {
  Salary: Briefcase,
  Freelancing: Laptop,
  Business: Building2,
  Bonus: Gift,
  Investment: TrendingUp,
  Dividend: DollarSign,
  Other: Briefcase,
};

const colors = [
  "from-emerald-500 to-teal-400",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
];

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
        total === 0
          ? 0
          : (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="py-20 text-center text-slate-400">
        No income recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((item, index) => {
        const Icon =
          categoryIcons[item.name] ?? Briefcase;

        return (
          <div key={item.name}>

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                  <Icon
                    size={20}
                    className="text-slate-700"
                  />
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    $
                    {item.value.toLocaleString()}
                  </p>

                </div>

              </div>

              <span className="text-lg font-bold text-slate-800">
                {item.percent.toFixed(0)}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className={`h-full rounded-full bg-gradient-to-r ${
                  colors[index % colors.length]
                } transition-all duration-700`}
                style={{
                  width: `${item.percent}%`,
                }}
              />

            </div>

          </div>
        );
      })}
    </div>
  );
}