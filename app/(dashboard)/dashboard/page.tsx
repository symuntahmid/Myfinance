"use client";

import { useState } from "react";
import NotificationBell from "@/app/components/NotificationBell";
import SummaryCards from "../../components/SummaryCards";
import FloatingActionButton from "../../components/FloatingActionButton";
import AddTransactionSheet from "../../components/AddTransactionSheet";
import TransactionForm from "../../components/TransactionForm";

import TransactionTable from "../../components/TransactionTable";
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

export default function Dashboard() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const [transactionType, setTransactionType] = useState<
    "Income" | "Expense" | "Investment"
  >("Income");

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
    {/* Notification Bell */}
    <NotificationBell />

    {/* Date */}
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

      {/* Main Content */}

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

        {/* Summary */}

        <FadeIn delay={0.4}>
          <SummaryCards />
        </FadeIn>

        {/* Analytics */}

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

        {/* Transactions */}

        <FadeIn delay={0.9}>
          <RecentTransactions />
        </FadeIn>
      </div>

      {/* Floating Button */}

      <FloatingActionButton
        onClick={() => setSheetOpen(true)}
      />

      {/* Bottom Sheet */}

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
          setTransactionType("Investment");
          setSheetOpen(false);

          setTimeout(() => {
            setFormOpen(true);
          }, 250);
        }}
      />

      {/* Transaction Form */}

      <TransactionForm
        open={formOpen}
        type={transactionType}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}