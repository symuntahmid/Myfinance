"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AddTransactionSheet from "@/app/components/AddTransactionSheet";
import TransactionForm from "@/app/components/TransactionForm";
import SpendingInsights from "@/app/components/SpendingInsights";
import MoneyTrendChart from "@/app/components/MoneyTrendChart";
import FloatingActionButton from "@/app/components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";

import { formatCurrency } from "@/app/utils/currency";
import { t } from "@/app/data/i18n";

import {
  getTransactions,
  getSummary,
  Transaction,
} from "@/app/data/transactions";

export default function MoneyPage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [quickOpen, setQuickOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

  const [transactionType, setTransactionType] = useState<
    "Income" | "Expense" | "Investment"
  >("Income");

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [summary, setSummary] = useState(() => getSummary());

  const [, forceCurrencyUpdate] = useState(0);

  const [, forceLanguageUpdate] = useState(0);

  function refreshData() {
    setTransactions(getTransactions());
    setSummary(getSummary());
  }

  useEffect(() => {
    const currencyListener = () => {
      forceCurrencyUpdate((value) => value + 1);
    };

    const languageListener = () => {
      forceLanguageUpdate((value) => value + 1);
    };

    refreshData();

    window.addEventListener(
      "transactionsUpdated",
      refreshData
    );

    window.addEventListener(
      "investmentsUpdated",
      refreshData
    );

    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );

    window.addEventListener(
      "languageUpdated",
      languageListener
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        refreshData
      );

      window.removeEventListener(
        "investmentsUpdated",
        refreshData
      );

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

      window.removeEventListener(
        "languageUpdated",
        languageListener
      );
    };
  }, []);

  const stats = [
    {
      title: t("income"),
      value: `+${formatCurrency(summary.income)}`,
      color: "text-green-600",
      desc: t("thisMonth"),
    },
    {
      title: t("expenses"),
      value: `-${formatCurrency(summary.expense)}`,
      color: "text-red-500",
      desc: t("thisMonth"),
    },
    {
      title: t("availableCash"),
      value: formatCurrency(summary.availableCash),
      color: "text-cyan-600",
      desc: t("incomeMinusExpenses"),
    },
  ];

  return (
    <div
      className="
      mx-auto
      max-w-7xl
      space-y-6
      px-4
      md:px-0
      "
    >
      {/* Header */}

      <div>
        <div
          className="
          mt-6
          rounded-3xl
          bg-gradient-to-r
          from-emerald-500
          via-teal-500
          to-cyan-500
          p-5
          text-white
          shadow-xl
          sm:p-7
          "
        >
          <h2
            className="
            font-display
            text-2xl
            font-medium
            tracking-[-0.04em]
            md:text-3xl
            "
          >
            {t("savingMoreThanLastMonth")}
          </h2>

          <p
            className="
            mt-3
            font-body
            text-sm
            leading-relaxed
            text-white/80
            "
          >
            {t("keepBuildingStrongHabits")}
          </p>
        </div>
      </div>

      {/* Balance */}

      <div
        className="
        rounded-[36px]
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-slate-900
        p-6
        text-white
        shadow-2xl
        sm:p-8
        "
      >
        <p
          className="
          font-body
          text-xs
          font-medium
          uppercase
          tracking-[0.25em]
          text-white/50
          "
        >
          {t("currentBalance")}
        </p>

        <h2
          className="
          mt-4
          font-display
          text-5xl
          font-medium
          tracking-[-0.05em]
          md:text-6xl
          "
        >
          {formatCurrency(summary.availableCash)}
        </h2>

        <div
          className="
          mt-5
          inline-flex
          rounded-full
          bg-emerald-500/20
          px-5
          py-2
          text-sm
          font-semibold
          text-emerald-300
          "
        >
          ▲ +8.2% {t("thisMonth")}
        </div>
      </div>

      {/* Stats */}

      <div
        className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-3
        md:gap-6
        "
      >
        {stats.map((item) => (
          <div
            key={item.title}
            className="
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--card)]
            p-6
            shadow-lg
            transition
            hover:-translate-y-1
            hover:shadow-xl
            "
          >
            <p
              className="
              font-body
              text-xs
              font-medium
              uppercase
              tracking-[0.12em]
              text-[var(--muted)]
              "
            >
              {item.title}
            </p>

            <h3
              className={`
              mt-4
              font-display
              text-4xl
              font-medium
              tracking-[-0.04em]
              ${item.color}
              `}
            >
              {item.value}
            </h3>

            <p
              className="
              mt-2
              text-sm
              text-[var(--muted)]
              "
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}

      <div
        className="
        grid
        gap-6
        lg:grid-cols-3
        "
      >
        <div className="lg:col-span-2">
          <MoneyTrendChart />
        </div>

        <div>
          <SpendingInsights />
        </div>

        <Link href="/money/analytics">
          <div
            className="
            cursor-pointer
            rounded-3xl
            border
            border-cyan-200
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            p-6
            text-white
            shadow-xl
            transition
            hover:scale-[1.02]
            sm:p-8
            "
          >
            <div
              className="
              flex
              items-center
              justify-between
              "
            >
              <div>
                <p
                  className="
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-white/70
                  "
                >
                  {t("analytics")}
                </p>

                <h2
                  className="
                  mt-3
                  font-display
                  text-4xl
                  font-medium
                  tracking-[-0.04em]
                  "
                >
                  {t("exploreMoneyAnalytics")}
                </h2>

                <p
                  className="
                  mt-3
                  max-w-xl
                  font-body
                  text-sm
                  leading-relaxed
                  text-white/80
                  "
                >
                  {t("moneyAnalyticsDescription")}
                </p>
              </div>

              <div
                className="
                hidden
                text-5xl
                sm:block
                "
              >
                📊
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Floating Action Button */}

      <FloatingActionButton
        onClick={() => setSheetOpen(true)}
      />

      {/* Add Transaction Sheet */}

      <AddTransactionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onQuick={() => {
          setSheetOpen(false);

          setTimeout(() => {
            setQuickOpen(true);
          }, 250);
        }}
        onIncome={() => {
          setTransactionType("Income");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onExpense={() => {
          setTransactionType("Expense");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onInvestment={() => {
          setTransactionType("Investment");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
      />

      <QuickAddSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />

      {/* Transaction Form */}

      <TransactionForm
        open={formOpen}
        type={transactionType}
        onClose={() => {
          setFormOpen(false);
          refreshData();
        }}
      />

      {/* Recent Activity */}

      <div
        className="
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-xl
        sm:p-8
        "
      >
        <div
          className="
          mb-8
          flex
          items-center
          justify-between
          "
        >
          <h2
            className="
            font-display
            text-3xl
            font-medium
            tracking-[-0.04em]
            text-[var(--foreground)]
            "
          >
            {t("recentActivity")}
          </h2>

          <Link
            href="/money/transactions"
            className="
            font-body
            text-sm
            font-medium
            tracking-tight
            text-[var(--primary)]
            transition
            hover:opacity-80
            "
          >
            {t("viewAll")} →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div
            className="
            rounded-2xl
            border-2
            border-dashed
            border-[var(--border)]
            py-14
            text-center
            "
          >
            <p
              className="
              font-display
              text-2xl
              font-medium
              tracking-[-0.03em]
              text-[var(--foreground)]
              "
            >
              {t("noTransactionsYet")}
            </p>

            <p
              className="
              mt-2
              font-body
              text-sm
              leading-relaxed
              text-[var(--muted)]
              "
            >
              {t("addFirstTransaction")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                p-5
                transition
                hover:bg-[var(--card)]
                "
              >
                <div>
                  <p
                    className="
                    font-body
                    text-sm
                    font-medium
                    tracking-tight
                    text-[var(--foreground)]
                    "
                  >
                    {transaction.source}
                  </p>

                  <div
                    className="
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[var(--muted)]
                    "
                  >
                    <span>{transaction.date}</span>

                    {transaction.category && (
                      <>
                        <span>•</span>
                        <span>{transaction.category}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`
                    font-display
                    text-2xl
                    font-medium
                    tracking-[-0.04em]

                    ${
                      transaction.type === "Income"
                        ? "text-green-600"
                        : transaction.type === "Expense"
                          ? "text-red-500"
                          : "text-cyan-600"
                    }
                    `}
                  >
                    {transaction.type === "Expense"
                      ? "-"
                      : "+"}

                    {formatCurrency(transaction.amount)}
                  </p>

                  <span
                    className={`
                    mt-2
                    inline-block
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.08em]

                    ${
                      transaction.type === "Income"
                        ? "bg-green-100 text-green-700"
                        : transaction.type === "Expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-cyan-100 text-cyan-700"
                    }
                    `}
                  >
                    {transaction.type === "Income"
                      ? t("income")
                      : transaction.type === "Expense"
                        ? t("expense")
                        : t("investment")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}