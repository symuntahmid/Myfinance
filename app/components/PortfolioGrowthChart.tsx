"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getPortfolioHistory } from "@/app/data/portfolioHistory";

export default function PortfolioGrowthChart() {
  const history = getPortfolioHistory();

  const data = history.map((item) => ({
    day: new Date(item.date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    ),
    value: item.value,
  }));

  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold">
          Portfolio Growth
        </h2>

        <p className="mb-6 text-slate-500">
          Track the growth of your investment portfolio.
        </p>

        <div className="flex h-64 items-center justify-center text-slate-500">
          No portfolio history yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold">
        Portfolio Growth
      </h2>

      <p className="mb-6 text-slate-500">
        Track the growth of your investment portfolio.
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#06b6d4"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="#06b6d4"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.12)",
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Portfolio Value",
              ]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#portfolioGradient)"
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={{
                r: 5,
                strokeWidth: 2,
                fill: "#ffffff",
              }}
              activeDot={{
                r: 8,
                fill: "#06b6d4",
              }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}