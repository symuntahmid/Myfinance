"use client";

import EditTransactionModal from "./EditTransactionModal";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getTransactions,
  saveTransactions,
  Transaction,
} from "../data/transactions";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
  "All" | "Income" | "Expense" | "Investment"
>("All");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const deleteTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
  };

  return (
    <>
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
  <h2 className="text-2xl font-bold">
    Recent Transactions
  </h2>

  <div className="flex items-center gap-3">
  <button
    onClick={() => setFilter("All")}
    className={`rounded-full px-4 py-2 font-medium transition ${
      filter === "All"
        ? "bg-slate-800 text-white"
        : "bg-slate-100 hover:bg-slate-200"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("Income")}
    className={`rounded-full px-4 py-2 font-medium transition ${
      filter === "Income"
        ? "bg-green-500 text-white"
        : "bg-green-100 text-green-700 hover:bg-green-200"
    }`}
  >
    Income
  </button>

  <button
    onClick={() => setFilter("Expense")}
    className={`rounded-full px-4 py-2 font-medium transition ${
      filter === "Expense"
        ? "bg-red-500 text-white"
        : "bg-red-100 text-red-700 hover:bg-red-200"
    }`}
  >
    Expense
  </button>

  <button
    onClick={() => setFilter("Investment")}
    className={`rounded-full px-4 py-2 font-medium transition ${
      filter === "Investment"
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
    }`}
  >
    Investment
  </button>

  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-56 rounded-xl border border-slate-300 p-2 outline-none focus:border-teal-500"
  />
</div>
</div>

        <table className="w-full">
  <thead>
    <tr className="border-b">
      <th className="py-3 text-left">Type</th>
      <th className="py-3 text-left">Source</th>
      <th className="py-3 text-left">Amount</th>
      <th className="py-3 text-center">Actions</th>
    </tr>
  </thead>
          

          <tbody>
            {transactions
              .filter((transaction) => {
  const matchesSearch = transaction.source
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || transaction.type === filter;

  return matchesSearch && matchesFilter;
})
              .map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b last:border-0"
                >
                  <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      transaction.type === "Income"
                        ? "bg-green-100 text-green-700"
                        : transaction.type === "Expense"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td className="py-3">
                  {transaction.source}
                </td>

                <td className="py-3 font-semibold">
                  ${transaction.amount}
                </td>

                <td className="py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
  setSelectedTransaction(transaction);
  setIsEditOpen(true);
}}
                      className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this transaction?"
                          )
                        ) {
                          deleteTransaction(transaction.id);
                        }
                      }}
                      className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditTransactionModal
  open={isEditOpen}
  transaction={selectedTransaction}
  onClose={() => {
    setIsEditOpen(false);
    setSelectedTransaction(null);
    setTransactions(getTransactions());
  }}
/>
    </>
  );
}