"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

import {
  getTransactions,
  Transaction,
} from "@/app/data/transactions";

type Range = "7D" | "30D" | "6M" | "1Y";

type ChartItem = {
  label: string;
  income: number;
  expense: number;
  savings: number;
};

function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[220px] rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
      <p className="mb-4 text-lg font-bold text-slate-900">
        {label}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-slate-600">
              Income
            </span>
          </div>

          <span className="font-bold text-green-600">
            $
            {Number(
              payload[0]?.value ?? 0
            ).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-slate-600">
              Expense
            </span>
          </div>

          <span className="font-bold text-red-500">
            $
            {Number(
              payload[1]?.value ?? 0
            ).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-500" />
            <span className="text-slate-600">
              Savings
            </span>
          </div>

          <span className="font-bold text-cyan-600">
            $
            {Number(
              payload[2]?.value ?? 0
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MoneyTrendChart() {
  const [range, setRange] =
    useState<Range>("6M");

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  useEffect(() => {
    function refresh() {
      setTransactions(getTransactions());
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

  const data = useMemo<ChartItem[]>(() => {
    const now = new Date();

    switch (range) {
      case "7D": {
        const days: (ChartItem & {
          date: string;
        })[] = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);

          d.setDate(now.getDate() - i);

          days.push({
            label: d.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),
            date: d.toDateString(),
            income: 0,
            expense: 0,
            savings: 0,
          });
        }

        transactions.forEach((t) => {
          const date =
            new Date(t.date).toDateString();

          const day = days.find(
            (d) => d.date === date
          );

          if (!day) return;

          if (t.type === "Income")
            day.income += t.amount;

          if (t.type === "Expense")
            day.expense += t.amount;
        });

        return days.map((d) => ({
          label: d.label,
          income: d.income,
          expense: d.expense,
          savings:
            d.income - d.expense,
        }));
      }

      case "30D": {
        const weeks: ChartItem[] = [
          {
            label: "Week 1",
            income: 0,
            expense: 0,
            savings: 0,
          },
          {
            label: "Week 2",
            income: 0,
            expense: 0,
            savings: 0,
          },
          {
            label: "Week 3",
            income: 0,
            expense: 0,
            savings: 0,
          },
          {
            label: "Week 4",
            income: 0,
            expense: 0,
            savings: 0,
          },
        ];

        transactions.forEach((t) => {
          const diff =
            (now.getTime() -
              new Date(
                t.date
              ).getTime()) /
            86400000;

          if (diff > 30) return;

          const index = Math.min(
            3,
            Math.floor(diff / 7)
          );

          const week =
            weeks[3 - index];

          if (t.type === "Income")
            week.income += t.amount;

          if (t.type === "Expense")
            week.expense += t.amount;
        });

        weeks.forEach((w) => {
          w.savings =
            w.income - w.expense;
        });

        return weeks;
      }

      default: {
        const count =
          range === "6M" ? 6 : 12;

        const months: (ChartItem & {
          month: number;
          year: number;
        })[] = [];

        for (
          let i = count - 1;
          i >= 0;
          i--
        ) {
          const d = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );

          months.push({
            label:
              d.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                }
              ),
            month: d.getMonth(),
            year: d.getFullYear(),
            income: 0,
            expense: 0,
            savings: 0,
          });
        }

        transactions.forEach((t) => {
          const d = new Date(t.date);

          const month =
            months.find(
              (m) =>
                m.month ===
                  d.getMonth() &&
                m.year ===
                  d.getFullYear()
            );

          if (!month) return;

          if (t.type === "Income")
            month.income += t.amount;

          if (t.type === "Expense")
            month.expense += t.amount;
        });

        return months.map((m) => ({
          label: m.label,
          income: m.income,
          expense: m.expense,
          savings:
            m.income - m.expense,
        }));
      }
    }
  }, [transactions, range]);
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
          {(
            ["7D", "30D", "6M", "1Y"] as const
          ).map((item) => (
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
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="redGlow">
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="blueGlow">
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />
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