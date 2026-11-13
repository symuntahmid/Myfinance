"use client";

import { useState } from "react";
import TransactionForm from "../../components/TransactionForm";

export default function AddIncomePage() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <h1 className="text-4xl font-bold">
        Add Income
      </h1>

      <p className="mt-2 text-[var(--muted)]">
        Record a new income.
      </p>

      <TransactionForm
        type="Income"
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
