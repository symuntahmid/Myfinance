"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getPortfolioHistory } from "@/app/data/portfolioHistory";
import { formatCurrency } from "@/app/utils/currency";
import { useLanguage } from "@/app/context/LanguageContext";


type PortfolioHistoryItem = {
  id?: string;
  date: string;
  value: number;
};


type ChartItem = {
  date: string;
  label: string;
  value: number;
};


export default function PortfolioGrowthChart() {

  const {
    language,
    t,
  } = useLanguage();


  const [
    history,
    setHistory,
  ] = useState<PortfolioHistoryItem[]>([]);


  const [
    ,
    forceCurrencyUpdate,
  ] = useState(0);


  /* =====================================================
     LOAD REAL PORTFOLIO HISTORY
  ===================================================== */

  const refreshHistory = useCallback(() => {

    try {

      const result =
        getPortfolioHistory();


      if (!Array.isArray(result)) {

        setHistory([]);

        return;

      }


      const cleaned =
        result
          .filter((item) => {

            if (!item) {
              return false;
            }


            const date =
              new Date(item.date);


            const value =
              Number(item.value);


            return (
              typeof item.date === "string" &&
              !Number.isNaN(date.getTime()) &&
              Number.isFinite(value) &&
              value >= 0
            );

          })
          .map((item) => ({

            id: item.id,

            date: item.date,

            value:
              Number(item.value),

          }))
          .sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          );


      setHistory(cleaned);

    } catch (error) {

      console.error(
        "Failed to load portfolio history:",
        error
      );

      setHistory([]);

    }

  }, []);


  /* =====================================================
     EVENTS
  ===================================================== */

  useEffect(() => {

    refreshHistory();


    const currencyListener = () => {

      forceCurrencyUpdate(
        (value) => value + 1
      );

    };


    const portfolioHistoryListener = () => {

      refreshHistory();

    };


    const investmentListener = () => {

      refreshHistory();

    };


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    window.addEventListener(
      "portfolioHistoryUpdated",
      portfolioHistoryListener
    );


    window.addEventListener(
      "investmentsUpdated",
      investmentListener
    );


    return () => {

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );


      window.removeEventListener(
        "portfolioHistoryUpdated",
        portfolioHistoryListener
      );


      window.removeEventListener(
        "investmentsUpdated",
        investmentListener
      );

    };

  }, [refreshHistory]);


  /* =====================================================
     REAL CHART DATA

     IMPORTANT:
     - No fake values
     - No generated dates
     - No interpolation
     - No artificial curve
     - Every point comes from portfolioHistory
  ===================================================== */

  const data =
    useMemo<ChartItem[]>(() => {

      return history.map((item) => {

        const date =
          new Date(item.date);


        /*
         * Use the currently selected language
         * for chart dates.
         *
         * English → Jul 28
         * Bangla  → ২৮ জুলাই
         */

        const locale =
          language === "bn"
            ? "bn-BD"
            : "en-US";


        return {

          date: item.date,

          label:
            date.toLocaleDateString(
              locale,
              {
                month: "short",
                day: "numeric",
              }
            ),

          value:
            Number(item.value),

        };

      });

    }, [history, language]);


  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (data.length === 0) {

    return (

      <div
        className="
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-sm
        sm:p-8
        "
      >

        <h2
          className="
          mb-3
          font-display
          text-3xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
          "
        >
          {t("portfolioGrowth")}
        </h2>


        <p
          className="
          mb-6
          font-body
          text-sm
          leading-relaxed
          tracking-tight
          text-[var(--muted)]
          "
        >
          {t("trackPortfolioGrowth")}
        </p>


        <div
          className="
          flex
          h-64
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-[var(--border)]
          bg-[var(--background)]
          px-4
          text-center
          font-body
          text-sm
          tracking-tight
          text-[var(--muted)]
          "
        >
          {t("noPortfolioHistory")}
        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN CHART
  ===================================================== */

  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-5
      shadow-sm
      sm:p-8
      "
    >

      {/* Header */}

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
          {t("portfolioGrowth")}
        </h2>


        <p
          className="
          mt-2
          font-body
          text-sm
          leading-relaxed
          tracking-tight
          text-[var(--muted)]
          "
        >
          {t("trackPortfolioGrowth")}
        </p>

      </div>


      {/* Chart */}

      <div
        className="
        h-72
        sm:h-80
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
              left: 10,
              bottom: 10,
            }}
          >

            {/* Area gradient */}

            <defs>

              <linearGradient
                id="portfolioGrowthGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#06b6d4"
                  stopOpacity={0.14}
                />

                <stop
                  offset="100%"
                  stopColor="#06b6d4"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>


            {/* Grid */}

            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />


            {/* X Axis */}

            <XAxis
              dataKey="label"
              tick={{
                fill: "var(--muted)",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />


            {/* Y Axis */}

            <YAxis
              tick={{
                fill: "var(--muted)",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                formatCurrency(
                  Number(value)
                )
              }
              tickLine={false}
              axisLine={false}
              width={80}
              domain={[
                0,
                "auto",
              ]}
            />


            {/* Tooltip */}

            <Tooltip
              cursor={{
                stroke:
                  "var(--border)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}

              contentStyle={{
                borderRadius: "16px",
                border:
                  "1px solid var(--border)",
                backgroundColor:
                  "var(--card)",
                color:
                  "var(--foreground)",
                boxShadow:
                  "0 12px 35px rgba(0,0,0,.15)",
              }}

              labelStyle={{
                color:
                  "var(--foreground)",
                fontWeight: 600,
                marginBottom: "4px",
              }}

              formatter={(value) => [

                formatCurrency(
                  Number(value)
                ),

                t("portfolioValue"),

              ]}
            />


            {/* Area */}

            <Area
              type="linear"
              dataKey="value"
              stroke="none"
              fill="url(#portfolioGrowthGradient)"
              isAnimationActive={false}
            />


            {/* Real Portfolio Line */}

            <Line
              type="linear"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={3}

              dot={{
                r: 4,
                fill: "#06b6d4",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}

              activeDot={{
                r: 7,
                fill: "#06b6d4",
                stroke: "var(--card)",
                strokeWidth: 3,
              }}

              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}