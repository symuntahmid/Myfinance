"use client";

import { useEffect, useState } from "react";

import { completeTask } from "../../data/dailyJourney";
import { addXP } from "@/app/data/player";

import {
  getMonthlyReport,
  getFinancialHealthScore,
} from "../../data/transactions";

import {
  getPortfolioSummary,
} from "../../data/investments";

import FinancialHealthCard from "../../components/reports/FinancialHealthCard";
import MonthlyTrendChart from "../../components/reports/MonthlyTrendChart";

import { formatCurrency } from "@/app/utils/currency";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ReportsPage() {
const { t } = useLanguage();

  const [report, setReport] = useState(() =>
    getMonthlyReport()
  );

  const [score, setScore] = useState(() =>
    getFinancialHealthScore()
  );

  const [portfolio, setPortfolio] = useState(() =>
    getPortfolioSummary()
  );

  const [, forceCurrencyUpdate] =
  useState(0);


 useEffect(() => {

  const refreshReport = () => {

    setReport(getMonthlyReport());

    setScore(
      getFinancialHealthScore()
    );

    setPortfolio(
      getPortfolioSummary()
    );

  };


  const currencyListener = () => {

    forceCurrencyUpdate(
      value => value + 1
    );

  };


  refreshReport();


  // Complete review task only once
  const completed =
    completeTask(2);


  if (completed) {

    addXP(10);

    window.dispatchEvent(
      new Event("dailyJourneyUpdated")
    );

  }



  window.addEventListener(
    "transactionsUpdated",
    refreshReport
  );


  window.addEventListener(
    "investmentsUpdated",
    refreshReport
  );


  window.addEventListener(
    "currencyUpdated",
    currencyListener
  );



  return () => {

    window.removeEventListener(
      "transactionsUpdated",
      refreshReport
    );


    window.removeEventListener(
      "investmentsUpdated",
      refreshReport
    );


    window.removeEventListener(
      "currencyUpdated",
      currencyListener
    );

  };


}, []);

  const formatMoney = (
  amount?: number
) =>
  formatCurrency(
    amount ?? 0
  );



  const investmentProfitPositive =
    portfolio.profit >= 0;


  const investmentReturnPositive =
    portfolio.returnPercentage >= 0;



  return (

    <div className="space-y-8">


      {/* HEADER */}

      <div>

<h1
className="
font-display
text-5xl
font-medium
tracking-[-0.05em]
text-[var(--foreground)]
"
>
  {t("monthlyReport")}
</h1>


<p
className="
mt-3
font-body
text-sm
tracking-tight
text-[var(--muted)]
"
>
          {t("monthlyReportDescription")}
        </p>

      </div>



      {/* FINANCIAL HEALTH */}

      <FinancialHealthCard
        score={score}
      />



      {/* MONTHLY OVERVIEW */}

      <section>

        <div className="mb-4">

  <h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
            {t("monthlyOverview")}
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
            {t("monthlyOverviewDescription")}
          </p>

        </div>



        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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

<h3
className="
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-green-600
"
>
              {formatMoney(report.income)}
            </h3>

<p
className="
mt-2
font-body
text-xs
font-normal
tracking-tight
text-[var(--muted)]
"
>
  {t("moneyReceivedThisMonth")}
</p>

          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("expenses")}
            </p>

<h3
className="
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-red-600
"
>
              {formatMoney(report.expense)}
            </h3>

<p
className="
mt-2
font-body
text-xs
font-normal
tracking-tight
text-[var(--muted)]
"
>
              {t("moneySpentThisMonth")}
            </p>

          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("investedThisMonth")}
            </p>

<h3
className="
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-indigo-600
"
>
              {formatMoney(report.investmentSpent)}
            </h3>

<p
className="
mt-2
font-body
text-xs
font-normal
tracking-tight
text-[var(--muted)]
"
>
              {t("moneyAllocatedToInvestments")}
            </p>

          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("netCashFlow")}
            </p>


<h3
className={`
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
${
report.netCashFlow >= 0
? "text-teal-600"
: "text-red-600"
}
`}
>
  {formatMoney(report.netCashFlow)}
</h3>


<p
className="
mt-2
font-body
text-xs
font-normal
tracking-tight
text-[var(--muted)]
"
>
              {t("cashRemainingAfterActivity")}
            </p>

          </div>


        </div>

      </section>



      {/* FINANCIAL TREND */}

      <MonthlyTrendChart />



      {/* CASH FLOW */}

      <section>

        <div className="mb-4">

<h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
            {t("cashFlow")}
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
            {t("cashFlowDescription")}
          </p>

        </div>


        <div className="grid gap-5 md:grid-cols-2">


          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

            <div className="flex justify-between">

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
                  {t("availableCash")}
                </p>


<h3
className="
mt-3
font-display
text-4xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
                  {formatMoney(report.availableCash)}
                </h3>

              </div>


              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold">
                CASH
              </span>


            </div>



            <div className="mt-6 space-y-3">


              <div className="flex justify-between text-sm">

                <span className="text-[var(--muted)]">
                  {t("income")}
                </span>

                <span className="font-semibold text-green-600">
                  +{formatMoney(report.income)}
                </span>

              </div>



              <div className="flex justify-between text-sm">

                <span className="text-[var(--muted)]">
                  {t("expenses")}
                </span>

                <span className="font-semibold text-red-600">
                  -{formatMoney(report.expense)}
                </span>

              </div>



              <div className="flex justify-between text-sm">

                <span className="text-[var(--muted)]">
                  Investments
                </span>

                <span className="font-semibold text-indigo-600">
                  -{formatMoney(report.investmentSpent)}
                </span>

              </div>


            </div>


          </div>
                    {/* Savings Rate */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("savingRate")}
            </p>


