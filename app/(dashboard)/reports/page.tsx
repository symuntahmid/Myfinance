import {
  getMonthlyReport,
  getFinancialHealthScore,
} from "../../data/transactions";

import FinancialHealthCard from "../../components/reports/FinancialHealthCard";

export default function ReportsPage() {
  const report = getMonthlyReport();
  const score = getFinancialHealthScore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Monthly Report
        </h1>

        <p className="mt-2 text-slate-500">
          Your financial performance this month.
        </p>
      </div>

      {/* Financial Health */}
      <FinancialHealthCard score={score} />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            Income
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ${report.income.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            Expenses
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            ${report.expense.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            Savings
          </p>

          <h2 className="mt-2 text-3xl font-bold text-teal-600">
            ${report.savings.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            Savings Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {report.savingsRate.toFixed(1)}%
          </h2>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Portfolio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Portfolio
          </h3>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Total Investments
              </span>

              <span className="text-lg font-semibold">
                ${report.investment.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Top Category
              </span>

              <span className="font-semibold">
                {report.topInvestmentCategory}
              </span>
            </div>

          </div>

        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Activity
          </h3>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Transactions
              </span>

              <span className="font-semibold">
                {report.totalTransactions}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Largest Expense
              </span>

              <span className="font-semibold">
                {report.largestExpense
                  ? report.largestExpense.source
                  : "None"}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}