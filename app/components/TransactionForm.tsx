"use client";

import { useMemo, useState } from "react";
import {
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Repeat,
  Bell,
  Receipt,
} from "lucide-react";

import {
  addTransaction,
  Transaction,
} from "@/app/data/transactions";

type Props = {
  open: boolean;
  type: "Income" | "Expense" | "Investment";
  onClose: () => void;
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

export default function TransactionForm({
  open,
  type,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [note, setNote] = useState("");
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [showMore, setShowMore] = useState(false);

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
  const isFormValid = isAmountValid && category.trim() !== "";

  const resolvedSource =
    source === "✍️ Other" ? customSource : source;

  function resetForm() {
    setAmount("");
    setCategory("");
    setSource("");
    setCustomSource("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
    setAutoRepeat(false);
    setReminder(false);
    setShowMore(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function saveTransaction() {
    if (!isFormValid) return;

    const transaction: Transaction = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Date.now(),
      type,
      amount: parsedAmount,
      source: resolvedSource,
      category,
      note,
      date,
      // Not all Transaction shapes declare these yet — cast keeps this
      // working today and lets you extend the Transaction type later
      // without another refactor here.
      autoRepeat,
      reminder,
    } as Transaction;

    addTransaction(transaction);

    resetForm();
    onClose();
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
        <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-slate-900">
              Add {type}
            </h2>

            <button
              onClick={handleClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            {/* Amount + Category */}
            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div>
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <Receipt
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
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
                        ? "border-slate-200 text-slate-800"
                        : "border-slate-200 text-slate-400"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
                      ? "border-slate-200 text-slate-800"
                      : "border-slate-200 text-slate-400"
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
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              )}
            </div>

            {/* More Options */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-800"
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
                <div className="space-y-4 border-t border-slate-200 p-4">
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
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  {/* Auto Repeat */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Auto Repeat
                      </p>
                      <p className="text-xs text-slate-500">
                        Repeat every month
                      </p>
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
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          autoRepeat ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reminder */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Reminder
                      </p>
                      <p className="text-xs text-slate-500">
                        Notify before due date
                      </p>
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
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          reminder ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
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
              Save {type}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}