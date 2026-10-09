"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import {
  getSummary,
} from "../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";

import { t } from "@/app/data/i18n";


function CustomTooltip({
  active,
  payload,
}: any) {

  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item = payload[0];

  return (

    <div
      className="
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        px-5
        py-4
        shadow-xl
      "
    >

      <p
        className="
          text-sm
          text-[var(--muted)]
        "
      >
        {item.payload.name}
      </p>


      <p
        className="
          mt-2
          font-display
          text-2xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
        "
      >
        {formatCurrency(
          Number(item.value)
        )}
      </p>

    </div>

  );
}


export default function IncomeExpenseChart() {

  const [summary, setSummary] =
    useState(
      () => getSummary()
    );


  const [, forceCurrencyUpdate] =
    useState(0);


  const [, refreshLanguage] =
    useState(0);


  useEffect(() => {

    const refresh = () => {

      setSummary(
        getSummary()
      );

    };


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


    refresh();


    window.addEventListener(
      "transactionsUpdated",
      refresh
    );


    window.addEventListener(
      "investmentsUpdated",
      refresh
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
        refresh
      );


      window.removeEventListener(
        "investmentsUpdated",
        refresh
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


  const data = [

    {
      name: t("income"),
      amount: summary.income,
      color: "#22c55e",
    },

    {
      name: t("expense"),
      amount: summary.expense,
      color: "#ef4444",
    },

    {
      name: t("investment"),
      amount: summary.investment,
      color: "#14b8a6",
    },

  ];


  return (

    <div
      className="
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
          items-start
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
              tracking-[0.12em]
              text-[var(--muted)]
            "
          >
            {t("cashFlowOverview")}
          </p>


          <h2
            className="
              mt-2
              font-display
              text-3xl
              font-medium
              tracking-[-0.04em]
              text-[var(--foreground)]
            "
          >
            {t("incomeVsExpenses")}
          </h2>


          <p
            className="
              mt-2
              font-body
              text-sm
              font-normal
              tracking-tight
              text-[var(--primary)]
            "
          >
            {t("compareMonthlyMoneyFlow")}
          </p>

        </div>


        <div
          className="
            flex
            gap-3
          "
        >

          <div
            className="
              rounded-xl
              bg-green-500/10
              px-4
              py-3
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
              {t("income")}
            </p>


            <p
              className="
                font-display
                text-xl
                font-medium
                tracking-[-0.04em]
                text-green-600
              "
            >
              {formatCurrency(
                summary.income
              )}
            </p>

          </div>


          <div
            className="
              rounded-xl
              bg-red-500/10
              px-4
              py-3
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
              {t("expense")}
            </p>


            <p
              className="
                font-display
                text-xl
                font-medium
                tracking-[-0.04em]
                text-red-600
              "
            >
              {formatCurrency(
                summary.expense
              )}
            </p>

          </div>

        </div>

      </div>


      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.15}
            />


            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--muted)",
              }}
            />


            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--muted)",
              }}
            />


            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.15)",
              }}
              content={
                <CustomTooltip />
              }
            />


            <Bar
              dataKey="amount"
              radius={[12, 12, 0, 0]}
              animationDuration={900}
            >

              {data.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={entry.color}
                  />

                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}