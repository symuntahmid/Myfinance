"use client";

import { useEffect, useState } from "react";
import {
  getTransactions,
  saveTransactions,
  Transaction,
} from "../data/transactions";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
    <div className="mt-10 rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-5">
        Recent Transactions
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Type</th>
            <th className="text-left py-3">Source</th>
            <th className="text-left py-3">Amount</th>
<th className="text-center py-3">Action</th>
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

              <td className="py-3">{transaction.source}</td>

              <td className="py-3 font-semibold">
  ${transaction.amount}
</td>

<td className="py-3 text-center">
  <button
    onClick={() => deleteTransaction(transaction.id)}
    className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}