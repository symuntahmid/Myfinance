import {
  getMonthlyReport,
  getFinancialHealthScore,
} from "../../data/transactions";

import FinancialHealthCard from "../../components/reports/FinancialHealthCard";

export default function ReportsPage() {
  const report = getMonthlyReport();
  const score = getFinancialHealthScore();

  const money = (value: number) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Financial Overview
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Monthly Report
        </h1>

        <p className="mt-2 text-slate-500">
          A clear view of your money activity this month.
        </p>
      </div>

      {/* Financial Health */}
      <FinancialHealthCard score={score} />

      {/* Monthly Overview */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Monthly Overview
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Income */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Income
            </p>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {money(report.income)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Money received this month
            </p>
          </div>

          {/* Expenses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Expenses
            </p>

            <p className="mt-3 text-3xl font-bold text-red-600">
              {money(report.expense)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Money spent this month
            </p>
          </div>

          {/* Savings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Savings
            </p>

            <p className="mt-3 text-3xl font-bold text-teal-600">
              {money(report.savings)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Remaining after monthly activity
            </p>
          </div>

          {/* Savings Rate */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Savings Rate
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {report.savingsRate.toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Savings compared with income
            </p>
          </div>

        </div>
      </section>

      {/* Cash Flow */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Cash Flow
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Where your money moved this month.
          </p>
        </div>

        <div className="mt-6 divide-y divide-slate-100">

          <div className="flex items-center justify-between py-4">
            <span className="text-slate-600">
              Income
            </span>

            <span className="font-semibold text-green-600">
              +{money(report.income)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-slate-600">
              Expenses
            </span>

            <span className="font-semibold text-red-600">
              -{money(report.expense)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-slate-600">
              Investments
            </span>

            <span className="font-semibold text-indigo-600">
              -{money(report.investmentSpent)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-slate-600">
              Transferred to goals
            </span>

            <span className="font-semibold text-orange-600">
              -{money(report.transferOut)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-slate-600">
              Returned to available cash
            </span>

            <span className="font-semibold text-emerald-600">
              +{money(report.transferIn)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-5">
            <span className="text-lg font-bold text-slate-900">
              Available Cash
            </span>

            <span
              className={`text-2xl font-bold ${
                report.availableCash >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {money(report.availableCash)}
            </span>
          </div>

        </div>

      </section>

      {/* Investment Performance */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Investment Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current investment portfolio.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Invested This Month
            </p>

            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {money(report.investmentSpent)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Current Portfolio Value
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {money(report.investment)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Portfolio Status
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {report.investment > 0
                ? "Active"
                : "No investments"}
            </p>
          </div>

        </div>

      </section>

      {/* Activity */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Activity
        </h2>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-5">

          <div>
            <p className="text-sm text-slate-500">
              Transactions this month
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {report.totalTransactions}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Financial activity
            </p>

            <p className="mt-1 font-semibold text-indigo-600">
              {report.totalTransactions === 0
                ? "No activity yet"
                : "Active"}
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}