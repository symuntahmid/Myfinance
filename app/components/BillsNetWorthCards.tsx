"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { getGoals } from "@/app/data/goals";
import { getPortfolioSummary } from "@/app/data/investments";
import { getBills, sortedStatuses, type BillStatus } from "@/app/data/bills";
import { computeNetWorth, getDebts } from "@/app/data/netWorth";

export default function BillsNetWorthCards() {
  const { t } = useLanguage();

  const [netWorth, setNetWorth] = useState<number | null>(null);
  const [next, setNext] = useState<BillStatus | null>(null);

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();

      const accounts = getAccounts().reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      const goals = getGoals().reduce(
        (sum, item) => sum + (Number(item.savedAmount) || 0),
        0
      );

      setNetWorth(
        computeNetWorth({
          accounts,
          goals,
          investments: getPortfolioSummary().current,
          debts: getDebts(),
        }).netWorth
      );

      setNext(
        sortedStatuses(getBills(), new Date()).find(
          (item) => item.state !== "paid"
        ) ?? null
      );
    };

    refresh();

    const events = [
      "billsUpdated",
      "debtsUpdated",
      "accountsUpdated",
      "transactionsUpdated",
      "goalsUpdated",
      "languageUpdated",
      "currencyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (netWorth === null) return null;

  const card =
    "block rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)]";

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href="/net-worth" className={card}>
        <p className="text-xs font-semibold text-[var(--muted)]">
          {t("netWorthCardTitle")}
        </p>

        <p
          className={`mt-2 text-xl font-bold ${
            netWorth < 0 ? "text-red-500" : ""
          }`}
        >
          {formatCurrency(netWorth)}
        </p>
      </Link>

      <Link href="/bills" className={card}>
        <p className="text-xs font-semibold text-[var(--muted)]">
          {t("billsTitle")}
        </p>

        {next ? (
          <>
            <p className="mt-2 truncate text-sm font-semibold">
              {next.bill.emoji} {next.bill.name}
            </p>

            <p
              className={`text-xs ${
                next.state === "overdue"
                  ? "font-semibold text-red-500"
                  : "text-[var(--muted)]"
              }`}
            >
              {formatCurrency(next.bill.amount)} ·{" "}
              {next.state === "overdue"
                ? t("billOverdue")
                : next.state === "today"
                ? t("billDueToday")
                : t("billDueIn", { days: next.daysLeft })}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm">{t("billsCardNone")}</p>
        )}
      </Link>
    </div>
  );
}
