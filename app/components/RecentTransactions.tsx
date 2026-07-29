"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getTransactions,
  Transaction,
} from "../data/transactions";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    function refreshTransactions() {
      setTransactions(getTransactions());
    }

    refreshTransactions();

    window.addEventListener(
      "transactionsUpdated",
      refreshTransactions
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        refreshTransactions
      );
    };
  }, []);

  return (
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Recent Transactions
        </h2>

        <Link
          href="/money/transactions"
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          View All →
        </Link>
      </div>

      {/* Empty State */}

      {transactions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">
          <p className="text-lg font-semibold text-slate-700">
            No transactions yet
          </p>

          <p className="mt-2 text-slate-500">
            Your latest transactions will appear here.
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Type
              </th>

              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Source
              </th>

              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Category
              </th>

              <th className="py-3 text-right text-sm font-semibold text-slate-500">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions
              .slice(0, 3)
              .map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === "Income"
                          ? "bg-green-100 text-green-700"
                          : transaction.type === "Expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td className="font-medium text-slate-900">
                    {transaction.source}
                  </td>

                  <td className="text-slate-500">
                    {transaction.category || "-"}
                  </td>

                  <td
                    className={`text-right text-lg font-bold ${
                      transaction.type === "Income"
                        ? "text-green-600"
                        : transaction.type === "Expense"
                        ? "text-red-500"
                        : "text-cyan-600"
                    }`}
                  >
                    {transaction.type === "Expense"
                      ? "-"
                      : "+"}
                    $
                    {transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}