"use client";
import { addInvestment } from "@/app/data/investments";
import { useMemo, useState, useEffect } from "react";
import {
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Repeat,
  Bell,
  Calculator,
} from "lucide-react";

import {
  addTransaction,
  updateTransaction,
  Transaction,
} from "@/app/data/transactions";

import { formatCurrency } from "@/app/utils/currency";

type TransactionFormProps = {
  open: boolean;
  type: "Income" | "Expense" | "Investment";
  onClose: () => void;

  editingTransaction?: Transaction | null;
};

/* -------------------------------- */
/* Category Lists                   */
/* -------------------------------- */

const incomeCategories = [
  "💼 Salary",
  "💻 Freelancing",
  "🏢 Business",
  "💰 Pocket Money",
  "🎁 Gift",
  "🏆 Bonus",
  "🏦 Interest",
  "↩️ Refund",
  "🏠 Rental Income",
  "📈 Dividend",
  "📦 Others",
];

const expenseCategories = [
  "🛒 Supermarket",
  "🍔 Food",
  "👕 Clothing",
  "🚌 Transport",
  "🏠 House",
  "🎮 Entertainment",
  "💡 Bills",
  "✈️ Travel",
  "📚 Education",
  "🏥 Health",
  "📦 Others",
];

const investmentCategories = [
  "🏦 Bank",
  "📈 Stocks",
  "📜 Bonds",
  "₿ Crypto",
  "📊 ETF",
  "🥇 Gold",
  "💹 Mutual Fund",
  "🏘️ Real Estate",
  "📦 Others",
];

/* -------------------------------- */
/* Source Lists                     */
/* -------------------------------- */

const sourceOptions = [
  "💵 Cash",
  "🏦 Bank",
  "📱 Mobile Banking",
  "💳 Card",
  "✍️ Other",
];

/* -------------------------------- */
/* Repeat / Reminder Options        */
/* -------------------------------- */

const repeatFrequencyOptions: { value: string; label: string }[] = [
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
  { value: "yearly", label: "Every year" },
];

const reminderTypeOptions: { value: string; label: string }[] = [
  { value: "due", label: "On due date" },
  { value: "1day", label: "1 day before" },
  { value: "3days", label: "3 days before" },
  { value: "custom", label: "Custom date" },
];

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

/* -------------------------------- */
/* Calculator                       */
/* -------------------------------- */

const calcButtons = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "C", "0", ".", "+",
];

const calcSymbolToOperator: Record<string, string> = {
  "÷": "/",
  "×": "*",
  "−": "-",
  "+": "+",
};

function formatForDisplay(expr: string) {
  return expr
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}

