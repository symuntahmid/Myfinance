"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getSummary } from "../data/transactions";

export default function IncomeExpenseChart() {
  const summary = getSummary();

  const data = [
    {
      name: "Income",
      amount: summary.income,
    },
    {
      name: "Expense",
      amount: summary.expense,
    },
    {
      name: "Investment",
      amount: summary.investment,
    },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Financial Overview
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}