"use client";

import { useEffect, useState } from "react";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";

import StatCard from "./StatCard";

import { getSummary } from "../data/transactions";
import { getPortfolioSummary } from "../data/investments";

import { formatCurrency } from "@/app/utils/currency";
import { t } from "@/app/data/i18n";


export default function SummaryCards() {

  const [summary, setSummary] =
    useState(
      getSummary()
    );


  const [portfolio, setPortfolio] =
    useState(
      getPortfolioSummary()
    );


  const [, forceCurrencyUpdate] =
    useState(0);


  const [, refreshLanguage] =
    useState(0);


  useEffect(() => {

    function refresh() {

      setSummary(
        getSummary()
      );

      setPortfolio(
        getPortfolioSummary()
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


  return (

    <div
      className="
        mt-8
        grid
        grid-cols-2
        gap-4
        md:gap-6
      "
    >

      <StatCard

        title={t("netWorth")}

        value={
          formatCurrency(
            summary.netWorth
          )
        }

        icon={
          <Wallet
            className="h-6 w-6"
          />
        }

      />


      <StatCard

        title={t("monthlyIncome")}

        value={
          formatCurrency(
            summary.income
          )
        }

        icon={
          <TrendingUp
            className="h-6 w-6"
          />
        }

      />


      <StatCard

        title={t("expenses")}

        value={
          formatCurrency(
            summary.expense
          )
        }

        icon={
          <TrendingDown
            className="h-6 w-6"
          />
        }

      />


      <StatCard

        title={t("investments")}

        value={
          formatCurrency(
            portfolio.current
          )
        }

        icon={
          <Landmark
            className="h-6 w-6"
          />
        }

      />

    </div>

  );

}