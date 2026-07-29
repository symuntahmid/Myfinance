"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("Salary");
  const [note, setNote] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
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

    window.dispatchEvent(
      new Event("transactionsUpdated")
    );

    setAmount("");
    setSource("");
    setCategory("Salary");
    setNote("");

    onClose();
  }

  return createPortal(
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-[1100] bg-black/30 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4">

        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between border-b px-6 py-5">

            <h2 className="text-2xl font-bold">
              Add Income
            </h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X size={22} />
            </button>

          </div>

          {/* Body */}

          <div className="space-y-5 p-6">

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
              rows={4}
              placeholder="Notes"
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              className="w-full rounded-2xl border p-4"
            />

          </div>

          {/* Footer */}

          <div className="border-t p-6">

            <button
              onClick={saveIncome}
              className="w-full rounded-2xl bg-green-600 py-4 text-lg font-bold text-white hover:bg-green-700"
            >
              Save Income
            </button>

          </div>

        </div>

      </div>
    </>,
    document.body
  );
}