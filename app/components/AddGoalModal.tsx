"use client";

import { useState } from "react";

import { X, Calculator } from "lucide-react";

import { addGoal, Goal } from "@/app/data/goals";

type AddGoalModalProps = {
  open: boolean;
  onClose: () => void;
};

const goalCategories = [
  { label: "Travel", emoji: "✈️", color: "#06b6d4" },
  { label: "Emergency Fund", emoji: "🛟", color: "#14b8a6" },
  { label: "House", emoji: "🏠", color: "#3b82f6" },
  { label: "Car", emoji: "🚗", color: "#8b5cf6" },
  { label: "Education", emoji: "🎓", color: "#f59e0b" },
  { label: "Business", emoji: "💼", color: "#22c55e" },
  { label: "Retirement", emoji: "🌴", color: "#64748b" },
  { label: "Other", emoji: "🎯", color: "#ef4444" },
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

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.floor(Math.random() * 1_000_000);
}

export default function AddGoalModal({
  open,
  onClose,
}: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [category, setCategory] = useState("Other");

  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  // Calculator
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorTarget, setCalculatorTarget] = useState<
    "target" | "saved" | null
  >(null);
  const [expression, setExpression] = useState("");

  if (!open) return null;

  const parsedTarget = Number(targetAmount);
  const parsedSaved = Number(savedAmount || 0);

  const isTargetValid =
    targetAmount.trim() !== "" &&
    !Number.isNaN(parsedTarget) &&
    parsedTarget > 0;

  const isSavedValid = !Number.isNaN(parsedSaved) && parsedSaved >= 0;

  const isFormValid = title.trim() !== "" && isTargetValid && isSavedValid;

  const progressPercent = isTargetValid
    ? Math.min(100, Math.max(0, (parsedSaved / parsedTarget) * 100))
    : 0;

  function resetForm() {
    setTitle("");
    setEmoji("🎯");
    setCategory("Other");
    setTargetAmount("");
    setSavedAmount("0");
    setTargetDate("");
    setNotes("");
    closeCalculator();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function openCalculator(target: "target" | "saved") {
    setCalculatorTarget(target);
    setExpression("");
    setCalculatorOpen(true);
  }

  function closeCalculator() {
    setCalculatorOpen(false);
    setCalculatorTarget(null);
    setExpression("");
  }

  function handleCalcPress(key: string) {
    if (key === "C") {
      setExpression("");
      return;
    }

    if (key === "=") {
      const result = evaluateExpression(expression);

      if (result !== null) {
        if (calculatorTarget === "target") setTargetAmount(String(result));
        if (calculatorTarget === "saved") setSavedAmount(String(result));
      }

      closeCalculator();
      return;
    }

    const char = calcSymbolToOperator[key] ?? key;
    setExpression((prev) => prev + char);
  }

  function backspaceCalculator() {
    setExpression((prev) => prev.slice(0, -1));
  }

  function handleCreateGoal() {
    if (!isFormValid) return;

    const goal: Goal = {
      id: generateId(),
      title,
      targetAmount: parsedTarget,
      savedAmount: parsedSaved,
      targetDate,
      emoji,
      color:
        goalCategories.find((g) => g.label === category)?.color ??
        "#06b6d4",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    addGoal(goal);
    resetForm();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 text-3xl text-white">
                {emoji}
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Create Financial Goal
                </h2>

                <p className="mt-1 text-slate-500">
                  Turn your dreams into a measurable plan.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close"
              className="rounded-full p-2 transition hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_0.8fr]">
              {/* LEFT */}
              <div>
                <label
                  htmlFor="goal-title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Goal Name
                </label>

                <input
                  id="goal-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Japan Trip"
                  className="mb-6 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {goalCategories.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setCategory(item.label);
                        setEmoji(item.emoji);
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${
                        category === item.label
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-200 hover:border-cyan-300"
                      }`}
                    >
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="mt-2 font-semibold">{item.label}</div>
                    </button>
                  ))}
                </div>

                {/* Target Amount */}
                <label
                  htmlFor="goal-target"
                  className="mb-2 block text-sm font-semibold"
                >
                  Target Amount
                </label>

                <div className="relative mb-1">
                  <input
                    id="goal-target"
                    type="number"
                    min="0"
                    step="0.01"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="10000"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-14 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />

                  <button
                    type="button"
                    onClick={() => openCalculator("target")}
                    aria-label="Open calculator for target amount"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 hover:bg-slate-100"
                  >
                    <Calculator size={18} className="text-slate-500" />
                  </button>
                </div>

                {targetAmount.trim() !== "" && !isTargetValid && (
                  <p className="mb-4 text-sm text-red-500">
                    Enter an amount greater than 0.
                  </p>
                )}

                {/* Saved */}
                <label
                  htmlFor="goal-saved"
                  className="mb-2 mt-5 block text-sm font-semibold"
                >
                  Already Saved
                </label>

                <div className="relative mb-1">
                  <input
                    id="goal-saved"
                    type="number"
                    min="0"
                    step="0.01"
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-14 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />

                  <button
                    type="button"
                    onClick={() => openCalculator("saved")}
                    aria-label="Open calculator for saved amount"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 hover:bg-slate-100"
                  >
                    <Calculator size={18} className="text-slate-500" />
                  </button>
                </div>

                {!isSavedValid && (
                  <p className="mb-4 text-sm text-red-500">
                    Enter a value of 0 or more.
                  </p>
                )}

                {/* Target Date */}
                <label
                  htmlFor="goal-date"
                  className="mb-2 mt-5 block text-sm font-semibold"
                >
                  Target Date
                </label>

                <input
                  id="goal-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

                {/* Notes */}
                <label
                  htmlFor="goal-notes"
                  className="mb-2 mt-5 block text-sm font-semibold"
                >
                  Why is this goal important?
                </label>

                <textarea
                  id="goal-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="This reminds you why you're saving..."
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              {/* RIGHT PREVIEW */}
              <div className="h-fit rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-7 text-white shadow-xl">
                <p className="text-sm uppercase tracking-wider text-cyan-100">
                  Live Preview
                </p>

                <div className="mt-6 text-6xl">{emoji}</div>

                <h3 className="mt-4 text-2xl font-bold">
                  {title || "Your Goal"}
                </h3>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-cyan-100">Target</span>
                    <strong>
                      ${targetAmount ? Number(targetAmount).toLocaleString() : "0"}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-cyan-100">Saved</span>
                    <strong>
                      ${savedAmount ? Number(savedAmount).toLocaleString() : "0"}
                    </strong>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-4 px-8 pb-8">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateGoal}
                disabled={!isFormValid}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      {calculatorOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeCalculator}
        >
          <div
            className="w-80 rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {calculatorTarget === "saved"
                  ? "Calculator — Already Saved"
                  : "Calculator — Target Amount"}
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
              {expression ? formatForDisplay(expression) : "0"}
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
                className="rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:opacity-90"
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