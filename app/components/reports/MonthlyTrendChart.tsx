"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getTransactions,
  Transaction,
} from "../../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";

import {
  useLanguage,
} from "@/app/context/LanguageContext";


type MonthData = {
  key: string;
  label: string;
  income: number;
  expense: number;
  investment: number;
  cashFlow: number;
};


/* =====================================================
   LAST SIX MONTHS
===================================================== */

function getLastSixMonths(): MonthData[] {

  const transactions =
    getTransactions();

  const now =
    new Date();

  const months: MonthData[] = [];


  for (let i = 5; i >= 0; i--) {

    const date =
      new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );


    const year =
      date.getFullYear();

    const month =
      date.getMonth();


    const monthTransactions =
      transactions.filter(
        (transaction) => {

          const transactionDate =
            new Date(
              transaction.date
            );


          return (
            transactionDate.getFullYear()
              === year
            &&
            transactionDate.getMonth()
              === month
          );

        }
      );


    let income = 0;
    let expense = 0;
    let investment = 0;


    monthTransactions.forEach(
      (transaction: Transaction) => {

        if (
          transaction.type ===
          "Income"
        ) {

          income +=
            transaction.amount;

        }


        if (
          transaction.type ===
          "Expense"
        ) {

          expense +=
            transaction.amount;

        }


        if (
          transaction.type ===
          "Investment"
        ) {

          investment +=
            transaction.amount;

        }

      }
    );


    months.push({

      key:
        `${year}-${month}`,

      label:
        date.toLocaleDateString(
          undefined,
          {
            month: "short",
          }
        ),

      income,

      expense,

      investment,

      cashFlow:
        income -
        expense -
        investment,

    });

  }


  return months;

}


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(
  amount: number
) {

  return formatCurrency(
    amount
  );

}


/* =====================================================
   COMPONENT
===================================================== */

