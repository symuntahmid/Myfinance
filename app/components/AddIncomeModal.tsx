"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  addTransaction,
  Transaction,
} from "@/app/data/transactions";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddIncomeModal({
  open,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] =
    useState("Salary");
  const [note, setNote] = useState("");

  if (!open) return null;

  function saveIncome() {
    if (!amount || !source) return;

    const transaction: Transaction = {
      id: Date.now(),
      type: "Income",
      amount: Number(amount),
      source,
      category,
      note,
      date: new Date().toLocaleDateString(),
    };

    addTransaction(transaction);

    setAmount("");
    setSource("");
    setCategory("Salary");
    setNote("");

    onClose();

    location.reload();
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
      />

      <div className="fixed bottom-0 left-1/2 z-[100] w-full max-w-xl -translate-x-1/2 rounded-t-[40px] bg-white p-8 shadow-2xl">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Add Income
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-5">

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="w-full rounded-2xl border p-4"
          />

          <input
            placeholder="Source"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
            className="w-full rounded-2xl border p-4"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded-2xl border p-4"
          >
            <option>Salary</option>
            <option>Freelance</option>
            <option>Business</option>
            <option>Gift</option>
          </select>

          <textarea
            rows={3}
            placeholder="Note"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            className="w-full rounded-2xl border p-4"
          />

          <button
            onClick={saveIncome}
            className="w-full rounded-2xl bg-green-600 py-4 font-bold text-white hover:bg-green-700"
          >
            Save Income
          </button>

        </div>

      </div>
    </>
  );
}