"use client";

import { useState, useEffect } from "react";

import NotificationBell from "@/app/components/NotificationBell";
import HomeHero from "@/app/components/HomeHero";
import MonthStats from "@/app/components/MonthStats";
import MoneyMap from "@/app/components/MoneyMap";
import FloatingActionButton from "../../components/FloatingActionButton";
import AddTransactionSheet from "../../components/AddTransactionSheet";
import TransactionForm from "../../components/TransactionForm";
import AddInvestmentModal from "../../components/AddInvestmentModal";
import QuickAddSheet from "@/app/components/QuickAddSheet";

import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import InvestmentPieChart from "../../components/InvestmentPieChart";

import DailyJourneyCard from "../../components/DailyJourneyCard";
import ProfileCard from "../../components/ProfileCard";
import TodayCoachCard from "@/app/components/TodayCoachCard";

import WelcomeBanner from "../../components/WelcomeBanner";

import RecentTransactions from "../../components/RecentTransactions";
import GoalProgressCard from "../../components/GoalProgressCard";

import { getPortfolioSummary } from "@/app/data/investments";

import { useLanguage } from "@/app/context/LanguageContext";
import AIInsightCard from "@/app/components/ai/AIInsightCard";
import { formatCurrency } from "@/app/utils/currency";

export default function Dashboard() {
  const { language } = useLanguage();

  const [sheetOpen, setSheetOpen] = useState(false);

  const [quickOpen, setQuickOpen] = useState(false);

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

      <div className="mb-4 flex items-center justify-between gap-3">
        <WelcomeBanner />

        <div className="flex shrink-0 items-center gap-3">
          <NotificationBell />

          <p className="hidden text-right text-sm leading-5 text-[var(--muted)] sm:block">
            {new Date().toLocaleDateString(
              language === "bn" ? "bn-BD" : "en-GB",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </p>
        </div>
      </div>

      {/* Main */}

<div className="space-y-4">

  <HomeHero onQuickAdd={() => setQuickOpen(true)} />

  <TodayCoachCard onQuickAdd={() => setQuickOpen(true)} />

  <MonthStats />

  <MoneyMap />

  {/* Daily journey and level */}

  <div className="grid gap-6 lg:grid-cols-2">
    <DailyJourneyCard />

    <ProfileCard compact />
  </div>

  {/* Goal Progress */}

  <GoalProgressCard />

  <AIInsightCard />

        {portfolio.totalAssets > 0 && (
          <div>
            <div
className="
rounded-3xl
bg-[var(--card)]
p-6
shadow-sm
border
border-[var(--border)]
"
>

<div
className="
mb-5
flex
items-center
justify-between
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
Investment Portfolio
</h2>



<span
className="
font-body
rounded-full
bg-[var(--primary)]/15
px-4
py-2
text-xs
font-medium
uppercase
tracking-[0.08em]
text-[var(--primary)]
"
>
{portfolio.totalAssets} Assets
</span>


</div>

              <div className="grid gap-5 md:grid-cols-4">
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
Invested
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
{formatCurrency(portfolio.invested)}
</h3>
                </div>

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
                    Current Value
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
{formatCurrency(portfolio.current)}
</h3>

</div>


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
Profit
</p>
<h3
className={`
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]

${
portfolio.profit >= 0
? "text-emerald-500"
: "text-red-500"
}
`}
>
                    {portfolio.profit >= 0 ? "+" : "-"}

{formatCurrency(
  Math.abs(portfolio.profit)
)}
                  </h3>
                </div>

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
                    Return
                  </p>

<h3
className={`
mt-3
font-display
text-3xl
font-medium
tracking-[-0.04em]

${
portfolio.returnPercentage >= 0
? "text-cyan-500"
: "text-red-500"
}
`}
>
                    {portfolio.returnPercentage.toFixed(
                      2
                    )}
                    %
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <NetWorthChart />
          </div>

          <div className="min-w-0">
            <FinancialInsights />
          </div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <IncomeExpenseChart />
          </div>

          <div className="min-w-0">
            <InvestmentPieChart />
          </div>
        </div>

        <div>
          <RecentTransactions />
        </div>
      </div>

      <FloatingActionButton
        onClick={() => setSheetOpen(true)}
      />

      <AddTransactionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onQuick={() => {
          setSheetOpen(false);

          setTimeout(() => {
            setQuickOpen(true);
          }, 250);
        }}
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

      <QuickAddSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
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