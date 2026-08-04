"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import AddInvestmentModal from "@/app/components/AddInvestmentModal";

import {
  getInvestments,
  getPortfolioSummary,
  clearInvestments,
  Investment,
} from "@/app/data/investments";

export default function InvestmentsPage() {
  const [openModal, setOpenModal] = useState(false);

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState(getPortfolioSummary());

  // NEW
  const [editingInvestment, setEditingInvestment] =
    useState<Investment | null>(null);

  useEffect(() => {
    function refreshPortfolio() {
      setInvestments(getInvestments());
      setSummary(getPortfolioSummary());
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

  // NEW
  function handleDeleteAll() {
    const confirmed = window.confirm(
      "Delete all investments?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    clearInvestments();

    // Refresh UI immediately
    setInvestments(getInvestments());
    setSummary(getPortfolioSummary());
  }

  return (
    <>
      {/* Header */}

<div className="mb-10 flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">
      My Investments
    </h1>

    <p className="mt-2 text-[var(--muted)]">
      Manage all your investments in one place.
    </p>
  </div>

  <div className="flex items-center gap-3">
    <button
      onClick={() => setOpenModal(true)}
      className="flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
    >
      <Plus size={18} />
      Add Investment
    </button>

    {investments.length > 0 && (
      <button
        onClick={handleDeleteAll}
        className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Delete All
      </button>
    )}
  </div>
</div>

      {/* Portfolio Summary */}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Invested
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${summary.invested.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Current Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${summary.current.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Profit
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              summary.profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {summary.profit >= 0 ? "+" : ""}
            ${summary.profit.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Portfolio Return
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-600">
            {summary.returnPercentage.toFixed(2)}%
          </h2>
        </div>
      </div>

      {/* Investments */}

      <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        {investments.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold">
              No Investments Yet
            </h3>

            <p className="mt-3 text-slate-500">
              Start tracking your portfolio by adding your first investment.
            </p>

            <button
              onClick={() => setOpenModal(true)}
              className="mt-8 rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Add First Investment
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left">
                  Investment
                </th>

                <th className="py-4 text-left">
                  Type
                </th>

                <th className="py-4 text-right">
                  Invested
                </th>

                <th className="py-4 text-right">
                  Current
                </th>

                <th className="py-4 text-right">
                  Profit
                </th>

                <th className="py-4 text-right">
                  Return
                </th>
              </tr>
            </thead>

            <tbody>
              {investments.map((investment) => {
                const profit =
                  investment.currentValue -
                  investment.investedAmount;

                const percentage =
                  investment.investedAmount === 0
                    ? 0
                    : (profit /
                        investment.investedAmount) *
                      100;

                return (
                  <tr
                    key={investment.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5 font-semibold">
                      {investment.name}
                    </td>

                    <td>{investment.type}</td>

                    <td className="text-right">
                      $
                      {investment.investedAmount.toLocaleString()}
                    </td>

                    <td className="text-right">
                      $
                      {investment.currentValue.toLocaleString()}
                    </td>

                    <td
                      className={`text-right font-semibold ${
                        profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {profit >= 0 ? "+" : ""}
                      ${profit.toLocaleString()}
                    </td>

                    <td
                      className={`text-right font-semibold ${
                        percentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {percentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}

      <AddInvestmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}