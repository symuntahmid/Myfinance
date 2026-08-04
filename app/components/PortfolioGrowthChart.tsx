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
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            {/* Gradient */}
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#06b6d4"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="#06b6d4"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Softer Grid */}
            <CartesianGrid
              stroke="#F1F5F9"
              strokeDasharray="4 4"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
              width={55}
            />

            {/* Premium Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 12px 35px rgba(15,23,42,.15)",
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Portfolio Value",
              ]}
            />

            {/* Gradient Area */}
            <Area
              type="natural"
              dataKey="value"
              stroke="none"
              fill="url(#portfolioGradient)"
            />

            {/* Line */}
            <Line
              type="natural"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: 8,
                fill: "#06b6d4",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              isAnimationActive
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}