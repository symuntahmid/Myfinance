"use client";

import { formatCurrency } from "@/app/utils/currency";
import { t } from "@/app/data/i18n";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

import {
  getTransactions,
  Transaction,
} from "@/app/data/transactions";


type Range =
  | "7D"
  | "30D"
  | "6M"
  | "1Y";


type ChartItem = {
  label: string;
  key: string;
  income: number;
  expense: number;
  savings: number;
};




function CustomTooltip({
  active,
  payload,
  label,
}: any) {


  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }


  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-4
      shadow-xl
      sm:p-5
      "
    >


      <p
        className="
        mb-3
        font-display
        text-lg
        font-medium
        tracking-[-0.02em]
        text-[var(--foreground)]
        "
      >
        {label}
      </p>


      <p
        className="
        font-body
        text-sm
        font-medium
        tracking-tight
        text-green-600
        "
      >
        {t("income")}:{" "}
        {formatCurrency(
          Number(
            payload.find(
              (item: any) =>
                item.dataKey === "income"
            )?.value || 0
          )
        )}
      </p>


      <p
        className="
        font-body
        text-sm
        font-medium
        tracking-tight
        text-red-500
        "
      >
        {t("expense")}:{" "}
        {formatCurrency(
          Number(
            payload.find(
              (item: any) =>
                item.dataKey === "expense"
            )?.value || 0
          )
        )}
      </p>


      <p
        className="
        font-body
        text-sm
        font-medium
        tracking-tight
        text-cyan-600
        "
      >
        {t("savingRate")}:{" "}
        {formatCurrency(
          Number(
            payload.find(
              (item: any) =>
                item.dataKey === "savings"
            )?.value || 0
          )
        )}
      </p>


    </div>

  );

}





export default function MoneyTrendChart() {


  const [range, setRange] =
    useState<Range>("6M");


  const [transactions, setTransactions] =
    useState<Transaction[]>([]);


  const [, forceCurrencyUpdate] =
    useState(0);





  /*
    Load and refresh transactions
  */

  useEffect(() => {


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    const refresh = () => {

      const data =
        getTransactions();


      setTransactions(
        Array.isArray(data)
          ? data.filter(Boolean)
          : []
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

    };


  }, []);





  /*
    Build chart data
  */

  const data =
    useMemo(() => {


      const now =
        new Date();





      /*
        7D / 30D
        Daily view
      */

      if (
        range === "7D" ||
        range === "30D"
      ) {


        const totalDays =
          range === "30D"
            ? 30
            : 7;


        const days:
          ChartItem[] = [];



        for (
          let i = totalDays - 1;
          i >= 0;
          i--
        ) {


          const date =
            new Date(now);


          date.setDate(
            now.getDate() - i
          );


          days.push({

            label:
              range === "30D"
                ? date.toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )
                : date.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  ),


            key:
              date.toDateString(),


            income: 0,

            expense: 0,

            savings: 0,

          });

        }





        transactions.forEach(
          transaction => {


            const date =
              new Date(
                transaction.date
              ).toDateString();


            const item =
              days.find(
                day =>
                  day.key === date
              );


            if (!item) {
              return;
            }


            if (
              transaction.type ===
              "Income"
            ) {

              item.income +=
                transaction.amount;

            }


            if (
              transaction.type ===
              "Expense"
            ) {

              item.expense +=
                transaction.amount;

            }

          }
        );





        return days.map(day => ({

          ...day,

          savings:
            day.income -
            day.expense,

        }));

      }





      /*
        6M / 1Y
        Monthly view
      */

      const months:
        ChartItem[] = [];


      const totalMonths =
        range === "1Y"
          ? 12
          : 6;



      for (
        let i = totalMonths - 1;
        i >= 0;
        i--
      ) {


        const date =
          new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );


        months.push({

          label:
            date.toLocaleDateString(
              "en-US",
              {
                month: "short",
              }
            ),


          key:
            `${date.getFullYear()}-${date.getMonth()}`,

          income: 0,

          expense: 0,

          savings: 0,

        });

      }





      transactions.forEach(
        transaction => {


          const date =
            new Date(
              transaction.date
            );


          const item =
            months.find(
              month =>
                month.key ===
                `${date.getFullYear()}-${date.getMonth()}`
            );


          if (!item) {
            return;
          }


          if (
            transaction.type ===
            "Income"
          ) {

            item.income +=
              transaction.amount;

          }


          if (
            transaction.type ===
            "Expense"
          ) {

            item.expense +=
              transaction.amount;

          }

        }
      );





      return months.map(month => ({

        ...month,

        savings:
          month.income -
          month.expense,

      }));


    }, [
      transactions,
      range,
    ]);





  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-4
      shadow-xl
      sm:p-8
      "
    >


      {/* Header */}

      <div
        className="
        mb-6
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
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
          {t("financialTrend")}
        </h2>




        {/* Range Selector */}

        <div
          className="
          flex
          flex-wrap
          gap-1
          rounded-full
          bg-[var(--background)]
          p-1
          "
        >


          {(
            [
              "7D",
              "30D",
              "6M",
              "1Y",
            ] as Range[]
          ).map(item => (


            <button
              key={item}
              type="button"
              onClick={() =>
                setRange(item)
              }
              className={`
              rounded-full
              px-3
              py-2
              font-body
              text-xs
              font-medium
              uppercase
              tracking-[0.08em]
              transition
              ${
                range === item
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--card)]"
              }
              `}
            >
              {item}
            </button>


          ))}


        </div>


      </div>





      {/* Chart */}

      <div
        className="
        h-[300px]
        sm:h-[380px]
        "
      >


        <ResponsiveContainer
          width="100%"
          height="100%"
        >


          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >


            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--muted)",
                fontSize: 13,
                fontWeight: 500,
              }}
            />



            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                stroke: "#cbd5e1",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />



            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={4}
              dot={false}
              animationDuration={1000}
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(34,197,94,0.45))",
              }}
            />



            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={4}
              dot={false}
              animationDuration={1000}
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(239,68,68,0.45))",
              }}
            />



            <Line
              type="monotone"
              dataKey="savings"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={false}
              animationDuration={1000}
              style={{
                filter:
                  "drop-shadow(0 0 7px rgba(6,182,212,0.55))",
              }}
            />


          </LineChart>


        </ResponsiveContainer>


      </div>


    </div>

  );

}