"use client";

import { useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { deleteInvestment, type Investment } from "@/app/data/investments";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "@/app/data/transactions";

const num = (value: string) => {
  const n = Number(value.replace(/,/g, "").trim());

  return Number.isFinite(n) && n > 0 ? n : 0;
};

const makeTxId = () => Date.now() + Math.floor(Math.random() * 100000);

const today = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

type Props = {
  investment: Investment;
  onClose: () => void;
};

export default function RemoveSheet({ investment, onClose }: Props) {
  const { t } = useLanguage();

  const [selling, setSelling] = useState(false);
  const [price, setPrice] = useState(String(investment.currentValue || ""));

  const hasPurchase = Boolean(
    investment.txId && getTransactions().some((x) => x.id === investment.txId)
  );

  const done = () => {
    deleteInvestment(investment.id);
    onClose();
  };

  const mistake = () => {
    if (investment.txId) deleteTransaction(investment.txId);

    done();
  };

  // Sale money goes back to cash as a transfer, so it is not counted as income.
  const sold = () => {
    const amount = num(price);

    if (amount > 0) {
      addTransaction({
        id: makeTxId(),
        type: "Transfer",
        source: `📈 ${investment.name}`,
        destination: "Available Cash",
        amount,
        date: today(),
        note: `Sold: ${investment.name}`,
        relatedInvestmentId: investment.id,
      });
    }

    done();
  };

  const option =
    "w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-left";

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg space-y-3 rounded-t-3xl bg-[var(--card)] p-5 shadow-2xl sm:rounded-3xl"
      >
        <h2 className="text-lg font-bold">
          {t("invRemoveTitle", { name: investment.name })}
        </h2>

        {!selling ? (
          <>
            {hasPurchase ? (
              <button type="button" onClick={mistake} className={option}>
                <span className="block text-sm font-bold">{t("invRemoveMistake")}</span>
                <span className="block text-xs text-[var(--muted)]">{t("invRemoveMistakeSub")}</span>
              </button>
            ) : (
              <button type="button" onClick={done} className={option}>
                <span className="block text-sm font-bold">{t("invRemoveOnly")}</span>
                <span className="block text-xs text-[var(--muted)]">{t("invRemoveOnlySub")}</span>
              </button>
            )}

            <button type="button" onClick={() => setSelling(true)} className={option}>
              <span className="block text-sm font-bold">{t("invRemoveSold")}</span>
              <span className="block text-xs text-[var(--muted)]">{t("invRemoveSoldSub")}</span>
            </button>

            {hasPurchase && (
              <button type="button" onClick={done} className={option}>
                <span className="block text-sm font-bold">{t("invRemoveOnly")}</span>
                <span className="block text-xs text-[var(--muted)]">{t("invRemoveOnlySub")}</span>
              </button>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                {t("invSoldFor")}
              </span>

              <input
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--primary)]"
              />
            </label>


            <button
              type="button"
              disabled={num(price) <= 0}
              onClick={sold}
              className="w-full rounded-full bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-40"
            >
              {t("invConfirmSold")}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full py-2 text-sm font-semibold text-[var(--muted)]"
        >
          {t("invCancel")}
        </button>
      </div>
    </div>
  );
}
