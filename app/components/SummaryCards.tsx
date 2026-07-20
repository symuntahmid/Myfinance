"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import StatCard from "./StatCard";
import { getSummary } from "../data/transactions";

export default function SummaryCards() {
  const [summary, setSummary] = useState({
    netWorth: 0,
    income: 0,
    expense: 0,
    investment: 0,
  });

  useEffect(() => {
    setSummary(getSummary());
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 mt-10">
      <StatCard
        title="Net Worth"
        value={`$${summary.netWorth.toLocaleString()}`}
        icon={<Wallet className="w-6 h-6" />}
      />

      <StatCard
        title="Monthly Income"
        value={`$${summary.income.toLocaleString()}`}
        icon={<TrendingUp className="w-6 h-6" />}
      />

      <StatCard
        title="Expenses"
        value={`$${summary.expense.toLocaleString()}`}
        icon={<TrendingDown className="w-6 h-6" />}
      />

      <StatCard
        title="Investments"
        value={`$${summary.investment.toLocaleString()}`}
        icon={<Landmark className="w-6 h-6" />}
      />
    </div>
  );
}