function evaluateExpression(expr: string): number | null {
  if (!expr) return null;
  if (!/^[0-9+\-*/.() ]*$/.test(expr)) return null;

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr});`)();
    if (typeof result !== "number" || !Number.isFinite(result)) return null;
    return Math.round(result * 100) / 100;
  } catch {
    return null;
  }
}

// Date.now() alone can collide when two transactions are created in the
// same millisecond (e.g. an investment plus its linked deduction expense).
function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}

export default function TransactionForm({
  open,
  type,
  onClose,
  editingTransaction,
}: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");

  const [customSource, setCustomSource] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [note, setNote] = useState("");

  const [autoRepeat, setAutoRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<
    "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  >("monthly");

  const [reminder, setReminder] = useState(false);
  const [reminderType, setReminderType] = useState<
    "due" | "1day" | "3days" | "1week" | "custom"
  >("due");
  const [reminderDate, setReminderDate] = useState("");

  // Investment Funding (only relevant when type === "Investment")
  const [deductFromBalance, setDeductFromBalance] = useState(false);
  const [investmentFunding, setInvestmentFunding] = useState<
    "cash" | "bank" | "card"
  >("cash");

  const [showMore, setShowMore] = useState(false);

  const [calcOpen, setCalcOpen] = useState(false);
  const [calcExpr, setCalcExpr] = useState("");

  useEffect(() => {
    if (!editingTransaction) return;

    setAmount(String(editingTransaction.amount));
    setSource(editingTransaction.source);
    setCategory(editingTransaction.category ?? "");
    setDate(editingTransaction.date);
    setNote(editingTransaction.note ?? "");

    setAutoRepeat(editingTransaction.autoRepeat ?? false);
    setRepeatFrequency(editingTransaction.repeatFrequency ?? "monthly");

    setReminder(editingTransaction.reminder ?? false);
    setReminderType(editingTransaction.reminderType ?? "due");
    setReminderDate(editingTransaction.reminderDate ?? "");
  }, [editingTransaction]);

  const categories = useMemo(() => {
    if (type === "Income") return incomeCategories;
    if (type === "Expense") return expenseCategories;
    return investmentCategories;
  }, [type]);

  if (!open) return null;

  const parsedAmount = Number(amount);
  const isAmountValid =
    amount.trim() !== "" &&
    !Number.isNaN(parsedAmount) &&
    parsedAmount > 0;

  const isReminderValid =
    !reminder || reminderType !== "custom" || reminderDate.trim() !== "";

  const isFormValid =
    isAmountValid && category.trim() !== "" && isReminderValid;

  const resolvedSource = source === "✍️ Other" ? customSource : source;

  const repeatFrequencyLabel =
    repeatFrequencyOptions.find((o) => o.value === repeatFrequency)?.label ??
    "Every month";

  const reminderTypeLabel =
    reminderTypeOptions.find((o) => o.value === reminderType)?.label ??
    "On due date";

  // Investment Funding only applies when creating a brand-new Investment
  // transaction. Showing it in edit mode would risk creating a duplicate
  // deduction expense every time the transaction is re-saved.
  const showInvestmentFunding = type === "Investment" && !editingTransaction;

  function resetForm() {
    if (editingTransaction) return;
    setAmount("");
    setCategory("");
    setSource("");
    setCustomSource("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);

    setAutoRepeat(false);
    setRepeatFrequency("monthly");

    setReminder(false);
    setReminderType("due");
    setReminderDate("");

    setDeductFromBalance(false);
    setInvestmentFunding("cash");

    setShowMore(false);
    setCalcOpen(false);
    setCalcExpr("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

function saveTransaction() {
  if (!isFormValid) return;


  const transaction: Transaction = {
    id: editingTransaction
      ? editingTransaction.id
      : generateId(),

    type,
    amount: parsedAmount,
    source: resolvedSource,
    category,
    note,
    date,

    autoRepeat,
    repeatFrequency:
      autoRepeat
        ? repeatFrequency
        : undefined,

    reminder,
    reminderType:
      reminder
        ? reminderType
        : undefined,

    reminderDate:
      reminder && reminderType === "custom"
        ? reminderDate
        : undefined,
  };



  if (editingTransaction) {

    updateTransaction(transaction);


  } else {

    addTransaction(transaction);


    // Refresh Summary Cards
    window.dispatchEvent(
      new Event("transactionsUpdated")
    );



    // Save Investment Data
    if (type === "Investment") {


      addInvestment({

        id: crypto.randomUUID(),

        name: category,

        type:
          category.replace(/^.*?\s/, "") as any,

        investedAmount: parsedAmount,

        currentValue: parsedAmount,

        purchaseDate: date,

        notes: note,

      });



      window.dispatchEvent(
        new Event("investmentsUpdated")
      );

    }

  }



  resetForm();

  onClose();

}

  function handleCalcPress(key: string) {
    if (key === "C") {
      setCalcExpr("");
      return;
    }

    if (key === "=") {
      const result = evaluateExpression(calcExpr);
      if (result !== null) {
        setAmount(String(result));
      }
      setCalcExpr("");
      setCalcOpen(false);
      return;
    }

    const char = calcSymbolToOperator[key] ?? key;
    setCalcExpr((prev) => prev + char);
  }

  const accentGradient =
    type === "Income"
      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
      : type === "Expense"
      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-5">
        <div className="
flex
max-h-[90vh]
w-full
max-w-sm
flex-col
overflow-hidden
rounded-3xl
bg-[var(--card)]
shadow-2xl
">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="
text-xl
font-bold
text-[var(--foreground)]
">
              {editingTransaction ? "Edit Transaction" : `Add ${type}`}
            </h2>

            <button
              onClick={handleClose}
              aria-label="Close"
             className="
rounded-full
p-1.5
text-[var(--muted)]
transition
hover:bg-[var(--background)]
"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            {/* Amount + Category */}
            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div className="relative">
                <label
                  htmlFor="tx-amount"
                  className="mb-1.5 block text-xs font-semibold text-slate-500"
                >
                  Amount
                </label>

                <div className="relative">
                  <input
                    id="tx-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={() => setCalcOpen((v) => !v)}
                    aria-label="Open calculator"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition ${
                      calcOpen
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }`}
                  >
                    <Calculator size={16} />
                  </button>
                </div>

                {/* Calculator Popup */}
                {calcOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[1102]"
                      onClick={() => setCalcOpen(false)}
                    />

                    <div className="
absolute
left-0
top-full
z-[1103]
mt-2
w-56
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
p-3
shadow-xl
">
                      <div className="mb-2 min-h-[2.25rem] rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-right text-sm text-slate-700">
                        {calcExpr ? formatForDisplay(calcExpr) : "0"}
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {calcButtons.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleCalcPress(key)}
                            className={`rounded-lg py-2 text-sm font-semibold transition ${
                              key === "C"
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : ["÷", "×", "−", "+"].includes(key)
                                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {key}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleCalcPress("=")}
                          className="col-span-4 mt-1 rounded-lg bg-indigo-500 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
                        >
                          =
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="tx-category"
                  className="mb-1.5 block text-xs font-semibold text-slate-500"
                >
                  Category
                </label>

                <div className="relative">
                  <select
                    id="tx-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full appearance-none rounded-xl border px-3 py-3 pr-8 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                      category
                        ? "border-[var(--border)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-slate-400"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Category
                    </option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {amount.trim() !== "" && !isAmountValid && (
              <p className="-mt-3 text-xs text-red-500">
                Enter an amount greater than 0.
              </p>
            )}

            {/* Date */}
            <div>
              <label
                htmlFor="tx-date"
                className="mb-1.5 block text-xs font-semibold text-slate-500"
              >
                Date
              </label>

              <div className="relative">
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-3 py-3 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />

                <Calendar
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Source */}
            <div>
              <label
                htmlFor="tx-source"
                className="mb-1.5 block text-xs font-semibold text-slate-500"
              >
                Source
              </label>

              <div className="relative">
                <select
                  id="tx-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={`w-full appearance-none rounded-xl border px-3 py-3 pr-8 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                    source
                      ? "border-[var(--border)] text-[var(--foreground)]"
                      : "border-[var(--border)] text-slate-400"
                  }`}
                >
                  <option value="" disabled hidden>
                    Select Source
                  </option>

                  {sourceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {source === "✍️ Other" && (
                <input
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder="Type a source..."
                  className="mt-2 w-full rounded-xl border border-[var(--border)] px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              )}
            </div>

            {/* Investment Funding */}
            {showInvestmentFunding && (
              <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      Investment Funding
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose where this investment money comes from.
                    </p>
                  </div>

                  <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-700">
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
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {investmentFundingOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setInvestmentFunding(opt.value)}
                        className={`rounded-xl border p-3 text-left text-sm transition ${
                          investmentFunding === opt.value
                            ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                            : "border-[var(--border)] bg-[var(--background)] text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-sm font-medium text-emerald-700">
                      ➕ External Funding
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      This investment won&apos;t reduce your available
                      balance.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* More Options */}
            <div className="rounded-2xl border border-[var(--border)] bg-slate-50">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-[var(--foreground)]"
                aria-expanded={showMore}
              >
                <span>More Options</span>

                {showMore ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {showMore && (
                <div className="space-y-4 border-t border-[var(--border)] p-4">
                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="tx-note"
                      className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                    >
                      <StickyNote size={14} />
                      Notes
                    </label>

                    <textarea
                      id="tx-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Write a note..."
                      className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  {/* Auto Repeat */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Repeat size={14} className="text-slate-500" />
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            Auto Repeat
                          </p>
                          <p className="text-xs text-slate-500">
                            {repeatFrequencyLabel}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoRepeat}
                        onClick={() => setAutoRepeat(!autoRepeat)}
                        className={`relative h-6 w-11 rounded-full transition ${
                          autoRepeat ? "bg-green-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-[var(--background)] transition ${
                            autoRepeat ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {autoRepeat && (
                      <div className="relative mt-2">
                        <select
                          value={repeatFrequency}
                          onChange={(e) =>
                            setRepeatFrequency(
                              e.target.value as
                                | "daily"
                                | "weekly"
                                | "biweekly"
                                | "monthly"
                                | "yearly"
                            )
                          }
                          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 pr-8 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        >
                          {repeatFrequencyOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Reminder */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className="text-slate-500" />
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            Reminder
                          </p>
                          <p className="text-xs text-slate-500">
                            {reminderTypeLabel}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={reminder}
                        onClick={() => setReminder(!reminder)}
                        className={`relative h-6 w-11 rounded-full transition ${
                          reminder ? "bg-indigo-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-[var(--background)] transition ${
                            reminder ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {reminder && (
                      <div className="mt-2 space-y-2">
                        <div className="relative">
                          <select
                            value={reminderType}
                            onChange={(e) =>
                              setReminderType(
                                e.target.value as
                                  | "due"
                                  | "1day"
                                  | "3days"
                                  | "1week"
                                  | "custom"
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 pr-8 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          >
                            {reminderTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>

                        {reminderType === "custom" && (
                          <input
                            type="date"
                            value={reminderDate}
                            onChange={(e) =>
                              setReminderDate(e.target.value)
                            }
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                          />
                        )}

                        {reminderType === "custom" &&
                          reminderDate.trim() === "" && (
                            <p className="text-xs text-red-500">
                              Pick a reminder date.
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={saveTransaction}
              disabled={!isFormValid}
              className={`w-full rounded-full py-3.5 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${accentGradient}`}
            >
              {editingTransaction ? "Update Transaction" : "Save Transaction"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}