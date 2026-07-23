"use client";

import { useEffect, useState } from "react";
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
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (transaction) {
      setSource(transaction.source);
      setAmount(transaction.amount);
    }
  }, [transaction]);

  if (!open || !transaction) return null;

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

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            className="rounded-lg bg-[var(--primary)] px-5 py-2 text-white hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}