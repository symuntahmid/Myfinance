"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  Investment,
  InvestmentType,
  updateInvestment,
} from "@/app/data/investments";

type Props = {
  open: boolean;
  investment: Investment | null;
  onClose: () => void;
};

const types: InvestmentType[] = [
  "Stocks",
  "Crypto",
  "Gold",
  "Real Estate",
  "Mutual Fund",
  "ETF",
  "Bonds",
  "Savings",
  "Fixed Deposit (FDR)",
  "Business",
  "Retirement",
  "Other",
];

export default function EditInvestmentModal({
  open,
  investment,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] =
    useState<InvestmentType>("Stocks");
  const [investedAmount, setInvestedAmount] =
    useState("");
  const [currentValue, setCurrentValue] =
    useState("");
  const [purchaseDate, setPurchaseDate] =
    useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!investment) return;

    setName(investment.name);
    setType(investment.type);
    setInvestedAmount(
      investment.investedAmount.toString()
    );
    setCurrentValue(
      investment.currentValue.toString()
    );
    setPurchaseDate(investment.purchaseDate);
    setNotes(investment.notes ?? "");
  }, [investment]);

  if (!open || !investment) return null;

const currentInvestment = investment;

function handleSave() {
  updateInvestment({
  id: currentInvestment.id,
  name,
  type,
  investedAmount: Number(investedAmount),
  currentValue: Number(currentValue),
  purchaseDate,
  notes,
});

    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-3xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b px-8 py-6">
            <h2 className="text-3xl font-bold">
              Edit Investment
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="space-y-5 p-8">
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Investment Name"
              className="w-full rounded-xl border p-4"
            />

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as InvestmentType
                )
              }
              className="w-full rounded-xl border p-4"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              type="number"
              value={investedAmount}
              onChange={(e) =>
                setInvestedAmount(e.target.value)
              }
              placeholder="Invested Amount"
              className="w-full rounded-xl border p-4"
            />

            <input
              type="number"
              value={currentValue}
              onChange={(e) =>
                setCurrentValue(e.target.value)
              }
              placeholder="Current Value"
              className="w-full rounded-xl border p-4"
            />

            <input
              type="date"
              value={purchaseDate}
              onChange={(e) =>
                setPurchaseDate(e.target.value)
              }
              className="w-full rounded-xl border p-4"
            />

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Notes"
              className="h-28 w-full rounded-xl border p-4"
            />

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border py-4 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 rounded-2xl bg-cyan-600 py-4 font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}