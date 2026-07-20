import SummaryCards from "../../components/SummaryCards";
import QuickAction from "../../components/QuickAction";
import TransactionTable from "../../components/TransactionTable";
import { getSummary } from "../../data/transactions";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";

export default function Dashboard() {
  const summary = getSummary();
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

  <SummaryCards />

  <TransactionTable />
</>
  );
}