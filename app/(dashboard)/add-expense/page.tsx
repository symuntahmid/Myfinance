"use client";

import { useState } from "react";
import TransactionForm from "../../components/TransactionForm";

export default function AddExpensePage() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <h1 className="text-4xl font-bold">
        Add Expense
      </h1>

      <p className="mt-2 text-[var(--muted)]">
        Record a new expense.
      </p>

      <TransactionForm
        type="Expense"
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}