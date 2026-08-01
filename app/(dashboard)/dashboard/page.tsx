"use client";

import { useState, useEffect } from "react";

import NotificationBell from "@/app/components/NotificationBell";
import SummaryCards from "../../components/SummaryCards";
import FloatingActionButton from "../../components/FloatingActionButton";
import AddTransactionSheet from "../../components/AddTransactionSheet";
import TransactionForm from "../../components/TransactionForm";
import AddInvestmentModal from "../../components/AddInvestmentModal";

import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import InvestmentPieChart from "../../components/InvestmentPieChart";

import DailyJourneyCard from "../../components/DailyJourneyCard";
import ProfileCard from "../../components/ProfileCard";
import LessonCard from "../../components/LessonCard";
import WelcomeBanner from "../../components/WelcomeBanner";

import FadeIn from "../../components/FadeIn";
import RecentTransactions from "../../components/RecentTransactions";
import GoalProgressCard from "../../components/GoalProgressCard";

import { getPortfolioSummary } from "@/app/data/investments";

export default function Dashboard() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

  const [investmentModalOpen, setInvestmentModalOpen] =
    useState(false);

  const [transactionType, setTransactionType] = useState<
    "Income" | "Expense"
  >("Income");

  const [portfolio, setPortfolio] = useState(
    getPortfolioSummary()
  );

  useEffect(() => {
    function refreshPortfolio() {
      setPortfolio(getPortfolioSummary());
    }

    refreshPortfolio();

    window.addEventListener(
      "investmentsUpdated",
      refreshPortfolio
    );

    return () => {
      window.removeEventListener(
        "investmentsUpdated",
        refreshPortfolio
      );
    };
  }, []);

  return (
    <>
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <WelcomeBanner />
        </div>

        <div className="flex items-center gap-5">
          <NotificationBell />

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Today
            </p>

            <p className="font-semibold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main */}

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0}>
            <LessonCard />
          </FadeIn>

          <FadeIn delay={0.1}>
            <ProfileCard compact />
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
  <DailyJourneyCard />
</FadeIn>

<FadeIn delay={0.3}>
  <GoalProgressCard />
</FadeIn>

<FadeIn delay={0.4}>
  <SummaryCards />
</FadeIn>

        {portfolio.totalAssets > 0 && (
          <FadeIn delay={0.45}>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Investment Portfolio
                </h2>

                <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                  {portfolio.totalAssets} Assets
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Invested
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    $
                    {portfolio.invested.toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Current Value
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    $
                    {portfolio.current.toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Profit
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      portfolio.profit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {portfolio.profit >= 0 ? "+" : ""}
                    $
                    {portfolio.profit.toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      portfolio.returnPercentage >= 0
                        ? "text-cyan-600"
                        : "text-red-600"
                    }`}
                  >
                    {portfolio.returnPercentage.toFixed(
                      2
                    )}
                    %
                  </h3>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <FadeIn delay={0.5}>
            <div className="lg:col-span-2">
              <NetWorthChart />
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <FinancialInsights />
          </FadeIn>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.7}>
            <IncomeExpenseChart />
          </FadeIn>

          <FadeIn delay={0.8}>
            <InvestmentPieChart />
          </FadeIn>
        </div>

        <FadeIn delay={0.9}>
          <RecentTransactions />
        </FadeIn>
      </div>

      <FloatingActionButton
        onClick={() => setSheetOpen(true)}
      />

      <AddTransactionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onIncome={() => {
          setTransactionType("Income");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onExpense={() => {
          setTransactionType("Expense");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
        onInvestment={() => {
          setSheetOpen(false);

          setTimeout(() => {
            setInvestmentModalOpen(true);
          }, 250);
        }}
      />

      <TransactionForm
        open={formOpen}
        type={transactionType}
        onClose={() => setFormOpen(false)}
      />

      <AddInvestmentModal
        open={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
      />
    </>
  );
}