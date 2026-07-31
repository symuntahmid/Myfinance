"use client";

import { getTransactions } from "@/app/data/transactions";

const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Rent: "🏠",
  Entertainment: "🎮",
  Healthcare: "❤️",
  Education: "📚",
  Other: "📦",
};

export default function ExpenseBreakdownChart() {
  const expenses = getTransactions().filter(
    (t) => t.type === "Expense"
  );

  const grouped: Record<string, number> = {};

  expenses.forEach((t) => {
    const category = t.category ?? "Other";

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
        No expense data yet.
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
                {categoryIcons[item.name] ?? "📦"}
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

            <span className="font-bold text-red-500">
              {item.percent.toFixed(0)}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 transition-all duration-700"
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