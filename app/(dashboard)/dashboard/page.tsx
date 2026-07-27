import SummaryCards from "../../components/SummaryCards";
import QuickAction from "../../components/QuickAction";
import TransactionTable from "../../components/TransactionTable";
import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import InvestmentPieChart from "../../components/InvestmentPieChart";
import DailyJourneyCard from "../../components/DailyJourneyCard";
import ProfileCard from "../../components/ProfileCard";
import AchievementCard from "../../components/AchievementCard";
import LessonCard from "../../components/LessonCard";
import StatsGrid from "@/app/components/StatsGrid";
import LearningRoadmap from "@/app/components/LearningRoadmap";
import WelcomeBanner from "../../components/WelcomeBanner";

import FadeIn from "../../components/FadeIn";

export default function Dashboard() {
  return (
    <>
      {/* Dashboard Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>


          <h1 className="text-4xl font-bold">
  Dashboard
</h1>

<WelcomeBanner />

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-500">
            Today
          </p>

          <p className="font-semibold">
            {new Date().toLocaleDateString()}
          </p>

        </div>

      </div>

      <FadeIn delay={0}>
  <StatsGrid />
</FadeIn>

<div className="mt-6">
  <FadeIn delay={0.05}>
    <LearningRoadmap />
  </FadeIn>
</div>

      {/* Motivation Section */}

      <div className="space-y-6">

<FadeIn delay={0}>
  <StatsGrid />
</FadeIn>

<div className="mt-8">
  <FadeIn delay={0.1}>
    <LessonCard />
  </FadeIn>
</div>

<div className="mt-8">
  <FadeIn delay={0.2}>
    <LearningRoadmap />
  </FadeIn>
</div>

<div className="mt-8 grid gap-6 lg:grid-cols-2">

  <FadeIn delay={0.3}>
    <DailyJourneyCard />
  </FadeIn>

  <FadeIn delay={0.4}>
    <AchievementCard />
  </FadeIn>

</div>

      {/* Quick Actions */}

      <h2 className="mt-10 mb-5 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="grid grid-cols-3 gap-5">

        <QuickAction
          title="Add Income"
          href="/add-income"
        />

        <QuickAction
          title="Add Expense"
          href="/add-expense"
        />

        <QuickAction
          title="Add Investment"
          href="/add-investment"
        />

      </div>

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
  <TransactionTable />
</FadeIn>
      </div>

    </>
  );
}