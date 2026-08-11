"use client";

import { useEffect, useState } from "react";
import { completeTask } from "../../data/dailyJourney";
import {
  getMonthlyReport,
  getFinancialHealthScore,
} from "../../data/transactions";

import {
  getPortfolioSummary,
} from "../../data/investments";

import FinancialHealthCard from "../../components/reports/FinancialHealthCard";
import MonthlyTrendChart from "../../components/reports/MonthlyTrendChart";

export default function ReportsPage() {
  const [report, setReport] = useState(() =>
    getMonthlyReport()
  );

  const [score, setScore] = useState(() =>
    getFinancialHealthScore()
  );

  const [portfolio, setPortfolio] = useState(() =>
    getPortfolioSummary()
  );

  useEffect(() => {
    const refreshReport = () => {
      setReport(getMonthlyReport());
      setScore(getFinancialHealthScore());
      setPortfolio(getPortfolioSummary());
    };

    refreshReport();

    window.addEventListener(
      "transactionsUpdated",
      refreshReport
    );

    window.addEventListener(
      "investmentsUpdated",
      refreshReport
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        refreshReport
      );

      window.removeEventListener(
        "investmentsUpdated",
        refreshReport
      );
    };
  }, []);

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  const investmentProfitPositive =
    portfolio.profit >= 0;

  const investmentReturnPositive =
    portfolio.returnPercentage >= 0;

  return (
    <div className="space-y-8">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div>
        <h1 className="text-4xl font-bold">
          Monthly Report
        </h1>

        <p className="mt-2 text-slate-500">
          A clear picture of your financial performance this month.
        </p>
      </div>


      {/* ==========================================
          FINANCIAL HEALTH
      ========================================== */}

      <FinancialHealthCard score={score} />


      {/* ==========================================
          MONTHLY OVERVIEW
      ========================================== */}

      <section>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Monthly Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            How your money moved this month.
          </p>
        </div>


        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Income */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Income
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {formatMoney(report.income)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Money received this month
            </p>

          </div>


          {/* Expenses */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Expenses
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {formatMoney(report.expense)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Money spent this month
            </p>

          </div>


          {/* Investments */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Invested This Month
            </p>

            <h3 className="mt-2 text-3xl font-bold text-indigo-600">
              {formatMoney(report.investmentSpent)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Money allocated to investments
            </p>

          </div>


          {/* Savings */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Net Cash Flow
            </p>

            <h3
              className={`mt-2 text-3xl font-bold ${
                report.netCashFlow >= 0
                  ? "text-teal-600"
                  : "text-red-600"
              }`}
            >
              {formatMoney(report.netCashFlow)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Cash remaining after this month's activity
            </p>

          </div>

        </div>

      </section>

{/* ==========================================
    FINANCIAL TREND
========================================== */}

<MonthlyTrendChart />

      {/* ==========================================
          CASH FLOW
      ========================================== */}

      <section>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Cash Flow
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your income, spending, investments, and transfers.
          </p>
        </div>


        <div className="grid gap-5 md:grid-cols-2">


          {/* Cash Position */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Available Cash
                </p>

                <h3
                  className={`mt-2 text-4xl font-bold ${
                    report.availableCash >= 0
                      ? "text-slate-900"
                      : "text-red-600"
                  }`}
                >
                  {formatMoney(report.availableCash)}
                </h3>

              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                CASH
              </div>

            </div>


            <div className="mt-6 space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Income
                </span>

                <span className="font-medium text-green-600">
                  +{formatMoney(report.income)}
                </span>

              </div>


              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Expenses
                </span>

                <span className="font-medium text-red-600">
                  -{formatMoney(report.expense)}
                </span>

              </div>


              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Investments
                </span>

                <span className="font-medium text-indigo-600">
                  -{formatMoney(report.investmentSpent)}
                </span>

              </div>


              {report.transferOut > 0 && (
                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Transfers Out
                  </span>

                  <span className="font-medium text-orange-600">
                    -{formatMoney(report.transferOut)}
                  </span>

                </div>
              )}


              {report.transferIn > 0 && (
                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Transfers In
                  </span>

                  <span className="font-medium text-green-600">
                    +{formatMoney(report.transferIn)}
                  </span>

                </div>
              )}

            </div>

          </div>


          {/* Savings Rate */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Savings Rate
            </p>

            <h3 className="mt-3 text-5xl font-bold text-teal-600">
              {Math.max(report.savingsRate, 0).toFixed(1)}%
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Percentage of your income remaining after this month's activity.
            </p>


            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(report.savingsRate, 0),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>
      


      {/* ==========================================
          INVESTMENT PERFORMANCE
      ========================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-2xl font-bold">
            Investment Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The current value and performance of your investment portfolio.
          </p>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


          {/* Portfolio Value */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Portfolio Value
            </p>

            <h3 className="mt-2 text-3xl font-bold text-indigo-600">
              {formatMoney(report.investment)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Current value of all investments
            </p>

          </div>


          {/* Total Invested */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Invested
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {formatMoney(report.investedAmount)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Total amount invested
            </p>

          </div>


          {/* Profit / Loss */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Profit / Loss
            </p>

            <h3
              className={`mt-2 text-3xl font-bold ${
                investmentProfitPositive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {investmentProfitPositive ? "+" : ""}
              {formatMoney(report.investmentProfit)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Current portfolio performance
            </p>

          </div>


          {/* Return */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Return
            </p>

            <h3
              className={`mt-2 text-3xl font-bold ${
                investmentReturnPositive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {investmentReturnPositive ? "+" : ""}
              {report.investmentReturn.toFixed(2)}%
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Return on invested capital
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          EXPENSE BREAKDOWN
      ========================================== */}

      {report.expenseBreakdown.length > 0 && (

        <section>

          <div className="mb-4">

            <h2 className="text-2xl font-bold">
              Expense Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Where your money actually went this month.
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="space-y-5">

              {report.expenseBreakdown.map(
                (item) => {

                  const percentage =
                    report.expense > 0
                      ? (item.amount / report.expense) * 100
                      : 0;

                  return (
                    <div key={item.category}>

                      <div className="flex items-center justify-between">

                        <span className="font-medium text-slate-700">
                          {item.category}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatMoney(item.amount)}
                        </span>

                      </div>


                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-red-400"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>


                      <p className="mt-1 text-xs text-slate-400">
                        {percentage.toFixed(1)}% of expenses
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>

      )}


      {/* ==========================================
          RECENT ACTIVITY + NET WORTH
      ========================================== */}

      <div className="grid gap-6 lg:grid-cols-2">


        {/* Recent Activity */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest financial activity this month.
          </p>


          {report.recentTransactions.length > 0 ? (

            <div className="mt-6 space-y-4">

              {report.recentTransactions.map(
                (transaction) => (

                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0"
                  >

                    <div>

                      <p className="font-medium text-slate-800">
                        {transaction.source}
                      </p>

                      <p className="text-xs text-slate-400">
                        {transaction.type}
                      </p>

                    </div>


                    <span
                      className={`font-semibold ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : transaction.type === "Expense"
                            ? "text-red-600"
                            : transaction.type === "Investment"
                              ? "text-indigo-600"
                              : "text-slate-700"
                      }`}
                    >
                      {transaction.type === "Income"
                        ? "+"
                        : transaction.type === "Expense" ||
                            transaction.type === "Investment"
                          ? "-"
                          : ""}
                      {formatMoney(transaction.amount)}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">

              <p className="text-sm text-slate-500">
                No financial activity recorded this month.
              </p>

            </div>

          )}

        </section>


        {/* Net Worth */}

        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">

          <p className="text-sm font-medium text-white/60">
            NET WORTH
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {formatMoney(report.netWorth)}
          </h2>

          <p className="mt-3 text-sm text-white/60">
            Available cash + current investment portfolio value.
          </p>


          <div className="mt-6 space-y-3">

            <div className="flex justify-between">

              <span className="text-white/60">
                Available Cash
              </span>

              <span className="font-semibold">
                {formatMoney(report.availableCash)}
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-white/60">
                Investments
              </span>

              <span className="font-semibold">
                {formatMoney(report.investment)}
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {report.totalTransactions === 0 &&
        report.investment === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

            <h3 className="text-xl font-bold text-slate-800">
              Your report is waiting for real data.
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Add income, expenses, or investments to start
              building your financial report.
            </p>

          </div>

        )}

    </div>
  );
}