"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  getTransactions,
  Transaction,
} from "../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";

import { t } from "@/app/data/i18n";


export default function RecentTransactions() {

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);


  const [, forceCurrencyUpdate] =
    useState(0);


  const [, refreshLanguage] =
    useState(0);


  useEffect(() => {

    function refreshTransactions() {

      setTransactions(
        getTransactions()
      );

    }


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    const languageListener = () => {

      refreshLanguage(
        value => value + 1
      );

    };


    refreshTransactions();


    window.addEventListener(
      "transactionsUpdated",
      refreshTransactions
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
        refreshTransactions
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


  return (

    <div
      className="
        mt-10
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-8
        shadow-sm
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
          {t("recentTransactions")}
        </h2>


        <Link
          href="/money/transactions"
          className="
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
              tracking-[-0.04em]
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
              tracking-[-0.015em]
              text-[var(--muted)]
            "
          >
            {t("latestTransactionsMessage")}
          </p>

        </div>

      ) : (

        <table className="w-full">

          <thead>

            <tr
              className="
                border-b
                border-[var(--border)]
              "
            >

              <th
                className="
                  py-3
                  text-left
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                {t("type")}
              </th>


              <th
                className="
                  py-3
                  text-left
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                {t("source")}
              </th>


              <th
                className="
                  py-3
                  text-left
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                {t("category")}
              </th>


              <th
                className="
                  py-3
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                {t("amount")}
              </th>

            </tr>

          </thead>


          <tbody>

            {transactions
              .slice(0, 3)
              .map((transaction) => (

                <tr
                  key={transaction.id}
                  className="
                    border-b
                    border-[var(--border)]
                    last:border-0
                  "
                >

                  <td className="py-5">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          transaction.type === "Income"
                            ? "bg-green-100 text-green-700"
                            : transaction.type === "Expense"
                              ? "bg-red-100 text-red-700"
                              : "bg-[var(--primary)]/10 text-[var(--primary)]"
                        }
                      `}
                    >
                      {transaction.type}
                    </span>

                  </td>


                  <td
                    className="
                      font-body
                      text-sm
                      font-normal
                      tracking-[-0.015em]
                      text-[var(--foreground)]
                    "
                  >
                    {transaction.source}
                  </td>


                  <td
                    className="
                      font-body
                      text-sm
                      tracking-[-0.015em]
                      text-[var(--muted)]
                    "
                  >
                    {transaction.category || "-"}
                  </td>


                  <td
                    className={`
                      text-right
                      font-display
                      text-2xl
                      font-medium
                      tracking-[-0.04em]

                      ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : transaction.type === "Expense"
                            ? "text-red-500"
                            : "text-[var(--primary)]"
                      }
                    `}
                  >

                    {transaction.type === "Expense"
                      ? "-"
                      : "+"}

                    {formatCurrency(
                      transaction.amount
                    )}

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      )}

    </div>

  );
}