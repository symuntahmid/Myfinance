"use client";

import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import PortfolioGrowthChart from "@/app/components/PortfolioGrowthChart";
import PortfolioAllocationChart from "@/app/components/PortfolioAllocationChart";
import AIInvestmentInsights from "@/app/components/AIInvestmentInsights";

import AddInvestmentModal from "@/app/components/AddInvestmentModal";
import EditInvestmentModal from "@/app/components/EditInvestmentModal";

import { formatCurrency } from "@/app/utils/currency";

import {
  getInvestments,
  getPortfolioSummary,
  clearInvestments,
  deleteInvestment,
  Investment,
} from "@/app/data/investments";

import { t } from "@/app/data/i18n";


export default function InvestmentsPage() {
  const [openModal, setOpenModal] =
    useState(false);

  const [editingInvestment, setEditingInvestment] =
    useState<Investment | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [summary, setSummary] =
    useState(() => {
      try {
        return getPortfolioSummary();
      } catch {
        return {
          invested: 0,
          current: 0,
          profit: 0,
          returnPercentage: 0,
        };
      }
    });

  const [, forceCurrencyUpdate] =
    useState(0);


  function refreshPortfolio() {
    try {
      setInvestments(
        getInvestments()
      );

      setSummary(
        getPortfolioSummary()
      );
    } catch (error) {
      console.error(
        "Investment loading error:",
        error
      );
    }
  }


  useEffect(() => {
    refreshPortfolio();

    const currencyListener = () => {
      forceCurrencyUpdate(
        value => value + 1
      );
    };

    window.addEventListener(
      "investmentsUpdated",
      refreshPortfolio
    );

    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );

    return () => {
      window.removeEventListener(
        "investmentsUpdated",
        refreshPortfolio
      );

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );
    };
  }, []);


  function handleDelete(id: string) {
    const confirmed =
      window.confirm(
        "Delete this investment?"
      );

    if (!confirmed) {
      return;
    }

    deleteInvestment(id);

    refreshPortfolio();

    window.dispatchEvent(
      new Event("investmentsUpdated")
    );
  }


  function handleDeleteAll() {
    const confirmed =
      window.confirm(
        "Delete all investments?\n\nThis action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    clearInvestments();

    refreshPortfolio();

    window.dispatchEvent(
      new Event("investmentsUpdated")
    );
  }


  return (
    <>
      {/* Header */}

      <div
        className="
        mb-10
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        "
      >
        <div>
          <h1
            className="
            font-display
            text-5xl
            font-medium
            tracking-[-0.05em]
            text-[var(--foreground)]
            "
          >
            {t("investments")}
          </h1>

          <p
            className="
            mt-3
            font-body
            text-sm
            leading-relaxed
            tracking-tight
            text-[var(--muted)]
            "
          >
            {t("investmentPortfolio")}
          </p>
        </div>


        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              setOpenModal(true)
            }
            className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-[var(--primary)]
            px-5
            py-3
            font-body
            font-medium
            text-white
            transition
            hover:opacity-90
            "
          >
            <Plus size={18} />

            {t("investment")}
          </button>


          {investments.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="
              rounded-2xl
              bg-red-600
              px-5
              py-3
              font-body
              font-medium
              text-white
              transition
              hover:bg-red-700
              "
            >
              Delete All
            </button>
          )}
        </div>
      </div>


      {/* Summary Cards */}

      <div
        className="
        grid
        gap-6
        md:grid-cols-4
        "
      >
        {/* Total Invested */}

        <div
          className="
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-sm
          "
        >
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
            {t("invested")}
          </p>

          <h2
            className="
            mt-3
            font-display
            text-4xl
            font-medium
            tracking-[-0.04em]
            text-[var(--foreground)]
            "
          >
            {formatCurrency(
              summary.invested
            )}
          </h2>
        </div>


        {/* Current Value */}

        <div
          className="
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-sm
          "
        >
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
            {t("currentValue")}
          </p>

          <h2
            className="
            mt-3
            font-display
            text-4xl
            font-medium
            tracking-[-0.04em]
            text-[var(--foreground)]
            "
          >
            {formatCurrency(
              summary.current
            )}
          </h2>
        </div>


        {/* Profit */}

        <div
          className="
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-sm
          "
        >
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
            {t("profit")}
          </p>

          <h2
            className={`
            mt-3
            font-display
            text-4xl
            font-medium
            tracking-[-0.04em]
            ${
              summary.profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }
            `}
          >
            {summary.profit >= 0
              ? "+"
              : ""}

            {formatCurrency(
              summary.profit
            )}
          </h2>
        </div>


        {/* Return */}

        <div
          className="
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-sm
          "
        >
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
            {t("return")}
          </p>

          <h2
            className="
            mt-3
            font-display
            text-4xl
            font-medium
            tracking-[-0.04em]
            text-cyan-600
            "
          >
            {summary.returnPercentage.toFixed(
              2
            )}
            %
          </h2>
        </div>
      </div>


      {/* Investment Table */}

      <div
        className="
        mt-8
        overflow-x-auto
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-8
        shadow-sm
        "
      >
        {investments.length === 0 ? (
          <div
            className="
            py-20
            text-center
            "
          >
            <h3
              className="
              font-display
              text-3xl
              font-medium
              tracking-[-0.04em]
              text-[var(--foreground)]
              "
            >
              {t("noInvestmentsYet")}
            </h3>

            <p
              className="
              mt-3
              font-body
              text-sm
              leading-relaxed
              tracking-tight
              text-[var(--muted)]
              "
            >
              {t("createFirstSavingsGoal")}
            </p>

            <button
              type="button"
              onClick={() =>
                setOpenModal(true)
              }
              className="
              mt-8
              rounded-2xl
              bg-[var(--primary)]
              px-6
              py-3
              font-body
              font-medium
              text-white
              transition
              hover:opacity-90
              "
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={18} />
                {t("investment")}
              </span>
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr
                className="
                border-b
                border-[var(--border)]
                "
              >
                <th
                  className="
                  py-4
                  text-left
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("investment")}
                </th>

                <th
                  className="
                  py-4
                  text-left
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("type")}
                </th>

                <th
                  className="
                  py-4
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("invested")}
                </th>

                <th
                  className="
                  py-4
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("currentValue")}
                </th>

                <th
                  className="
                  py-4
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("profit")}
                </th>

                <th
                  className="
                  py-4
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  {t("return")}
                </th>

                <th
                  className="
                  py-4
                  text-right
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {investments.map(
                investment => {
                  const profit =
                    investment.currentValue -
                    investment.investedAmount;

                  const percentage =
                    investment.investedAmount === 0
                      ? 0
                      : (
                          profit /
                          investment.investedAmount
                        ) * 100;

                  return (
                    <tr
                      key={investment.id}
                      className="
                      border-b
                      border-[var(--border)]
                      last:border-0
                      "
                    >
                      <td
                        className="
                        py-5
                        font-body
                        text-sm
                        font-medium
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {investment.name}
                      </td>

                      <td
                        className="
                        py-5
                        font-body
                        text-sm
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {investment.type}
                      </td>

                      <td
                        className="
                        py-5
                        text-right
                        font-body
                        text-sm
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {formatCurrency(
                          investment.investedAmount
                        )}
                      </td>

                      <td
                        className="
                        py-5
                        text-right
                        font-body
                        text-sm
                        tracking-tight
                        text-[var(--foreground)]
                        "
                      >
                        {formatCurrency(
                          investment.currentValue
                        )}
                      </td>

                      <td
                        className={`
                        py-5
                        text-right
                        font-display
                        text-lg
                        font-medium
                        tracking-[-0.02em]
                        ${
                          profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                        `}
                      >
                        {profit >= 0
                          ? "+"
                          : ""}

                        {formatCurrency(
                          profit
                        )}
                      </td>

                      <td
                        className={`
                        py-5
                        text-right
                        font-display
                        text-lg
                        font-medium
                        tracking-[-0.02em]
                        ${
                          percentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                        `}
                      >
                        {percentage.toFixed(
                          2
                        )}
                        %
                      </td>

                      <td className="py-5">
                        <div
                          className="
                          flex
                          justify-end
                          gap-2
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setEditingInvestment(
                                investment
                              )
                            }
                            aria-label="Edit investment"
                            className="
                            rounded-xl
                            border
                            border-[var(--border)]
                            p-2
                            transition
                            hover:bg-[var(--background)]
                            "
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                investment.id
                              )
                            }
                            aria-label="Delete investment"
                            className="
                            rounded-xl
                            border
                            border-red-200
                            p-2
                            text-red-600
                            transition
                            hover:bg-red-50
                            "
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>


      {/* Portfolio Growth */}

      <div className="mt-8">
        <PortfolioGrowthChart />
      </div>


      {/* Portfolio Allocation */}

      <div className="mt-8">
        <PortfolioAllocationChart />
      </div>


      {/* AI Investment Insights */}

      <div className="mt-8">
        <AIInvestmentInsights />
      </div>


      {/* Add Investment Modal */}

      <AddInvestmentModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
      />


      {/* Edit Investment Modal */}

      <EditInvestmentModal
        open={
          editingInvestment !== null
        }
        investment={
          editingInvestment
        }
        onClose={() => {
          setEditingInvestment(null);
          refreshPortfolio();
        }}
      />
    </>
  );
}