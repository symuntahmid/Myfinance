"use client";
import {
  addInvestment,
  Investment,
  InvestmentType,
} from "@/app/data/investments";
import {
  addTransaction,
  Transaction,
} from "@/app/data/transactions";
import { useState } from "react";
import { Calculator, X } from "lucide-react";

import {
  formatCurrency,
} from "@/app/utils/currency";

type AddInvestmentModalProps = {
  open: boolean;
  onClose: () => void;
};

// Keep this list in sync with InvestmentType in @/app/data/investments.
// Deriving from the imported type (rather than redeclaring it) means a
// mismatch here becomes a compile error instead of a silent bug.
const investmentTypes: InvestmentType[] = [
  "Stocks",
  "Crypto",
  "Gold",
  "Real Estate",
  "Mutual Fund",
  "ETF",
  "Bonds",
  "Savings",
  "Fixed Deposit (FDR)",
  "Business",
  "Retirement",
  "Other",
];

const calcButtons = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "0", ".", "C", "+",
];

const calcSymbolToOperator: Record<string, string> = {
  "×": "*",
  "÷": "/",
  "−": "-",
};

function formatForDisplay(expr: string) {
  return expr
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}

function evaluateExpression(expression: string): number | null {
  if (!expression) return null;
  if (!/^[0-9+\-*/.() ]*$/.test(expression)) return null;

  try {
    const result = Function(
      `"use strict"; return (${expression});`
    )();

    if (typeof result === "number" && Number.isFinite(result)) {
      return Math.round(result * 100) / 100;
    }

    return null;
  } catch {
    return null;
  }
}

// Accepts values like "12,000" or "12000" and returns a clean number.
function parseAmount(value: string): number {
  return Number(value.replace(/,/g, "").trim());
}

// Date.now() alone can collide when two records are created in the same
// millisecond (e.g. an investment plus its linked deduction expense).
function generateId(): string {
  return (
    Date.now().toString() +
    Math.floor(Math.random() * 1_000_000).toString()
  );
}

/* -------------------------------- */
/* Investment Funding Options       */
/* -------------------------------- */

const investmentFundingOptions: {
  value: "cash" | "bank" | "card";
  label: string;
  source: string;
}[] = [
  { value: "cash", label: "💵 Available Cash", source: "💵 Cash" },
  { value: "bank", label: "🏦 Bank Account", source: "🏦 Bank" },
  { value: "card", label: "💳 Credit Card", source: "💳 Card" },
];

