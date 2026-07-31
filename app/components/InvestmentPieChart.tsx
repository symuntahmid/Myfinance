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

import {
  getAllocation,
  getPortfolioSummary,
} from "../data/investments";

const COLORS = [
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#64748b",
];

function CustomTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
      <p className="text-sm text-slate-500">
        {item.name}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        ${Number(item.value).toLocaleString()}
      </p>

      <p className="mt-1 font-semibold text-cyan-600">
        {item.payload.percent.toFixed(1)}%
      </p>
    </div>
  );
}

export default function InvestmentPieChart() {
  const [data, setData] = useState<any[]>([]);
  const [portfolio, setPortfolio] =
    useState(getPortfolioSummary());

  useEffect(() => {
    function refreshChart() {
      const allocation = getAllocation();
      const summary = getPortfolioSummary();

      const total = Object.values(
        allocation
      ).reduce(
        (sum, value) => sum + value,
        0
      );

      const chartData = Object.entries(
        allocation
      ).map(([name, value]) => ({
        name,
        value,
        percent:
          total === 0
            ? 0
            : (value / total) * 100,
      }));

      setPortfolio(summary);
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

  const largestHolding =
    data.length > 0
      ? [...data].sort(
          (a, b) => b.value - a.value
        )[0]
      : null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Investment Allocation
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Portfolio Diversification
          </h2>

          <p className="mt-2 font-semibold text-cyan-600">
            {portfolio.totalAssets} Assets •{" "}
            {data.length} Categories
          </p>
        </div>

        {largestHolding && (
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 shadow-sm">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Largest Holding
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {largestHolding.name}
            </h3>

            <p className="mt-1 font-semibold text-cyan-600">
              {largestHolding.percent.toFixed(
                1
              )}
              %
            </p>

          </div>
        )}

      </div>

      {/* Chart */}

      <div className="h-80">
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
                outerRadius={105}
                innerRadius={65}
                paddingAngle={3}
                animationDuration={900}
                label={({ percent }) =>
                  `${(
                    (percent ?? 0) * 100
                  ).toFixed(0)}%`
                }
              >
                {data.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                      stroke="#ffffff"
                      strokeWidth={3}
                    />
                  )
                )}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: 20,
                }}
              />

            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}