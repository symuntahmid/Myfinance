"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getTransactions,
  saveTransactions,
} from "../data/transactions";

type TransactionFormProps = {
  type: "Income" | "Expense" | "Investment";
};

export default function TransactionForm({
  type,
}: TransactionFormProps) {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  return (
    <form
      className="mt-10 max-w-xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();

        const transactions = getTransactions();

transactions.push({
  id: Date.now(),
  type,
  source,
  amount: Number(amount),
});

saveTransactions(transactions);

router.push("/dashboard");
      }}
    >
      <div>
        <label className="block mb-2 font-medium">
          {type} Source
        </label>

        <input
          type="text"
          placeholder={`Enter ${type.toLowerCase()} source`}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-teal-500"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Amount
        </label>

        <input
          type="number"
          placeholder="50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-teal-500"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:opacity-90"
      >
        Save {type}
      </button>
    </form>
  );
}