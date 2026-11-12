"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Zap, ClipboardPaste, Check } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";

import {
  parseMobileMoneySms,
  type SmsParseResult,
} from "@/app/data/mobileMoneySms";

import {
  quickExpenseCategories,
  quickSources,
  quickText,
  saveQuickTransaction,
  hasTransactionWithTrxId,
} from "@/app/data/quickAdd";

interface Props {
  open: boolean;
  onClose: () => void;
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

// Accept digits typed on a Bangla keyboard too.
function cleanAmountInput(value: string): string {
  const latin = value.replace(/[০-৯]/g, (digit) =>
    String(BANGLA_DIGITS.indexOf(digit))
  );

  const filtered = latin.replace(/[^0-9.]/g, "");
  const firstDot = filtered.indexOf(".");

  if (firstDot === -1) return filtered;

  return (
    filtered.slice(0, firstDot + 1) +
    filtered.slice(firstDot + 1).replace(/\./g, "")
  );
}

// The panel only exists while the sheet is open, so every time it opens
// it starts with empty fields.
export default function QuickAddSheet({ open, onClose }: Props) {
  if (!open || typeof document === "undefined") return null;

  return <QuickAddPanel onClose={onClose} />;
}

function QuickAddPanel({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const text = quickText[language];

  const [tab, setTab] = useState<"quick" | "sms">("quick");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState(quickSources[0].value);

  const [smsText, setSmsText] = useState("");
  const [parsed, setParsed] = useState<SmsParseResult | null>(null);
  const [smsCategory, setSmsCategory] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [cashFeeOnly, setCashFeeOnly] = useState(false);
  const [clipboardFailed, setClipboardFailed] = useState(false);

  const [savedAmount, setSavedAmount] = useState<string | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const focusTimer = setTimeout(
      () => amountRef.current?.focus(),
      150
    );

    return () => {
      clearTimeout(focusTimer);

      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const amountValue = Number(amount);
  const canSaveQuick = amountValue > 0;

  function finish(savedValue: number) {
    setSavedAmount(formatCurrency(savedValue));

    closeTimer.current = setTimeout(() => {
      onClose();
    }, 900);
  }

  function saveQuick() {
    if (!canSaveQuick) return;

    const transaction = saveQuickTransaction({
      type: "Expense",
      amount: amountValue,
      category: category || "📦 Others",
      source,
    });

    finish(transaction.amount);
  }

  function readMessage(message: string) {
    const result = parseMobileMoneySms(message);

    setParsed(result);
    setCashFeeOnly(false);

    if (result.ok) {
      setSmsCategory(result.data.category);
      setDuplicate(hasTransactionWithTrxId(result.data.trxId));
    } else {
      setDuplicate(false);
    }
  }

  async function pasteFromClipboard() {
    setClipboardFailed(false);

    try {
      const clip = await navigator.clipboard.readText();

      setSmsText(clip);
      readMessage(clip);
    } catch {
      setClipboardFailed(true);
    }
  }

  function saveParsed() {
    if (!parsed || !parsed.ok || duplicate) return;

    const data = parsed.data;
    const feeOnly = !!data.cashOut && cashFeeOnly;

    const transaction = saveQuickTransaction({
      type: data.type,
      amount: feeOnly ? data.cashOut!.fee : data.amount,
      category: smsCategory || data.category,
      source: data.source,
      date: data.date,
      note: feeOnly
        ? `${data.note} (fee only)`
        : data.note,
    });

    finish(transaction.amount);
  }

  function failureMessage(): string | null {
    if (!parsed || parsed.ok) return null;

    switch (parsed.reason) {
      case "empty":
        return text.errEmpty;
      case "no_amount":
        return text.errNoAmount;
      case "own_money_move":
        return text.errOwnMoney;
      default:
        return text.errUnknown;
    }
  }

  const chip = (selected: boolean) =>
    `rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
      selected
        ? "border-violet-600 bg-violet-600 text-white"
        : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-violet-400"
    }`;

  const parsedOk = parsed && parsed.ok ? parsed.data : null;

  const shownAmount =
    parsedOk?.cashOut && cashFeeOnly
      ? parsedOk.cashOut.fee
      : parsedOk?.amount ?? 0;

  return createPortal(
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-[990] bg-black/30 backdrop-blur-sm"
      />

      {/* Sheet */}

      <div
        className="
          fixed inset-x-0 bottom-0 z-[1000]
          mx-auto max-h-[92vh] max-w-xl overflow-y-auto
          rounded-t-[34px]
          bg-[var(--card)] text-[var(--foreground)]
          shadow-[0_-30px_80px_rgba(0,0,0,.18)]
        "
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-14 rounded-full bg-slate-300" />
        </div>

        {/* Header */}

        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
              <Zap size={22} />
            </div>

            <h2 className="text-2xl font-bold">{text.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={text.close}
            className="rounded-full p-2 transition hover:bg-black/5"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}

        <div className="mx-6 mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-[var(--background)] p-1">
          <button
            type="button"
            onClick={() => setTab("quick")}
            className={`rounded-xl py-2.5 text-sm font-bold transition ${
              tab === "quick"
                ? "bg-[var(--card)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            {text.tabQuick}
          </button>

          <button
            type="button"
            onClick={() => setTab("sms")}
            className={`rounded-xl py-2.5 text-sm font-bold transition ${
              tab === "sms"
                ? "bg-[var(--card)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            {text.tabSms}
          </button>
        </div>

        {/* Saved message */}

        {savedAmount ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={34} strokeWidth={3} />
            </div>

            <p className="text-lg font-bold">
              {text.saved} · {savedAmount}
            </p>
          </div>
        ) : tab === "quick" ? (
          <div className="px-6 pb-8 pt-6">
            <label className="text-sm font-semibold text-[var(--muted)]">
              {text.amountLabel}
            </label>

            <input
              ref={amountRef}
              value={amount}
              onChange={(event) =>
                setAmount(cleanAmountInput(event.target.value))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") saveQuick();
              }}
              inputMode="decimal"
              placeholder="0"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-3xl font-bold outline-none focus:border-violet-500"
            />

            <p className="mt-5 text-sm font-semibold text-[var(--muted)]">
              {text.categoryLabel}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {quickExpenseCategories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={chip(category === item.value)}
                >
                  {item.emoji} {item[language]}
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm font-semibold text-[var(--muted)]">
              {text.sourceLabel}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {quickSources.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSource(item.value)}
                  className={chip(source === item.value)}
                >
                  {item[language]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={saveQuick}
              disabled={!canSaveQuick}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-4 text-base font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {text.save}
            </button>
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6">
            <p className="text-sm text-[var(--muted)]">
              {text.smsHint}
            </p>

            <textarea
              value={smsText}
              onChange={(event) => {
                setSmsText(event.target.value);
                setParsed(null);
                setDuplicate(false);
              }}
              rows={4}
              placeholder={text.smsPlaceholder}
              className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-violet-500"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={pasteFromClipboard}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] py-3 text-sm font-bold transition hover:border-violet-400"
              >
                <ClipboardPaste size={16} />
                {text.pasteButton}
              </button>

              <button
                type="button"
                onClick={() => readMessage(smsText)}
                className="rounded-2xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                {text.readButton}
              </button>
            </div>

            {clipboardFailed && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                {text.clipboardFail}
              </p>
            )}

            <p className="mt-2 text-xs text-[var(--muted)]">
              🔒 {text.privacy}
            </p>

            {failureMessage() && (
              <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
                {failureMessage()}
              </p>
            )}

            {parsedOk && (
              <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      parsedOk.type === "Income"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-red-500/15 text-red-600"
                    }`}
                  >
                    {parsedOk.type === "Income"
                      ? text.income
                      : text.expense}
                  </span>

                  <span className="text-2xl font-bold">
                    {formatCurrency(shownAmount)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[var(--muted)]">
                  {text.dateLabel}: {parsedOk.date} ·{" "}
                  {text.sourceShort}: {parsedOk.source}
                </p>

                {parsedOk.cashOut && parsedOk.cashOut.fee > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCashFeeOnly(false)}
                        className={chip(!cashFeeOnly)}
                      >
                        {text.cashFull}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCashFeeOnly(true)}
                        className={chip(cashFeeOnly)}
                      >
                        {text.cashFeeOnly}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {text.cashHint}
                    </p>
                  </div>
                )}

                {parsedOk.type === "Expense" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickExpenseCategories.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSmsCategory(item.value)}
                        className={chip(smsCategory === item.value)}
                      >
                        {item.emoji} {item[language]}
                      </button>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs text-[var(--muted)]">
                  {parsedOk.note}
                </p>

                {duplicate && (
                  <p className="mt-3 rounded-2xl bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600">
                    {text.duplicate}
                  </p>
                )}

                <button
                  type="button"
                  onClick={saveParsed}
                  disabled={duplicate}
                  className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3.5 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {text.saveThis}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
