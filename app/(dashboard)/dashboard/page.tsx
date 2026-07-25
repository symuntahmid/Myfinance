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

export default function Dashboard() {
  return (
    <>
      {/* Dashboard Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Welcome back! Here's your financial overview.
          </p>

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

      {/* Motivation Section */}

      <div className="space-y-6">

  <DailyJourneyCard />

  <LessonCard />

  <ProfileCard />

  <AchievementCard />

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

      <SummaryCards />

      {/* Analytics */}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <NetWorthChart />
        </div>

        <FinancialInsights />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <IncomeExpenseChart />

        <InvestmentPieChart />

      </div>

      {/* Transactions */}

      <TransactionTable />

    </>
  );
}