<h3
className="
mt-3
font-display
text-6xl
font-medium
tracking-[-0.05em]
text-teal-600
"
>
              {Math.max(report.savingsRate, 0).toFixed(1)}%
            </h3>


<p
className="
mt-3
font-body
text-sm
font-normal
tracking-tight
text-[var(--muted)]
"
>
              {t("savingsRateDescription")}
            </p>


            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(report.savingsRate, 0),
                    100
                  )}%`,
                }}
              />

            </div>


          </div>


        </div>

      </section>




      {/* INVESTMENT PERFORMANCE */}

      <section>

        <div className="mb-4">

<h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
            {t("investmentPerformance")}
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
            {t("investmentPerformanceDescription")}
          </p>

        </div>



        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">



          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("portfolioValue")}
            </p>

<h3
className="
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-indigo-600
"
>
              {formatMoney(report.investment)}
            </h3>

          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("totalInvested")}
            </p>


<h3
className="
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
              {formatMoney(report.investedAmount)}
            </h3>


          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("profitLoss")}
            </p>


<h3
className={`
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
${
investmentProfitPositive
? "text-green-600"
: "text-red-600"
}
`}
>
  {investmentProfitPositive ? "+" : ""}
  {formatMoney(report.investmentProfit)}
</h3>


          </div>




          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

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
              {t("return")}
            </p>


<h3
className={`
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
${
investmentReturnPositive
? "text-green-600"
: "text-red-600"
}
`}
>
  {investmentReturnPositive ? "+" : ""}
  {report.investmentReturn.toFixed(2)}%
</h3>


          </div>



        </div>

      </section>





      {/* EXPENSE BREAKDOWN */}

      {report.expenseBreakdown.length > 0 && (

        <section>


          <div className="mb-4">

<h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
              {t("expenseBreakdown")}
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
              {t("expenseBreakdownDescription")}
            </p>


          </div>



          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

            <div className="space-y-5">


              {report.expenseBreakdown.map(
                (item) => {

                  const percentage =
                    report.expense > 0
                      ? (item.amount /
                          report.expense) *
                        100
                      : 0;


                  return (

                    <div key={item.category}>


                      <div className="flex justify-between">

                        <span className="font-medium">
                          {item.category}
                        </span>


                        <span className="font-semibold">
                          {formatMoney(item.amount)}
                        </span>


                      </div>



                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div

                          className="h-full rounded-full bg-red-400"

                          style={{
                            width: `${percentage}%`,
                          }}

                        />

                      </div>


                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {percentage.toFixed(1)}{t("percentOfExpenses")}
                      </p>


                    </div>

                  );

                }
              )}


            </div>


          </div>


        </section>

      )}






      {/* RECENT ACTIVITY + NET WORTH */}

      <div className="grid gap-6 lg:grid-cols-2">



        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">


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
            {t("latestFinancialActivity")}
          </p>



          {report.recentTransactions.length > 0 ? (


            <div className="mt-6 space-y-4">


              {report.recentTransactions.map(
                (transaction) => (


                  <div

                    key={transaction.id}

                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0"

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


<p
className="
font-body
text-xs
tracking-tight
text-[var(--muted)]
"
>
                        {transaction.type}
                      </p>


                    </div>



                    <span
                      className={`font-semibold ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : transaction.type === "Expense"
                          ? "text-red-600"
                          : "text-indigo-600"
                      }`}
                    >

                      {transaction.type === "Income"
                        ? "+"
                        : "-"}

                      {formatMoney(
                        transaction.amount
                      )}

                    </span>


                  </div>


                )
              )}


            </div>


          ) : (


            <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-[var(--muted)]">

              {t("noFinancialActivity")}

            </div>


          )}



        </section>





        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">


<p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-white/60
"
>
{t("netWorth")}
</p>


<h2
className="
mt-3
font-display
text-5xl
font-medium
tracking-[-0.05em]
text-white
"
>
            {formatMoney(report.netWorth)}
          </h2>


          <p className="mt-3 text-sm text-white/60">
            {t("netWorthDescription")}
          </p>



          <div className="mt-6 space-y-3">


            <div className="flex justify-between">

              <span className="text-white/60">
                {t("availableCash")}
              </span>


              <span className="font-semibold">
                {formatMoney(report.availableCash)}
              </span>


            </div>




            <div className="flex justify-between">

              <span className="text-white/60">
                Investments
              </span>


              <span className="font-semibold">
                {formatMoney(report.investment)}
              </span>


            </div>


          </div>


        </section>



      </div>





      {/* EMPTY STATE */}

      {report.totalTransactions === 0 &&
        report.investment === 0 && (

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

<h3
className="
font-display
text-2xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
            {t("reportWaitingForData")}
          </h3>


<p
className="
mx-auto
mt-3
max-w-xl
font-body
text-sm
tracking-tight
text-[var(--muted)]
"
>

            {t("addDataToBuildReport")}

          </p>


        </div>

      )}



    </div>

  );

}