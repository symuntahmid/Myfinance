"use client";

import { useEffect, useState } from "react";
import {
  getTransactions,
  Transaction,
} from "../data/transactions";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

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
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b last:border-0"
            >
              <td className="py-3">{transaction.type}</td>

              <td className="py-3">{transaction.source}</td>

              <td className="py-3 font-semibold">
                ${transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}