export default function AddInvestmentModal({
  open,
  onClose,
}: AddInvestmentModalProps) {
  // ===========================
  // State
  // ===========================

  const [name, setName] = useState("");
  const [type, setType] = useState<InvestmentType>("Stocks");

  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [investedAmount, setInvestedAmount] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [notes, setNotes] = useState("");

  // Investment Funding
  const [deductFromBalance, setDeductFromBalance] = useState(false);
  const [investmentFunding, setInvestmentFunding] = useState<
    "cash" | "bank" | "card"
  >("cash");

  // Calculator — shared between the two amount fields

  const [calcOpen, setCalcOpen] = useState(false);
  const [calcExpr, setCalcExpr] = useState("");
  const [calcTarget, setCalcTarget] = useState<
    "invested" | "current" | null
  >(null);

  // ===========================
  // Don't render when closed
  // ===========================

  if (!open) return null;

  const parsedInvested = parseAmount(investedAmount);
  const parsedCurrent = parseAmount(currentValue);

  const isInvestedValid =
    investedAmount.trim() !== "" &&
    !Number.isNaN(parsedInvested) &&
    parsedInvested > 0;

  const isCurrentValid =
    currentValue.trim() !== "" &&
    !Number.isNaN(parsedCurrent) &&
    parsedCurrent >= 0;

  const isFormValid =
    name.trim() !== "" && isInvestedValid && isCurrentValid;

  // ===========================
  // Calculator Helpers
  // ===========================

  function openCalculator(target: "invested" | "current") {
    setCalcTarget(target);
    setCalcExpr("");
    setCalcOpen(true);
  }

  function closeCalculator() {
    setCalcOpen(false);
    setCalcExpr("");
    setCalcTarget(null);
  }

  function handleCalcPress(key: string) {
    if (key === "C") {
      setCalcExpr("");
      return;
    }

    if (key === "=") {
      const result = evaluateExpression(calcExpr);

      if (result !== null) {
        if (calcTarget === "invested") setInvestedAmount(String(result));
        if (calcTarget === "current") setCurrentValue(String(result));
      }

      closeCalculator();
      return;
    }

    const char = calcSymbolToOperator[key] ?? key;
    setCalcExpr((prev) => prev + char);
  }

  function backspaceCalculator() {
    setCalcExpr((prev) => prev.slice(0, -1));
  }

  // ===========================
  // Form Helpers
  // ===========================

  function resetForm() {
    setName("");
    setType("Stocks");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setInvestedAmount("");
    setCurrentValue("");
    setNotes("");
    setDeductFromBalance(false);
    setInvestmentFunding("cash");
    closeCalculator();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function saveInvestment() {

  if (!isFormValid) return;


  const investment: Investment = {

    id:
      typeof crypto !== "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : generateId(),

    name,

    type,

    purchaseDate,

    investedAmount: parsedInvested,

    currentValue: parsedCurrent,

    notes,

  };



  // Save investment portfolio data
  addInvestment(investment);




  // Create investment transaction for reports
  const transaction: Transaction = {

    id:
      Date.now() +
      Math.floor(Math.random() * 100000),


    type: "Investment",


    source:
      deductFromBalance
        ? investmentFundingOptions.find(
            (option) =>
              option.value === investmentFunding
          )?.source ?? "💵 Cash"
        : "External Funding",


    category: "Investment",


    amount: parsedInvested,


    date: purchaseDate,


    note:
      `Investment: ${name}`,


    autoRepeat: false,


    reminder: false,

  };



// Always create Investment transaction for reports
addTransaction(transaction);



  resetForm();

  onClose();

}
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="
w-full
max-w-2xl
overflow-hidden
rounded-[32px]
bg-[var(--card)]
border
border-[var(--border)]
shadow-2xl
"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-[var(--border)] px-8 py-6">
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">Add Investment</h2>

              <p className="mt-1 text-[var(--muted)]">
                Track your portfolio professionally.
              </p>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close"
              className="rounded-full p-2 transition hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}

          <div className="max-h-[65vh] space-y-6 overflow-y-auto px-8 py-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}

              <div className="md:col-span-2">
                <label
                  htmlFor="inv-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Investment Name
                </label>

                <input
                  id="inv-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apple Inc., Bitcoin..."
                  className="w-full rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              {/* Type */}

              <div>
                <label
                  htmlFor="inv-type"
                  className="mb-2 block text-sm font-semibold"
                >
                  Investment Type
                </label>

                <select
                  id="inv-type"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as InvestmentType)
                  }
                  className="w-full rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                >
                  {investmentTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purchase Date */}

              <div>
                <label
                  htmlFor="inv-date"
                  className="mb-2 block text-sm font-semibold"
                >
                  Purchase Date
                </label>

                <input
                  id="inv-date"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              {/* Invested */}

              <div>
                <label
                  htmlFor="inv-invested"
                  className="mb-2 block text-sm font-semibold"
                >
                  Amount Invested
                </label>

                <div className="relative">
                  <input
                    id="inv-invested"
                    type="number"
                    min="0"
                    step="0.01"
                    value={investedAmount}
                    onChange={(e) => setInvestedAmount(e.target.value)}
                    placeholder="10000"
                    className="w-full rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 pr-14 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                  />

                  <button
                    type="button"
                    onClick={() => openCalculator("invested")}
                    aria-label="Open calculator for amount invested"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 transition hover:bg-slate-100"
                  >
                    <Calculator size={18} className="text-[var(--muted)]" />
                  </button>
                </div>

                {investedAmount.trim() !== "" && !isInvestedValid && (
                  <p className="mt-2 text-sm text-red-500">
                    Enter an amount greater than 0.
                  </p>
                )}
              </div>

              {/* Current */}

              <div>
                <label
                  htmlFor="inv-current"
                  className="mb-2 block text-sm font-semibold"
                >
                  Current Value
                </label>

                <div className="relative">
                  <input
                    id="inv-current"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="12500"
                    className="w-full rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 pr-14 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                  />

                  <button
                    type="button"
                    onClick={() => openCalculator("current")}
                    aria-label="Open calculator for current value"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 transition hover:bg-slate-100"
                  >
                    <Calculator size={18} className="text-[var(--muted)]" />
                  </button>
                </div>

                {currentValue.trim() !== "" && !isCurrentValid && (
                  <p className="mt-2 text-sm text-red-500">
                    Enter a value of 0 or more.
                  </p>
                )}
              </div>

              {/* Investment Funding */}

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 md:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Investment Funding</h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Where is this investment money coming from?
                    </p>
                  </div>

                  <label className="flex shrink-0 items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={deductFromBalance}
                      onChange={(e) =>
                        setDeductFromBalance(e.target.checked)
                      }
                      className="h-4 w-4 rounded accent-cyan-600"
                    />
                    Deduct from my balance
                  </label>
                </div>

                {deductFromBalance ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {investmentFundingOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setInvestmentFunding(option.value)}
                        className={`rounded-xl border p-3 text-left transition ${
                          investmentFunding === option.value
                            ? "border-cyan-500 bg-cyan-50"
                            : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="font-medium text-green-700">
                      ➕ External Funding
                    </p>

                    <p className="text-sm text-green-600">
                      This investment won&apos;t reduce your balance.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}

              <div className="md:col-span-2">
                <label
                  htmlFor="inv-notes"
                  className="mb-2 block text-sm font-semibold"
                >
                  Notes
                </label>

                <textarea
                  id="inv-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="w-full resize-none rounded-2xl border border-[var(--border)]
bg-[var(--background)]
text-[var(--foreground)] px-4 py-3 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="border-t border-slate-200 bg-slate-50 px-8 py-6">
            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold transition hover:bg-[var(--card)]
border border-[var(--border)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveInvestment}
                disabled={!isFormValid}
                className="flex-1 rounded-2xl bg-[var(--primary)] py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Investment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}

      {calcOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeCalculator}
        >
          <div
            className="w-80 rounded-3xl bg-[var(--card)]
border border-[var(--border)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {calcTarget === "current"
                  ? "Calculator — Current Value"
                  : "Calculator — Amount Invested"}
              </h3>

              <button
                onClick={closeCalculator}
                aria-label="Close calculator"
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-100 p-4 text-right text-3xl font-bold">
              {calcExpr ? formatForDisplay(calcExpr) : "0"}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {calcButtons.map((button) => (
                <button
                  key={button}
                  onClick={() => handleCalcPress(button)}
                  className={`rounded-2xl py-4 text-lg font-semibold transition ${
                    button === "C"
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : ["÷", "×", "−", "+"].includes(button)
                      ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {button}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={backspaceCalculator}
                className="rounded-2xl bg-slate-200 py-3 font-semibold hover:bg-slate-300"
              >
                ⌫ Backspace
              </button>

              <button
                onClick={() => handleCalcPress("=")}
                className="rounded-2xl bg-[var(--primary)] py-3 font-semibold text-white transition hover:opacity-90"
              >
                = Use Result
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}