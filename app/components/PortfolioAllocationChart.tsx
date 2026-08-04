"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { getAllocation } from "@/app/data/investments";

const COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
];

export default function PortfolioAllocationChart() {
  const allocation = getAllocation();

  const data = Object.entries(allocation).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (data.length === 0) {
    return null;
  }

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Portfolio Allocation
      </h2>

      <p className="mt-2 mb-6 text-slate-500">
        Distribution of your investments.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Value",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-4">
          {data.map((item, index) => {
            const percentage =
              (item.value / total) * 100;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-medium">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    $
                    {item.value.toLocaleString()}
                  </div>

                  <div className="text-sm text-slate-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}