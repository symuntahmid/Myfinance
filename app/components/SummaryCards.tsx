"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";

import StatCard from "./StatCard";
import { getSummary } from "../data/transactions";

export default function SummaryCards() {
  const [summary, setSummary] = useState(getSummary());

  useEffect(() => {
    function refreshSummary() {
      setSummary(getSummary());
    }

    // Load latest data
    refreshSummary();

    // Listen for transaction updates
    window.addEventListener(
      "transactionsUpdated",
      refreshSummary
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        refreshSummary
      );
    };
  }, []);

  return (
    <div className="mt-10 grid grid-cols-2 gap-6">
      <StatCard
        title="Net Worth"
        value={`$${summary.netWorth.toLocaleString()}`}
        icon={<Wallet className="h-6 w-6" />}
      />

      <StatCard
        title="Monthly Income"
        value={`$${summary.income.toLocaleString()}`}
        icon={<TrendingUp className="h-6 w-6" />}
      />

      <StatCard
        title="Expenses"
        value={`$${summary.expense.toLocaleString()}`}
        icon={<TrendingDown className="h-6 w-6" />}
      />

      <StatCard
        title="Investments"
        value={`$${summary.investment.toLocaleString()}`}
        icon={<Landmark className="h-6 w-6" />}
      />
    </div>
  );
}