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
import { getPortfolioSummary } from "../data/investments";

export default function SummaryCards() {
  const [summary, setSummary] = useState(getSummary());

  const [portfolio, setPortfolio] = useState(
    getPortfolioSummary()
  );

  useEffect(() => {
    function refresh() {
      setSummary(getSummary());
      setPortfolio(getPortfolioSummary());
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
        value={`$${portfolio.current.toLocaleString()}`}
        icon={<Landmark className="h-6 w-6" />}
      />
    </div>
  );
}