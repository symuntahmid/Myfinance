"use client";

import { useState } from "react";
import {
  Transaction,
  getTransactions,
  saveTransactions,
} from "../data/transactions";

type EditTransactionModalProps = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
}: EditTransactionModalProps) {
  if (!open || !transaction) return null;

  const [source, setSource] = useState(transaction.source);
  const [amount, setAmount] = useState(transaction.amount);
  const saveChanges = () => {
  const transactions = getTransactions();

  const updatedTransactions = transactions.map((t) =>
    t.id === transaction.id
      ? {
          ...t,
          source,
          amount,
        }
      : t
  );

  saveTransactions(updatedTransactions);

  onClose();

  window.location.reload();
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold">
          Edit Transaction
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block font-medium">
              Source
            </label>

            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        <button
  onClick={saveChanges}
  className="mt-6 rounded-lg bg-[var(--primary)] px-5 py-2 text-white"
>
  Save Changes
</button>
      </div>
    </div>
  );
}