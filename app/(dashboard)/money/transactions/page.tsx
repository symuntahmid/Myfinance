"use client";

import TransactionTable from "@/app/components/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">

      <div>

        <h1 className="
          text-4xl
          font-bold
          text-[var(--foreground)]
        ">
          All Transactions
        </h1>


        <p className="
          mt-2
          text-[var(--muted)]
        ">
          View, search, edit and manage every transaction.
        </p>

      </div>


      <TransactionTable />

    </div>
  );
}