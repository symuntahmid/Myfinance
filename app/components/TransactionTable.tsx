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
        <h2 className="mb-5 text-2xl font-bold">
          Recent Transactions
        </h2>

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
            {transactions.map((transaction) => (
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