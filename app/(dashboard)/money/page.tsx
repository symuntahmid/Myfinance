"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AddTransactionSheet from "@/app/components/AddTransactionSheet";
import TransactionForm from "@/app/components/TransactionForm";
import SpendingInsights from "@/app/components/SpendingInsights";


import {
  getTransactions,
  getSummary,
  Transaction,
} from "@/app/data/transactions";

import MoneyTrendChart from "@/app/components/MoneyTrendChart";
import FloatingActionButton from "@/app/components/FloatingActionButton";

export default function MoneyPage() {

  const [sheetOpen, setSheetOpen] = useState(false);
const [formOpen, setFormOpen] = useState(false);

const [transactionType, setTransactionType] = useState<
  "Income" | "Expense" | "Investment"
>("Income");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
const [summary, setSummary] = useState(getSummary());

function refreshData() {
  setTransactions(getTransactions());
  setSummary(getSummary());
}

useEffect(() => {
  refreshData();

  window.addEventListener("transactionsUpdated", refreshData);

  return () => {
    window.removeEventListener(
  "transactionsUpdated",
  refreshData
);

window.removeEventListener(
  "investmentsUpdated",
  refreshData
);
  };
}, []);
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-0">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold tracking-tight">
          My Money
        </h1>

        <p className="mt-2 text-slate-500">
          Good morning, Symun 👋
        </p>

        {/* Motivation Card */}

        <div className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-7 text-white shadow-xl">

          <h2 className="text-xl md:text-2xl font-bold">
            You're saving 18% more than last month.
          </h2>

          <p className="mt-2 text-white/80">
            Keep it up. You're building strong financial habits.
          </p>

        </div>

      </div>

      {/* Balance */}

      <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">

        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Current Balance
        </p>

        <h2 className="mt-4 text-4xl md:text-6xl font-bold">
  ${summary.availableCash.toLocaleString()}
</h2>

        <div className="mt-5 inline-flex rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-300">
          ▲ +8.2% this month
        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-3 md:gap-6">

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Income
          </p>

          <h3 className="mt-4 text-4xl font-bold text-green-600">
            +${summary.income.toLocaleString()}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            This Month
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Expenses
          </p>

          <h3 className="mt-4 text-4xl font-bold text-red-500">
            -${summary.expense.toLocaleString()}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            This Month
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
  Available Cash
</p>

<h3 className="mt-4 text-4xl font-bold text-cyan-600">
  ${summary.availableCash.toLocaleString()}
</h3>

<p className="mt-2 text-sm text-slate-500">
  Income − Expenses
</p>

        </div>

      </div>

            {/* Chart */}

      <div className="grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <MoneyTrendChart />
  </div>

  <div>
    <SpendingInsights />
  </div>
  <Link href="/money/analytics">

  <div className="cursor-pointer rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white shadow-xl transition hover:scale-[1.02]">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Analytics
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Explore Money Analytics
        </h2>

        <p className="mt-3 max-w-xl text-white/80">
          View detailed expense breakdown,
          income sources, category trends,
          financial health and AI insights.
        </p>

      </div>

      <div className="text-5xl">
        📊
      </div>

    </div>

  </div>

</Link>
</div>

      {/* Floating Action Button */}

      <FloatingActionButton
        onClick={() => setSheetOpen(true)}
      />

      {/* Bottom Sheet */}

      <AddTransactionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onIncome={() => {
          setTransactionType("Income");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onExpense={() => {
          setTransactionType("Expense");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onInvestment={() => {
          setTransactionType("Investment");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
      />

      {/* Transaction Form */}

      <TransactionForm
        open={formOpen}
        type={transactionType}
        onClose={() => {
          setFormOpen(false);
          refreshData();
        }}
      />

      {/* Recent Activity */}

<div className="rounded-3xl bg-white p-8 shadow-xl">

  <div className="mb-8 flex items-center justify-between">

    <h2 className="text-xl font-bold md:text-2xl">
      Recent Activity
    </h2>

    <Link
      href="/money/transactions"
      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
    >
      View All →
    </Link>

  </div>

  {transactions.length === 0 ? (

    <div className="rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">

      <p className="text-lg font-semibold text-slate-700">
        No transactions yet
      </p>

      <p className="mt-2 text-slate-500">
        Add your first income, expense or investment.
      </p>

    </div>

  ) : (

    <div className="space-y-4">

      {transactions.slice(0, 3).map((transaction) => (

        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:bg-slate-100"
        >

          <div>

            <p className="font-semibold text-slate-900">
              {transaction.source}
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

              <span>{transaction.date}</span>

              {transaction.category && (
                <>
                  <span>•</span>
                  <span>{transaction.category}</span>
                </>
              )}

            </div>

          </div>

          <div className="text-right">

            <p
              className={`text-lg font-bold ${
                transaction.type === "Income"
                  ? "text-green-600"
                  : transaction.type === "Expense"
                  ? "text-red-500"
                  : "text-cyan-600"
              }`}
            >
              {transaction.type === "Expense" ? "-" : "+"}$
              {transaction.amount.toLocaleString()}
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                transaction.type === "Income"
                  ? "bg-green-100 text-green-700"
                  : transaction.type === "Expense"
                  ? "bg-red-100 text-red-700"
                  : "bg-cyan-100 text-cyan-700"
              }`}
            >
              {transaction.type}
            </span>

          </div>

        </div>

      ))}

    </div>

  )}

</div>

</div>
);
}