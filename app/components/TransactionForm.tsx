"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  addTransaction,
  Transaction,
} from "@/app/data/transactions";

type Props = {
  open: boolean;
  type: "Income" | "Expense" | "Investment";
  onClose: () => void;
};

export default function TransactionForm({
  open,
  type,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  if (!open) return null;

  function resetForm() {
    setAmount("");
    setSource("");
    setCategory("");
    setNote("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function saveTransaction() {
    if (!amount || !source) return;

    const transaction: Transaction = {
      id: Date.now(),
      type,
      amount: Number(amount),
      source,
      category,
      note,
      date: new Date().toLocaleDateString(),
    };

    addTransaction(transaction);
    window.dispatchEvent(
  new Event("transactionsUpdated")
);

    resetForm();
    onClose();
  }

  return (
    <>
      {/* Overlay */}

      <div
        onClick={handleClose}
        className="fixed inset-0 z-[1100] bg-black/30 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">

        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <h2 className="text-2xl font-bold">
              Add {type}
            </h2>

            <button
              onClick={handleClose}
              className="rounded-full p-2 transition hover:bg-slate-100"
            >
              <X size={22} />
            </button>

          </div>

          {/* Body */}

          <div className="space-y-5 p-6">

            {/* Amount */}

            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            {/* Source */}

            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={
                type === "Income"
                  ? "Salary, Freelance..."
                  : type === "Expense"
                  ? "Shopping, Food..."
                  : "Broker, Platform..."
              }
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            {/* Category */}

            {type === "Investment" ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Investment Category</option>
                <option>Stocks</option>
                <option>Crypto</option>
                <option>ETF</option>
                <option>Gold</option>
                <option>Mutual Fund</option>
                <option>Real Estate</option>
                <option>Savings</option>
                <option>Other</option>
              </select>
            ) : (
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={
                  type === "Income"
                    ? "Income Category"
                    : "Expense Category"
                }
                className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            )}

            {/* Notes */}

            <textarea
              rows={4}
              placeholder="Notes (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

          </div>

          {/* Footer */}

          <div className="border-t border-slate-200 p-6">

            <button
              onClick={saveTransaction}
              disabled={!amount || !source}
              className={`w-full rounded-2xl py-4 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                type === "Income"
                  ? "bg-green-600 hover:bg-green-700"
                  : type === "Expense"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              Save {type}
            </button>

          </div>

        </div>

      </div>
    </>
  );
}