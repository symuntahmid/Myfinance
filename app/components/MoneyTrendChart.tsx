"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

const chartData = {
  "7D": [
    { label: "Mon", income: 220, expense: 80, savings: 140 },
    { label: "Tue", income: 150, expense: 110, savings: 40 },
    { label: "Wed", income: 320, expense: 150, savings: 170 },
    { label: "Thu", income: 280, expense: 120, savings: 160 },
    { label: "Fri", income: 410, expense: 220, savings: 190 },
    { label: "Sat", income: 300, expense: 180, savings: 120 },
    { label: "Sun", income: 260, expense: 90, savings: 170 },
  ],

  "30D": [
    { label: "W1", income: 2200, expense: 1200, savings: 1000 },
    { label: "W2", income: 2500, expense: 1700, savings: 800 },
    { label: "W3", income: 2800, expense: 1800, savings: 1000 },
    { label: "W4", income: 3200, expense: 2100, savings: 1100 },
  ],

  "6M": [
    { label: "Jan", income: 2400, expense: 1700, savings: 700 },
    { label: "Feb", income: 2600, expense: 1800, savings: 800 },
    { label: "Mar", income: 2800, expense: 1900, savings: 900 },
    { label: "Apr", income: 3100, expense: 2100, savings: 1000 },
    { label: "May", income: 3300, expense: 2200, savings: 1100 },
    { label: "Jun", income: 3500, expense: 2300, savings: 1200 },
  ],

  "1Y": [
    { label: "Jan", income: 2400, expense: 1700, savings: 700 },
    { label: "Mar", income: 2800, expense: 1900, savings: 900 },
    { label: "May", income: 3300, expense: 2200, savings: 1100 },
    { label: "Jul", income: 3600, expense: 2300, savings: 1300 },
    { label: "Sep", income: 3900, expense: 2400, savings: 1500 },
    { label: "Nov", income: 4200, expense: 2600, savings: 1600 },
  ],
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="min-w-[220px] rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">

      <p className="mb-4 text-lg font-bold text-slate-900">
        {label}
      </p>

      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-slate-600">Income</span>
          </div>

          <span className="font-bold text-green-600">
            ${payload[0].value}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-slate-600">Expense</span>
          </div>

          <span className="font-bold text-red-500">
            ${payload[1].value}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-500" />
            <span className="text-slate-600">Savings</span>
          </div>

          <span className="font-bold text-cyan-600">
            ${payload[2].value}
          </span>
        </div>

      </div>

    </div>
  );
}

export default function MoneyTrendChart() {
  const [range, setRange] =
    useState<"7D" | "30D" | "6M" | "1Y">("6M");

  const data = useMemo(() => chartData[range], [range]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold">
            Financial Trend
          </h2>

          <div className="mt-3 flex gap-5">

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              Income
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              Expense
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-500" />
              Savings
            </div>

          </div>
        </div>

        <div className="flex rounded-full bg-slate-100 p-1">

          {(["7D", "30D", "6M", "1Y"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                range === item
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <div className="mt-6 h-[380px] w-full">

        <ResponsiveContainer
  width="100%"
  height="100%"
  minWidth={500}
>

          <LineChart
  data={data}
  margin={{
    top: 20,
    right: 20,
    left: 0,
    bottom: 10,
  }}
>

            <defs>

              <filter id="greenGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="redGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="blueGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

            </defs>

            <XAxis
  dataKey="label"
  tickLine={false}
  axisLine={false}
  interval={0}
  tick={{
    fill: "#64748b",
    fontSize: 13,
    fontWeight: 600,
  }}
/>

            <Tooltip
  cursor={{
    stroke: "#cbd5e1",
    strokeWidth: 2,
    strokeDasharray: "5 5",
  }}
  content={<CustomTooltip />}
  animationDuration={200}
/>

           <Line
  type="monotone"
  dataKey="income"
  stroke="#22c55e"
  strokeWidth={4}
  dot={false}
  filter="url(#greenGlow)"
  activeDot={{
    r: 7,
    fill: "#22c55e",
    stroke: "#fff",
    strokeWidth: 3,
  }}
/>

           <Line
  type="monotone"
  dataKey="expense"
  stroke="#ef4444"
  strokeWidth={4}
  dot={false}
  filter="url(#redGlow)"
  activeDot={{
    r: 7,
    fill: "#ef4444",
    stroke: "#fff",
    strokeWidth: 3,
  }}
/>
<Line
  type="monotone"
  dataKey="savings"
  stroke="#06b6d4"
  strokeWidth={4}
  dot={false}
  filter="url(#blueGlow)"
  activeDot={{
    r: 7,
    fill: "#06b6d4",
    stroke: "#fff",
    strokeWidth: 3,
  }}
/>

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}