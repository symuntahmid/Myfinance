"use client";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { getAllocation } from "../data/investments";

const COLORS = [
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
  "#64748b",
  "#f97316",
  "#06b6d4",
  "#84cc16",
];

export default function InvestmentPieChart() {
  const [data, setData] = useState<
    {
      name: string;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    function refreshChart() {
      const allocation = getAllocation();

      const chartData = Object.entries(allocation).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      setData(chartData);
    }

    refreshChart();

    window.addEventListener(
      "investmentsUpdated",
      refreshChart
    );

    return () => {
      window.removeEventListener(
        "investmentsUpdated",
        refreshChart
      );
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Investment Allocation
      </h2>

      <p className="mt-2 text-slate-500">
        Portfolio distribution by investment category.
      </p>

      <div className="mt-8 h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            No investments yet
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                animationDuration={900}
                label={({ percent }) =>
                  `${((percent ?? 0) * 100).toFixed(
                    0
                  )}%`
                }
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
  formatter={(value) =>
    `$${Number(value).toLocaleString()}`
  }
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}