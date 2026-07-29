"use client";

import TransactionTable from "@/app/components/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          All Transactions
        </h1>

        <p className="mt-2 text-slate-500">
          View, search, edit and manage every transaction.
        </p>
      </div>

      <TransactionTable />
    </div>
  );
}