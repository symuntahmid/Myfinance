"use client";

import WorldMap from "react-svg-worldmap";
import { formatCurrency } from "@/app/utils/currency";
import { t } from "@/app/data/i18n";
import { useEffect, useState } from "react";

const comparisonData = [
  { country: "bd" as const, value: 58 },
  { country: "in" as const, value: 72 },
  { country: "us" as const, value: 84 },
  { country: "gb" as const, value: 78 },
  { country: "de" as const, value: 75 },
  { country: "jp" as const, value: 81 },
  { country: "au" as const, value: 69 },
  { country: "ca" as const, value: 77 },
];

export default function GlobalComparisonCard() {
  const [, forceCurrencyUpdate] = useState(0);
  const [, forceLanguageUpdate] = useState(0);

  useEffect(() => {
    const currencyListener = () => {
      forceCurrencyUpdate((value) => value + 1);
    };

    const languageListener = () => {
      forceLanguageUpdate((value) => value + 1);
    };

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
        "currencyUpdated",
        currencyListener
      );

      window.removeEventListener(
        "languageUpdated",
        languageListener
      );
    };
  }, []);

  const categories = [
    {
      icon: "🛍️",
      name: t("shopping"),
      value: 120,
      change: "-15%",
      good: true,
    },
    {
      icon: "🍔",
      name: t("food"),
      value: 560,
      change: "+15%",
      good: false,
    },
  ];

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-5
      shadow-sm
      transition
      hover:shadow-xl
      md:p-7
      "
    >
      {/* Glow */}

      <div
        className="
        pointer-events-none
        absolute
        -right-20
        -top-20
        h-56
        w-56
        rounded-full
        bg-cyan-500/10
        blur-3xl
        "
      />

      <div className="relative">
        {/* Header */}

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
            🌍 {t("globalBenchmark")}
          </p>

          <h2
            className="
            mt-3
            font-display
            text-3xl
            font-medium
            tracking-[-0.04em]
            text-[var(--foreground)]
            md:text-4xl
            "
          >
            {t("spendingPositionWorldwide")}
          </h2>

          <p
            className="
            mt-3
            font-body
            text-sm
            leading-relaxed
            text-[var(--muted)]
            "
          >
            {t("compareGlobalSpendingPatterns")}
          </p>
        </div>

        {/* Map */}

        <div
          className="
          mt-6
          rounded-[26px]
          border
          border-[var(--border)]
          bg-[var(--background)]
          p-3
          sm:p-5
          "
        >
          <div
            className="
            flex
            justify-center
            overflow-hidden
            scale-90
            sm:scale-100
            "
          >
            <WorldMap
              color="#06b6d4"
              title={t("globalSpendingComparison")}
              valueSuffix="%"
              size="lg"
              data={comparisonData}
            />
          </div>
        </div>

        {/* Category Comparison */}

        <div
          className="
          mt-6
          space-y-3
          "
        >
          {categories.map((item) => (
            <div
              key={item.name}
              className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-4
              transition
              hover:scale-[1.01]
              "
            >
              <div
                className="
                flex
                items-center
                gap-3
                "
              >
                <div
                  className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--card)]
                  text-xl
                  shadow-sm
                  "
                >
                  {item.icon}
                </div>

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
                    {item.name}
                  </p>

                  <p
                    className="
                    text-xs
                    text-[var(--muted)]
                    "
                  >
                    {t("monthlySpending")}
                  </p>
                </div>
              </div>

              <div
                className="
                flex
                items-center
                gap-2
                "
              >
                <p
                  className="
                  font-display
                  text-lg
                  font-medium
                  tracking-[-0.02em]
                  text-[var(--foreground)]
                  "
                >
                  {formatCurrency(item.value)}
                </p>

                <span
                  className={`
                  rounded-full
                  px-2.5
                  py-1
                  font-body
                  text-xs
                  font-medium

                  ${
                    item.good
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }
                  `}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Result Card */}

        <div
          className="
          mt-5
          rounded-[26px]
          border
          border-[var(--border)]
          bg-gradient-to-br
          from-emerald-500/10
          to-cyan-500/10
          p-5
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
                tracking-[0.12em]
                text-[var(--muted)]
                "
              >
                {t("overallSpendingHealth")}
              </p>

              <h3
                className="
                mt-2
                font-display
                text-3xl
                font-medium
                tracking-[-0.04em]
                text-[var(--foreground)]
                "
              >
                {t("betterThanPercent")}
              </h3>
            </div>

            <div
              className="
              rounded-full
              bg-emerald-500/15
              px-4
              py-2
              font-body
              text-xs
              font-medium
              uppercase
              tracking-[0.08em]
              text-emerald-500
              "
            >
              {t("good")}
            </div>
          </div>

          <p
            className="
            mt-3
            text-sm
            leading-5
            text-[var(--muted)]
            "
          >
            {t("healthierThanBenchmarkUsers")}
          </p>
        </div>
      </div>
    </section>
  );
}