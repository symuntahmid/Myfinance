import StatCard from "../../components/StatCard";
import QuickAction from "../../components/QuickAction";
import TransactionTable from "../../components/TransactionTable";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";

export default function Dashboard() {
  return (
    <>
  <div className="flex items-center justify-between mb-8">
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

  <h2 className="mb-5 text-2xl font-bold">
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

  <div className="grid grid-cols-2 gap-6 mt-10">
    <StatCard
      title="Net Worth"
      value="$0"
      icon={<Wallet className="w-6 h-6" />}
    />

    <StatCard
      title="Monthly Income"
      value="$0"
      icon={<TrendingUp className="w-6 h-6" />}
    />

    <StatCard
      title="Expenses"
      value="$0"
      icon={<TrendingDown className="w-6 h-6" />}
    />

    <StatCard
      title="Investments"
      value="$0"
      icon={<Landmark className="w-6 h-6" />}
    />
  </div>

  <TransactionTable />
</>
  );
}