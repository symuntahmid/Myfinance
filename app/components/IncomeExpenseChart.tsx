"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { getSummary } from "../data/transactions";

function CustomTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
      <p className="text-sm text-slate-500">
        {item.payload.name}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        ${Number(item.value).toLocaleString()}
      </p>
    </div>
  );
}

export default function IncomeExpenseChart() {
  const [summary, setSummary] = useState(getSummary());

  useEffect(() => {
    function refresh() {
      setSummary(getSummary());
    }

    refresh();

    window.addEventListener(
      "transactionsUpdated",
      refresh
    );

    window.addEventListener(
      "investmentsUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        refresh
      );

      window.removeEventListener(
        "investmentsUpdated",
        refresh
      );
    };
  }, []);

  const data = [
    {
      name: "Income",
      amount: summary.income,
      color: "#22c55e",
    },
    {
      name: "Expense",
      amount: summary.expense,
      color: "#ef4444",
    },
    {
      name: "Investment",
      amount: summary.investment,
      color: "#14b8a6",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cash Flow Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Income vs Expenses
          </h2>

          <p className="mt-2 font-semibold text-cyan-600">
            Compare your monthly money flow
          </p>
        </div>

        <div className="flex gap-3">

          <div className="rounded-xl bg-green-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              Income
            </p>

            <p className="font-bold text-green-600">
              ${summary.income.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              Expense
            </p>

            <p className="font-bold text-red-600">
              ${summary.expense.toLocaleString()}
            </p>
          </div>

        </div>

      </div>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{
                fill: "#f8fafc",
              }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="amount"
              radius={[12, 12, 0, 0]}
              animationDuration={900}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}