"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getTransactions, type Transaction } from "../data/transactions";
import { quickExpenseCategories } from "@/app/data/quickAdd";

const SIGN: Record<Transaction["type"], string> = {
  Income: "+",
  Expense: "-",
  Investment: "-",
  Transfer: "",
};

export default function RecentTransactions() {
  const { t, language } = useLanguage();

  const [items, setItems] = useState<Transaction[]>([]);

  useEffect(() => {
    const refresh = () =>
      setItems(
        [...getTransactions()]
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime() ||
              b.id - a.id
          )
          .slice(0, 5)
      );

    refresh();

    const events = ["transactionsUpdated", "currencyUpdated", "languageUpdated"];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  const labelOf = (item: Transaction) => {
    const raw = item.category?.trim() || item.type;
    const found = quickExpenseCategories.find((c) => c.value === raw);

    return found
      ? { emoji: found.emoji, text: found[language] }
      : {
          emoji: item.type === "Income" ? "💰" : "💸",
          text: raw.replace(/^[^\p{L}\p{N}]+/u, ""),
        };
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 pb-1 pt-3">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold">{t("recentTransactions")}</h2>

        <Link
          href="/money/transactions"
          className="text-xs font-semibold text-[var(--primary)]"
        >
          {t("viewAll")}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-sm text-[var(--muted)]">
          {t("noTransactionsYet")}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map((item) => {
            const label = labelOf(item);

            return (
              <li key={item.id} className="flex items-center gap-3 py-1.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-base">
                  {label.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {label.text}
                  </p>

                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {item.source.replace(/^[^\p{L}\p{N}]+/u, "")}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-bold ${
                    item.type === "Income" ? "text-[var(--success)]" : ""
                  }`}
                >
                  {SIGN[item.type]}
                  {formatCurrency(item.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
