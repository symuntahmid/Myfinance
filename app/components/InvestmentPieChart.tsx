"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { getTransactions } from "../data/transactions";

const COLORS = [
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
  "#64748b",
];

export default function InvestmentPieChart() {
  const transactions = getTransactions();

  const investments = transactions.filter(
    (t) => t.type === "Investment"
  );

  const grouped = investments.reduce((acc, transaction) => {
    const category = transaction.category || "Other";

    acc[category] =
      (acc[category] || 0) + transaction.amount;

    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(grouped).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Investment Allocation
      </h2>

      <p className="mt-2 text-slate-500">
        Portfolio distribution by investment category.
      </p>

      <div className="mt-8 h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>
  <Pie
    data={data}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={95}
    innerRadius={55}
    paddingAngle={3}
    animationDuration={1000}
    label={({ percent }) =>
      `${((percent ?? 0) * 100).toFixed(0)}%`
    }
  >
    {data.map((_, index) => (
      <Cell
        key={index}
        fill={COLORS[index % COLORS.length]}
      />
    ))}
  </Pie>

  <Tooltip
    formatter={(value: number) =>
      `$${value.toLocaleString()}`
    }
  />

  <Legend />
</PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}