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
import { getAccounts, getBalances } from "../data/accounts";
import { getGoals } from "../data/goals";
import { computeNetWorth, getDebts } from "../data/netWorth";

import { formatCurrency } from "@/app/utils/currency";
import { t } from "@/app/data/i18n";


// Accounts + goal savings + investments - debts.
function trueNetWorth(): number {
  const balances = getBalances();

  const accounts = getAccounts().reduce(
    (sum, item) => sum + (balances[item.id] ?? 0),
    0
  );

  const goals = getGoals().reduce(
    (sum, item) => sum + (Number(item.savedAmount) || 0),
    0
  );

  return computeNetWorth({
    accounts,
    goals,
    investments: getPortfolioSummary().current,
    debts: getDebts(),
  }).netWorth;
}


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

    ["accountsUpdated","goalsUpdated","debtsUpdated"].forEach(
      (name) => window.addEventListener(name, refresh)
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

      ["accountsUpdated","goalsUpdated","debtsUpdated"].forEach(
        (name) => window.removeEventListener(name, refresh)
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

        kind="net"

        value={
          formatCurrency(
            trueNetWorth()
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

        kind="income"

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

        kind="expense"

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

        kind="invest"

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