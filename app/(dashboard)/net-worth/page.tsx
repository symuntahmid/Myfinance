"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { getGoals } from "@/app/data/goals";
import { getPortfolioSummary } from "@/app/data/investments";
import {
  addDebt,
  computeNetWorth,
  deleteDebt,
  getDebts,
  previousSnapshot,
  recordSnapshot,
  updateDebtAmount,
  type Debt,
  type NetWorth,
} from "@/app/data/netWorth";

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function NetWorthPage() {
  const { t } = useLanguage();

  const [worth, setWorth] = useState<NetWorth | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [change, setChange] = useState<number | null>(null);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💸");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();

      const accounts = getAccounts().reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      const goals = getGoals().reduce(
        (sum, item) => sum + (Number(item.savedAmount) || 0),
        0
      );

      const list = getDebts();

      const result = computeNetWorth({
        accounts,
        goals,
        investments: getPortfolioSummary().current,
        debts: list,
      });

      const month = currentMonth();

      recordSnapshot(month, result.netWorth);

      const before = previousSnapshot(month);

      setDebts(list);
      setWorth(result);
      setChange(before ? result.netWorth - before.value : null);
    };

    refresh();

    const events = [
      "debtsUpdated",
      "accountsUpdated",
      "transactionsUpdated",
      "goalsUpdated",
      "languageUpdated",
      "currencyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (!worth) return null;

  const row = (label: string, value: number) => (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-[var(--muted)]">{label}</span>

      <span className="font-semibold text-[var(--foreground)]">
        {formatCurrency(value)}
      </span>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-6 md:px-0">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          {t("netWorthTitle")}
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("netWorthSubtitle")}
        </p>
      </div>

      <div
        className={`rounded-3xl p-6 text-white ${
          worth.netWorth < 0
            ? "bg-gradient-to-br from-[#8F1D18] to-[var(--sun)]"
            : "bg-gradient-to-br from-[var(--forest)] to-[var(--primary)]"
        }`}
      >
        <p className="text-sm opacity-90">{t("netWorthTitle")}</p>

        <p className="mt-1 text-4xl font-bold">
          {formatCurrency(worth.netWorth)}
        </p>

        {change !== null && change !== 0 && (
          <p className="mt-2 text-sm opacity-95">
            {change > 0 ? "▲ " : "▼ "}
            {t("netWorthChange", {
              amount: formatCurrency(Math.abs(change)),
            })}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="font-semibold text-[var(--foreground)]">
          {t("netWorthOwn")}
        </p>

        <div className="mt-2 divide-y divide-[var(--border)]">
          {row(t("netWorthAccounts"), worth.accounts)}
          {row(t("netWorthGoals"), worth.goals)}
          {row(t("netWorthInvestments"), worth.investments)}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[var(--foreground)]">
            {t("netWorthOwe")}
          </p>

          <p className="font-bold text-red-500">
            {formatCurrency(worth.debts)}
          </p>
        </div>

        {debts.length === 0 && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {t("debtsEmpty")}
          </p>
        )}

        <div className="mt-3 space-y-3">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="flex items-center gap-3"
            >
              <span className="text-xl">{debt.emoji}</span>

              <p className="min-w-0 flex-1 truncate text-sm text-[var(--foreground)]">
                {debt.name}
              </p>

              <input
                inputMode="decimal"
                defaultValue={debt.amount}
                onBlur={(e) => {
                  const value = Number(e.target.value);

                  if (!isNaN(value) && value >= 0) {
                    updateDebtAmount(debt.id, value);
                  }
                }}
                className="w-28 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-right text-sm text-[var(--foreground)]"
              />

              <button
                type="button"
                aria-label="delete"
                onClick={() => deleteDebt(debt.id)}
                className="text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-[4rem_1fr] gap-3">
              <input
                value={emoji}
                maxLength={2}
                onChange={(e) => setEmoji(e.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-center text-[var(--foreground)]"
              />

              <input
                value={name}
                maxLength={40}
                placeholder={t("debtNamePlaceholder")}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
              />
            </div>

            <input
              inputMode="decimal"
              value={amount}
              placeholder={t("debtAmountLabel")}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^\d.]/g, ""))
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
            />

            <div className="flex gap-3">
              <button
                type="button"
                disabled={!name.trim() || !(Number(amount) > 0)}
                onClick={() => {
                  addDebt({
                    name: name.trim(),
                    emoji: emoji.trim() || "💸",
                    amount: Number(amount),
                  });
                  setName("");
                  setAmount("");
                  setAdding(false);
                }}
                className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                {t("saveLabel")}
              </button>

              <button
                type="button"
                onClick={() => setAdding(false)}
                className="text-sm text-[var(--muted)]"
              >
                {t("cancelLabel")}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
          >
            <Plus size={16} />
            {t("addDebt")}
          </button>
        )}
      </div>
    </div>
  );
}
