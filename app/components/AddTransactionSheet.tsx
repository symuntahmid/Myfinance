"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Wallet,
  Receipt,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { quickText } from "@/app/data/quickAdd";

interface Props {
  open: boolean;
  onClose: () => void;

  onIncome: () => void;
  onExpense: () => void;
  onInvestment: () => void;

  // Optional: shows a "Quick Add" button at the top.
  onQuick?: () => void;
}

export default function AddTransactionSheet({
  open,
  onClose,
  onIncome,
  onExpense,
  onInvestment,
  onQuick,
}: Props) {
  const { language } = useLanguage();
  const quick = quickText[language];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't render anything when closed
  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-[990] bg-black/30 backdrop-blur-sm"
      />

      {/* Bottom Sheet */}

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-[1000]
          rounded-t-[34px]
          bg-white
          shadow-[0_-30px_80px_rgba(0,0,0,.18)]
        "
      >
        {/* Handle */}

        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-14 rounded-full bg-slate-300" />
        </div>

        {/* Header */}

        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <h2 className="text-2xl font-bold">
              Add Transaction
            </h2>

            <p className="mt-1 text-slate-500">
              Choose what you'd like to add
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Actions */}

        <div className="mt-8 space-y-4 px-6">

          {onQuick && (
            <button
              onClick={onQuick}
              className="flex w-full items-center gap-4 rounded-3xl bg-gradient-to-br from-[var(--forest)] to-[var(--primary)] p-5 text-white shadow-lg transition hover:scale-[1.02]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Zap size={26} />
              </div>

              <div className="text-left">
                <h3 className="text-lg font-bold">
                  {quick.menuTitle}
                </h3>

                <p className="text-sm text-white/80">
                  {quick.menuSubtitle}
                </p>
              </div>
            </button>
          )}

          <button
            onClick={onIncome}
            className="flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white">
              <Wallet size={26} />
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold">
                Add Income
              </h3>

              <p className="text-sm text-slate-500">
                Salary, freelance, business...
              </p>
            </div>
          </button>

          <button
            onClick={onExpense}
            className="flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
              <Receipt size={26} />
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold">
                Add Expense
              </h3>

              <p className="text-sm text-slate-500">
                Shopping, food, bills...
              </p>
            </div>
          </button>

          <button
            onClick={onInvestment}
            className="flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white">
              <TrendingUp size={26} />
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold">
                Add Investment
              </h3>

              <p className="text-sm text-slate-500">
                Stocks, crypto, ETFs...
              </p>
            </div>
          </button>

        </div>

        {/* Cancel */}

        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-slate-100 py-4 font-semibold transition hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}