"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  accountName,
  addAccount,
  deleteAccount,
  getAccounts,
  getBalances,
  setCurrentBalance,
  transferBetween,
  type Account,
} from "@/app/data/accounts";

const field =
  "mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]";

const button =
  "rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40";

function cleanNumber(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

export default function AccountsPage() {
  const { t, language } = useLanguage();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});

  const [panel, setPanel] = useState<"none" | "add" | "move">("none");

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📱");
  const [opening, setOpening] = useState("");

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [error, setError] = useState("");

  const [fixId, setFixId] = useState<string | null>(null);
  const [fixValue, setFixValue] = useState("");

  useEffect(() => {
    const refresh = () => {
      setAccounts(getAccounts());
      setBalances(getBalances());
    };

    refresh();

    const events = [
      "accountsUpdated",
      "transactionsUpdated",
      "languageUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  const total = accounts.reduce(
    (sum, item) => sum + (balances[item.id] ?? 0),
    0
  );

  function openMove() {
    setFromId(accounts[1]?.id ?? accounts[0]?.id ?? "");
    setToId(accounts[0]?.id ?? "");
    setAmount("");
    setFee("");
    setError("");
    setPanel("move");
  }

  function saveMove() {
    const from = accounts.find((item) => item.id === fromId);
    const to = accounts.find((item) => item.id === toId);

    if (!from || !to || from.id === to.id) {
      setError(t("transferDifferent"));
      return;
    }

    if (!(Number(amount) > 0)) {
      setError(t("transferNotEnough"));
      return;
    }

    transferBetween({
      from,
      to,
      amount: Number(amount),
      fee: Number(fee) || 0,
    });

    setPanel("none");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-6 md:px-0">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          {t("accountsTitle")}
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("accountsSubtitle")}
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-[var(--forest)] to-[var(--primary)] p-6 text-white">
        <p className="text-sm opacity-90">{t("totalBalance")}</p>

        <p className="mt-1 text-4xl font-bold">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={openMove}
          className={`${button} flex flex-1 items-center justify-center gap-2`}
        >
          <ArrowLeftRight size={16} />
          {t("transferMoney")}
        </button>

        <button
          type="button"
          onClick={() => {
            setName("");
            setOpening("");
            setPanel("add");
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          <Plus size={16} />
          {t("addAccount")}
        </button>
      </div>

      {panel === "add" && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="grid grid-cols-[4rem_1fr] gap-3">
            <label className="text-xs text-[var(--muted)]">
              &nbsp;
              <input
                value={emoji}
                maxLength={2}
                onChange={(e) => setEmoji(e.target.value)}
                className={`${field} text-center`}
              />
            </label>

            <label className="text-xs text-[var(--muted)]">
              {t("accountNameLabel")}
              <input
                value={name}
                maxLength={30}
                placeholder={t("accountNamePlaceholder")}
                onChange={(e) => setName(e.target.value)}
                className={field}
              />
            </label>
          </div>

          <label className="mt-3 block text-xs text-[var(--muted)]">
            {t("currentBalanceLabel")}
            <input
              inputMode="decimal"
              value={opening}
              onChange={(e) =>
                setOpening(cleanNumber(e.target.value))
              }
              className={field}
            />
          </label>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                addAccount({
                  name,
                  emoji: emoji.trim() || "💼",
                  openingBalance: Number(opening) || 0,
                });
                setPanel("none");
              }}
              className={button}
            >
              {t("saveLabel")}
            </button>

            <button
              type="button"
              onClick={() => setPanel("none")}
              className="text-sm text-[var(--muted)]"
            >
              {t("cancelLabel")}
            </button>
          </div>
        </div>
      )}

      {panel === "move" && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["transferFromLabel", fromId, setFromId],
                ["transferToLabel", toId, setToId],
              ] as const
            ).map(([label, value, setter]) => (
              <label
                key={label}
                className="text-xs text-[var(--muted)]"
              >
                {t(label)}
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={field}
                >
                  {accounts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.emoji} {accountName(item, language)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted)]">
              {t("transferAmountLabel")}
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) =>
                  setAmount(cleanNumber(e.target.value))
                }
                className={field}
              />
            </label>

            <label className="text-xs text-[var(--muted)]">
              {t("transferFeeLabel")}
              <input
                inputMode="decimal"
                value={fee}
                onChange={(e) =>
                  setFee(cleanNumber(e.target.value))
                }
                className={field}
              />
            </label>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={saveMove}
              className={button}
            >
              {t("transferMoney")}
            </button>

            <button
              type="button"
              onClick={() => setPanel("none")}
              className="text-sm text-[var(--muted)]"
            >
              {t("cancelLabel")}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {accounts.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>

                <p className="truncate font-semibold text-[var(--foreground)]">
                  {accountName(item, language)}
                </p>
              </div>

              <p
                className={`shrink-0 text-lg font-bold ${
                  (balances[item.id] ?? 0) < 0
                    ? "text-red-500"
                    : "text-[var(--foreground)]"
                }`}
              >
                {formatCurrency(balances[item.id] ?? 0)}
              </p>
            </div>

            {fixId === item.id ? (
              <div className="mt-3 flex items-center gap-2">
                <input
                  inputMode="decimal"
                  autoFocus
                  value={fixValue}
                  onChange={(e) =>
                    setFixValue(
                      e.target.value.replace(/[^\d.-]/g, "")
                    )
                  }
                  className={`${field} mt-0`}
                />

                <button
                  type="button"
                  onClick={() => {
                    if (fixValue !== "" && !isNaN(Number(fixValue))) {
                      setCurrentBalance(item.id, Number(fixValue));
                    }
                    setFixId(null);
                  }}
                  className={button}
                >
                  {t("saveLabel")}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setFixId(item.id);
                    setFixValue(String(balances[item.id] ?? 0));
                  }}
                  className="text-xs font-semibold text-[var(--primary)]"
                >
                  {t("fixBalance")}
                </button>

                <button
                  type="button"
                  aria-label="delete"
                  onClick={() => {
                    if (window.confirm(t("deleteAccountConfirm"))) {
                      deleteAccount(item.id);
                    }
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs leading-5 text-[var(--muted)]">
        {t("accountsHint")}
      </p>
    </div>
  );
}
