"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getTransactions,
} from "../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";

import {
  t,
} from "@/app/data/i18n";



export default function SpendingInsights() {


  const [, forceCurrencyUpdate] =
    useState(0);



  /*
    Refresh when currency changes
  */

  useEffect(() => {


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return () => {

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };


  }, []);





  const transactions =
    getTransactions();





  /*
    Separate transactions
  */

  const expenses =
    transactions.filter(
      transaction =>
        transaction.type === "Expense"
    );


  const income =
    transactions.filter(
      transaction =>
        transaction.type === "Income"
    );





  /*
    Total income
  */

  const totalIncome =
    income.reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );





  /*
    Total expenses
  */

  const totalExpense =
    expenses.reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );





  /*
    Saving rate
  */

  const savingRate =
    totalIncome === 0
      ? 0
      : (
          (
            totalIncome -
            totalExpense
          ) /
          totalIncome
        ) * 100;





  /*
    Expense categories
  */

  const expenseCategory:
    Record<string, number> = {};



  expenses.forEach(
    transaction => {

      const category =
        transaction.category ||
        "Other";


      expenseCategory[category] =
        (
          expenseCategory[category] ||
          0
        ) +
        transaction.amount;

    }
  );





  /*
    Largest expense category
  */

  const topExpense =
    Object.entries(
      expenseCategory
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0];





  /*
    Income sources
  */

  const incomeSource:
    Record<string, number> = {};



  income.forEach(
    transaction => {

      const source =
        transaction.source ||
        "Other";


      incomeSource[source] =
        (
          incomeSource[source] ||
          0
        ) +
        transaction.amount;

    }
  );





  /*
    Main income source
  */

  const topIncome =
    Object.entries(
      incomeSource
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0];





  /*
    Highest individual expense
  */

  const highestExpense =
    [...expenses]
      .sort(
        (a, b) =>
          b.amount - a.amount
      )[0];





  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-5
      shadow-xl
      sm:p-8
      "
    >


      {/* Header */}

      <div
        className="
        mb-8
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
          {t("aiFinancialInsights")}
        </p>


        <h2
          className="
          mt-3
          font-display
          text-4xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
          "
        >
          {t("todaysSummary")}
        </h2>

      </div>





      {/* Insights */}

      <div
        className="
        space-y-5
        "
      >


        <InsightCard
          icon="💸"
          title={t("largestExpense")}
          value={
            topExpense
              ? `${topExpense[0]} • ${formatCurrency(
                  topExpense[1]
                )}`
              : t("noExpense")
          }
        />



        <InsightCard
          icon="💰"
          title={t("mainIncome")}
          value={
            topIncome
              ? `${topIncome[0]} • ${formatCurrency(
                  topIncome[1]
                )}`
              : t("noIncome")
          }
        />



        <InsightCard
          icon="🎯"
          title={t("savingRate")}
          value={`${savingRate.toFixed(1)}%`}
        />



        <InsightCard
          icon="⚠️"
          title={t("highestSpending")}
          value={
            highestExpense
              ? formatCurrency(
                  highestExpense.amount
                )
              : "-"
          }
        />


      </div>


    </div>

  );

}





/* =====================================================
   INSIGHT CARD
===================================================== */

function InsightCard({

  icon,

  title,

  value,

}: {

  icon: string;

  title: string;

  value: string;

}) {


  return (

    <div
      className="
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-[var(--border)]
      p-4
      transition
      hover:border-[var(--primary)]
      hover:shadow-md
      sm:p-5
      "
    >


      <div
        className="
        flex
        min-w-0
        items-center
        gap-4
        "
      >


        {/* Icon */}

        <div
          className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-[var(--background)]
          text-xl
          sm:h-14
          sm:w-14
          sm:text-2xl
          "
        >
          {icon}
        </div>



        {/* Content */}

        <div
          className="
          min-w-0
          "
        >

          <p
            className="
            font-body
            text-xs
            font-medium
            uppercase
            tracking-[0.08em]
            text-[var(--muted)]
            "
          >
            {title}
          </p>


          <h3
            className="
            mt-2
            break-words
            font-display
            text-lg
            font-medium
            tracking-[-0.02em]
            text-[var(--foreground)]
            "
          >
            {value}
          </h3>

        </div>


      </div>


    </div>

  );

}