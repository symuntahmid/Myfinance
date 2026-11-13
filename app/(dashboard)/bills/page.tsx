"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  accountName,
  getAccounts,
  type Account,
} from "@/app/data/accounts";
import {
  addBill,
  deleteBill,
  getBills,
  markBillPaid,
  sortedStatuses,
  undoBillPaid,
  type BillStatus,
} from "@/app/data/bills";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import { getCustomCategories } from "@/app/data/plan";

const field =
  "mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]";

export default function BillsPage() {
  const { t, language } = useLanguage();

  const [statuses, setStatuses] = useState<BillStatus[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🧾");
  const [amount, setAmount] = useState("");
  const [day, setDay] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("💡 Bills");

  const categories = [
    ...quickExpenseCategories.map((item) => ({
      value: item.value,
      label: `${item.emoji} ${item[language]}`,
    })),
    ...getCustomCategories().map((item) => ({
      value: item.value,
      label: item.value,
    })),
  ];

  useEffect(() => {
    const refresh = () => {
      setStatuses(sortedStatuses(getBills(), new Date()));
      setAccounts(getAccounts());
    };

    refresh();

    const events = ["billsUpdated", "languageUpdated", "accountsUpdated"];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  const monthlyTotal = statuses.reduce(
    (sum, item) => sum + item.bill.amount,
    0
  );

  const dayNumber = Number(day);

  const valid =
    name.trim() !== "" &&
    Number(amount) > 0 &&
    dayNumber >= 1 &&
    dayNumber <= 31;

  function stateText(item: BillStatus): string {
    switch (item.state) {
      case "paid":
        return t("billPaid");
      case "overdue":
        return t("billOverdue");
      case "today":
        return t("billDueToday");
      default:
        return t("billDueIn", { days: item.daysLeft });
    }
  }

  const stateColor: Record<BillStatus["state"], string> = {
    paid: "text-emerald-600",
    overdue: "text-red-500",
    today: "text-amber-500",
    soon: "text-amber-500",
    upcoming: "text-[var(--muted)]",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-6 md:px-0">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          {t("billsTitle")}
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("billsSubtitle")}
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-600 p-6 text-white">
        <p className="text-sm opacity-90">
          {t("billMonthlyTotal")}
        </p>

        <p className="mt-1 text-4xl font-bold">
          {formatCurrency(monthlyTotal)}
        </p>
      </div>

      {adding ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="font-semibold text-[var(--foreground)]">
            {t("addBillTitle")}
          </p>

          <div className="mt-3 grid grid-cols-[4rem_1fr] gap-3">
            <input
              value={emoji}
              maxLength={2}
              onChange={(e) => setEmoji(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-center text-[var(--foreground)]"
            />

            <input
              value={name}
              maxLength={40}
              placeholder={t("billNamePlaceholder")}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted)]">
              {t("billAmountLabel")}
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d.]/g, ""))
                }
                className={field}
              />
            </label>

            <label className="text-xs text-[var(--muted)]">
              {t("billDayLabel")}
              <input
                inputMode="numeric"
                value={day}
                onChange={(e) =>
                  setDay(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                className={field}
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted)]">
              {t("billPayFrom")}
              <select
                value={source || accounts[0]?.source || ""}
                onChange={(e) => setSource(e.target.value)}
                className={field}
              >
                {accounts.map((item) => (
                  <option key={item.id} value={item.source}>
                    {item.emoji} {accountName(item, language)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-[var(--muted)]">
              {t("billCategoryLabel")}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={field}
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={!valid}
              onClick={() => {
                addBill({
                  name: name.trim(),
                  emoji: emoji.trim() || "🧾",
                  amount: Number(amount),
                  day: dayNumber,
                  category,
                  source: source || accounts[0]?.source || "",
                });
                setName("");
                setAmount("");
                setDay("");
                setAdding(false);
              }}
              className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {t("addBillTitle")}
        </button>
      )}

      {statuses.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          {t("billsEmpty")}
        </p>
      ) : (
        <div className="space-y-3">
          {statuses.map((item) => (
            <div
              key={item.bill.id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-2xl">{item.bill.emoji}</span>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--foreground)]">
                      {item.bill.name}
                    </p>

                    <p
                      className={`text-xs font-semibold ${stateColor[item.state]}`}
                    >
                      {stateText(item)}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-lg font-bold text-[var(--foreground)]">
                  {formatCurrency(item.bill.amount)}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                {item.state === "paid" ? (
                  <button
                    type="button"
                    onClick={() => undoBillPaid(item.bill.id)}
                    className="text-xs font-semibold text-[var(--muted)]"
                  >
                    {t("billUndo")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markBillPaid(item.bill.id)}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    {t("billMarkPaid")}
                  </button>
                )}

                <button
                  type="button"
                  aria-label="delete"
                  onClick={() => {
                    if (window.confirm(t("billDeleteConfirm"))) {
                      deleteBill(item.bill.id);
                    }
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
