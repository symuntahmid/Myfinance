"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { TYPE_GROUPS, TYPE_INFO } from "@/app/data/investLearn";
import {
  addInvestment,
  updateInvestment,
  type Investment,
  type InvestmentType,
} from "@/app/data/investments";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
} from "@/app/data/transactions";

type Mode = "total" | "monthly" | "units";
type Funding = "cash" | "bank" | "card";

const FUNDING: { value: Funding; label: string; source: string }[] = [
  { value: "cash", label: "💵", source: "💵 Cash" },
  { value: "bank", label: "🏦", source: "🏦 Bank" },
  { value: "card", label: "💳", source: "💳 Card" },
];

const FUNDING_NAME: Record<Funding, { en: string; bn: string }> = {
  cash: { en: "Cash", bn: "নগদ" },
  bank: { en: "Bank", bn: "ব্যাংক" },
  card: { en: "Card", bn: "কার্ড" },
};

const num = (value: string) => {
  const n = Number(value.replace(/,/g, "").trim());

  return Number.isFinite(n) && n > 0 ? n : 0;
};

const round = (value: number) => Math.round(value * 100) / 100;

const today = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// Made outside the component: ids and times are not "pure" render values.
const makeTxId = () => Date.now() + Math.floor(Math.random() * 100000);

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`;

function defaultMode(type: InvestmentType): Mode {
  if (type === "DPS" || type === "Retirement") return "monthly";
  if (["Stocks", "Mutual Fund", "ETF", "Gold", "Crypto"].includes(type)) return "units";

  return "total";
}

function Money({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{label}</span>

      <input
        inputMode="decimal"
        value={value}
        placeholder={hint}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base font-semibold outline-none placeholder:text-sm placeholder:font-normal focus:border-[var(--primary)]"
      />
    </label>
  );
}

type Props = {
  investment?: Investment | null; // given = edit, missing = add
  onClose: () => void;
};

export default function InvestmentSheet({ investment, onClose }: Props) {
  const { t, language } = useLanguage();

  const editing = Boolean(investment);

  const [type, setType] = useState<InvestmentType>(investment?.type ?? "Savings");
  const [name, setName] = useState(investment?.name ?? "");
  const [mode, setMode] = useState<Mode>(
    editing ? "total" : defaultMode(investment?.type ?? "Savings")
  );
  const [modeTouched, setModeTouched] = useState(editing);

  const [invested, setInvested] = useState(investment ? String(investment.investedAmount) : "");
  const [worth, setWorth] = useState(
    investment && investment.currentValue !== investment.investedAmount
      ? String(investment.currentValue)
      : ""
  );
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [qty, setQty] = useState("");
  const [buy, setBuy] = useState("");
  const [nowPrice, setNowPrice] = useState("");

  const [date, setDate] = useState(investment?.purchaseDate || today());
  const [isNew, setIsNew] = useState(!editing);
  const [funding, setFunding] = useState<Funding>("cash");
  const [notes, setNotes] = useState(investment?.notes ?? "");

  /* The two numbers everything else is worked out from. */

  const putIn =
    mode === "total"
      ? num(invested)
      : mode === "monthly"
      ? num(monthly) * num(months)
      : num(qty) * num(buy);

  const worthNow =
    mode === "units"
      ? num(qty) * (num(nowPrice) || num(buy))
      : num(worth) || putIn;

  const gain = round(worthNow - putIn);
  const gainPct = putIn > 0 ? (gain / putIn) * 100 : 0;

  const valid = name.trim() !== "" && putIn > 0;

  const linkedTx = investment?.txId
    ? getTransactions().find((x) => x.id === investment.txId)
    : undefined;

  const pickType = (next: InvestmentType) => {
    setType(next);

    if (!modeTouched) setMode(defaultMode(next));
  };

  const save = () => {
    if (!valid) return;

    const amount = round(putIn);
    const current = round(worthNow);
    const source = FUNDING.find((f) => f.value === funding)?.source ?? "💵 Cash";

    if (investment) {
      updateInvestment({
        ...investment,
        name: name.trim(),
        type,
        purchaseDate: date,
        investedAmount: amount,
        currentValue: current,
        notes,
      });

      if (linkedTx && linkedTx.amount !== amount) {
        updateTransaction({
          ...linkedTx,
          amount,
          note: `Investment: ${name.trim()}`,
        });
      }
    } else {
      const txId = isNew ? makeTxId() : undefined;

      addInvestment({
        id: makeId(),
        name: name.trim(),
        type,
        purchaseDate: date,
        investedAmount: amount,
        currentValue: current,
        notes,
        txId,
      });

      // Only money that really left your pocket is a purchase.
      if (txId !== undefined) {
        addTransaction({
          id: txId,
          type: "Investment",
          source,
          category: "Investment",
          amount,
          date,
          note: `Investment: ${name.trim()}`,
          autoRepeat: false,
          reminder: false,
        });
      }
    }

    onClose();
  };

  const modes: [Mode, string][] = [
    ["total", t("invModeTotal")],
    ["monthly", t("invModeMonthly")],
    ["units", t("invModeUnits")],
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[var(--card)] shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-center justify-between px-5 pb-2 pt-5">
          <h2 className="text-lg font-bold">
            {editing ? t("invEditTitle") : t("invAddTitle")}
          </h2>

          <button
            type="button"
            aria-label={t("invCancel")}
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto px-5 pb-4 pt-2">
          {/* 1. What is it */}

          <section>
            <p className="mb-2 text-sm font-semibold">{t("invWhat")}</p>

            <div className="space-y-3">
              {TYPE_GROUPS.map((group) => (
                <div key={group.key}>
                  <p className="mb-1.5 text-[11px] font-semibold text-[var(--muted)]">
                    {t(group.key)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {group.types.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={type === option}
                        onClick={() => pickType(option)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                          type === option
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)] bg-[var(--background)]"
                        }`}
                      >
                        <span>{TYPE_INFO[option].emoji}</span>
                        {TYPE_INFO[option][language]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 rounded-xl bg-[var(--background)] px-3 py-2 text-xs text-[var(--muted)]">
              {TYPE_INFO[type].hint[language]}
            </p>
          </section>

          {/* 2. Name */}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
              {t("invName")}
            </span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={TYPE_INFO[type].example}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base font-semibold outline-none placeholder:font-normal focus:border-[var(--primary)]"
            />
          </label>

          {/* 3. How much */}

          <section className="space-y-3">
            {!editing && (
              <>
                <p className="text-sm font-semibold">{t("invHow")}</p>

                <div className="grid grid-cols-3 gap-1 rounded-full bg-[var(--border)]/60 p-1">
                  {modes.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={mode === id}
                      onClick={() => {
                        setMode(id);
                        setModeTouched(true);
                      }}
                      className={`rounded-full py-2 text-xs font-bold ${
                        mode === id
                          ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mode === "total" && (
              <div className="grid grid-cols-2 gap-3">
                <Money label={t("invPutIn")} value={invested} onChange={setInvested} />
                <Money label={t("invWorth")} hint={t("invWorthHint")} value={worth} onChange={setWorth} />
              </div>
            )}

            {mode === "monthly" && (
              <div className="grid grid-cols-2 gap-3">
                <Money label={t("invMonthlyAmt")} value={monthly} onChange={setMonthly} />
                <Money label={t("invMonthsPaid")} value={months} onChange={setMonths} />

                <div className="col-span-2">
                  <Money label={t("invWorth")} hint={t("invWorthHint")} value={worth} onChange={setWorth} />
                </div>
              </div>
            )}

            {mode === "units" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Money label={t("invUnitsLabel")} value={qty} onChange={setQty} />
                </div>

                <Money label={t("invBuyPrice")} value={buy} onChange={setBuy} />
                <Money label={t("invNowPrice")} hint={t("invNowPriceHint")} value={nowPrice} onChange={setNowPrice} />
              </div>
            )}

            {/* Live answer */}

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--forest)] p-3 text-center text-[var(--on-forest)]">
              <div>
                <p className="text-[11px] opacity-70">{t("invSummaryIn")}</p>
                <p className="text-sm font-bold">{formatCurrency(Math.round(putIn))}</p>
              </div>

              <div>
                <p className="text-[11px] opacity-70">{t("invSummaryWorth")}</p>
                <p className="text-sm font-bold">{formatCurrency(Math.round(worthNow))}</p>
              </div>

              <div>
                <p className="text-[11px] opacity-70">{t("invSummaryGain")}</p>
                <p className={`text-sm font-bold ${gain >= 0 ? "text-[var(--gold)]" : "text-[var(--sun)]"}`}>
                  {gain >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(Math.round(gain)))}
                  {putIn > 0 && (
                    <span className="block text-[11px] font-semibold">
                      {Math.abs(Math.round(gainPct * 10) / 10).toLocaleString(
                        language === "bn" ? "bn-BD" : "en-US"
                      )}
                      %
                    </span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Date */}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
              {t("invStartDate")}
            </span>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base outline-none focus:border-[var(--primary)]"
            />
          </label>

          {/* 5. Does it touch my cash? */}

          {!editing && (
            <section className="space-y-3">
              <p className="text-sm font-semibold">{t("invNewPurchase")}</p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  [true, t("invYesNew")],
                  [false, t("invNoOwned")],
                ].map(([value, label]) => (
                  <button
                    key={String(value)}
                    type="button"
                    aria-pressed={isNew === value}
                    onClick={() => setIsNew(value as boolean)}
                    className={`rounded-2xl border px-3 py-2.5 text-sm font-semibold ${
                      isNew === value
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </div>

              {isNew && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--muted)]">{t("invPaidFrom")}</span>

                  {FUNDING.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      aria-pressed={funding === f.value}
                      onClick={() => setFunding(f.value)}
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                        funding === f.value
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {f.label} {FUNDING_NAME[f.value][language]}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-[var(--muted)]">
                {isNew
                  ? t("invCashWillDrop", { amount: formatCurrency(Math.round(putIn)) })
                  : t("invCashSame")}
              </p>
            </section>
          )}

          {editing && linkedTx && (
            <p className="text-xs text-[var(--muted)]">{t("invLinkedNote")}</p>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
              {t("invNote")}
            </span>

            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </label>
        </div>

        <footer className="border-t border-[var(--border)] px-5 py-3">
          <button
            type="button"
            disabled={!valid}
            onClick={save}
            className="w-full rounded-full bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            {editing ? t("invSaveChanges") : t("invSave")}
          </button>
        </footer>
      </div>
    </div>
  );
}