export default function MonthlyTrendChart() {

  const { t } =
    useLanguage();


  const [
    transactionsVersion,
    setTransactionsVersion,
  ] = useState(0);


  const [
    ,
    forceCurrencyUpdate,
  ] = useState(0);


  /* ===================================================
     EVENTS
  =================================================== */

  useEffect(() => {

    const refresh = () => {

      setTransactionsVersion(
        (value) =>
          value + 1
      );

    };


    const currencyListener = () => {

      forceCurrencyUpdate(
        (value) =>
          value + 1
      );

    };


    window.addEventListener(
      "transactionsUpdated",
      refresh
    );


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return () => {

      window.removeEventListener(
        "transactionsUpdated",
        refresh
      );


      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };

  }, []);


  /* ===================================================
     MONTH DATA
  =================================================== */

  const months =
    useMemo(
      () =>
        getLastSixMonths(),
      [transactionsVersion]
    );


  /* ===================================================
     MAX VALUE
  =================================================== */

  const maxValue =
    Math.max(
      ...months.flatMap(
        (month) => [
          month.income,
          month.expense,
          month.investment,
        ]
      ),
      1
    );


  /* ===================================================
     DATA CHECK
  =================================================== */

  const hasData =
    months.some(
      (month) =>
        month.income > 0 ||
        month.expense > 0 ||
        month.investment > 0
    );


  /* ===================================================
     RENDER
  =================================================== */

  return (

    <section
      className="
      rounded-2xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-6
      shadow-sm
      "
    >

      {/* HEADER */}

      <div className="mb-6">

        <h2
          className="
          font-display
          text-3xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
          "
        >
          {t("financialTrend")}
        </h2>


        <p
          className="
          mt-2
          font-body
          text-sm
          font-normal
          tracking-tight
          text-[var(--muted)]
          "
        >
          {t("financialTrendDescription")}
        </p>

      </div>


      {/* NO DATA */}

      {!hasData ? (

        <div
          className="
          rounded-xl
          bg-[var(--background)]
          p-8
          text-center
          "
        >

          <p
            className="
            font-body
            text-sm
            font-medium
            tracking-tight
            text-[var(--foreground)]
            "
          >
            {t("notEnoughDataYet")}
          </p>


          <p
            className="
            mt-2
            font-body
            text-sm
            font-normal
            tracking-tight
            text-[var(--muted)]
            "
          >
            {t("addDataToSeeFinancialTrend")}
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {/* LEGEND */}

          <div
            className="
            flex
            flex-wrap
            gap-5
            text-sm
            "
          >

            {/* Income */}

            <div
              className="
              flex
              items-center
              gap-2
              "
            >

              <span
                className="
                h-3
                w-3
                rounded-full
                bg-green-500
                "
              />

              <span
                className="
                font-body
                text-sm
                tracking-tight
                text-[var(--muted)]
                "
              >
                {t("income")}
              </span>

            </div>


            {/* Expenses */}

            <div
              className="
              flex
              items-center
              gap-2
              "
            >

              <span
                className="
                h-3
                w-3
                rounded-full
                bg-red-500
                "
              />

              <span
                className="
                font-body
                text-sm
                tracking-tight
                text-[var(--muted)]
                "
              >
                {t("expenses")}
              </span>

            </div>


            {/* Investments */}

            <div
              className="
              flex
              items-center
              gap-2
              "
            >

              <span
                className="
                h-3
                w-3
                rounded-full
                bg-indigo-500
                "
              />

              <span
                className="
                font-body
                text-sm
                tracking-tight
                text-[var(--muted)]
                "
              >
                {t("investment")}
              </span>

            </div>

          </div>


          {/* MONTHS */}

          <div className="space-y-5">

            {months.map(
              (month) => (

                <div
                  key={month.key}
                >

                  {/* MONTH HEADER */}

                  <div
                    className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    "
                  >

                    <span
                      className="
                      w-10
                      font-body
                      text-sm
                      font-medium
                      tracking-tight
                      text-[var(--foreground)]
                      "
                    >
                      {month.label}
                    </span>


                    <span
                      className={`
                        font-display
                        text-xl
                        font-medium
                        tracking-[-0.03em]
                        ${
                          month.cashFlow >= 0
                            ? "text-teal-600"
                            : "text-red-600"
                        }
                      `}
                    >

                      {month.cashFlow >= 0
                        ? "+"
                        : ""}

                      {formatMoney(
                        month.cashFlow
                      )}

                    </span>

                  </div>


                  <div className="space-y-2">

                    {/* INCOME */}

                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      "
                    >

                      <span
                        className="
                        w-20
                        font-body
                        text-xs
                        tracking-tight
                        text-[var(--muted)]
                        "
                      >
                        {t("income")}
                      </span>


                      <div
                        className="
                        h-3
                        flex-1
                        overflow-hidden
                        rounded-full
                        bg-[var(--background)]
                        "
                      >

                        <div
                          className="
                          h-full
                          rounded-full
                          bg-green-500
                          transition-all
                          "
                          style={{
                            width:
                              `${
                                (
                                  month.income /
                                  maxValue
                                ) * 100
                              }%`,
                          }}
                        />

                      </div>


                      <span
                        className="
                        w-16
                        text-right
                        font-body
                        text-xs
                        font-medium
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {formatMoney(
                          month.income
                        )}
                      </span>

                    </div>


                    {/* EXPENSES */}

                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      "
                    >

                      <span
                        className="
                        w-20
                        font-body
                        text-xs
                        tracking-tight
                        text-[var(--muted)]
                        "
                      >
                        {t("expenses")}
                      </span>


                      <div
                        className="
                        h-3
                        flex-1
                        overflow-hidden
                        rounded-full
                        bg-[var(--background)]
                        "
                      >

                        <div
                          className="
                          h-full
                          rounded-full
                          bg-red-500
                          transition-all
                          "
                          style={{
                            width:
                              `${
                                (
                                  month.expense /
                                  maxValue
                                ) * 100
                              }%`,
                          }}
                        />

                      </div>


                      <span
                        className="
                        w-16
                        text-right
                        font-body
                        text-xs
                        font-medium
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {formatMoney(
                          month.expense
                        )}
                      </span>

                    </div>


                    {/* INVESTMENT */}

                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      "
                    >

                      <span
                        className="
                        w-20
                        font-body
                        text-xs
                        tracking-tight
                        text-[var(--muted)]
                        "
                      >
                        {t("invested")}
                      </span>


                      <div
                        className="
                        h-3
                        flex-1
                        overflow-hidden
                        rounded-full
                        bg-[var(--background)]
                        "
                      >

                        <div
                          className="
                          h-full
                          rounded-full
                          bg-indigo-500
                          transition-all
                          "
                          style={{
                            width:
                              `${
                                (
                                  month.investment /
                                  maxValue
                                ) * 100
                              }%`,
                          }}
                        />

                      </div>


                      <span
                        className="
                        w-16
                        text-right
                        font-body
                        text-xs
                        font-medium
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {formatMoney(
                          month.investment
                        )}
                      </span>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </section>

  );

}