"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Target, Trash2, X } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getNetWorthNow } from "@/app/data/overview";
import {
  GOAL_EMOJIS,
  addLifeGoal,
  freedomNumber,
  getLifeGoals,
  getMonthlyCost,
  removeLifeGoal,
  saveMonthlyCost,
  type LifeGoal,
} from "@/app/data/lifeGoals";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function LifeGoalsCard() {
  const { t } = useLanguage();

  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [cost, setCost] = useState(0);
  const [worth, setWorth] = useState(0);
  const [editingCost, setEditingCost] = useState(false);
  const [costInput, setCostInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState("");
  const [emoji, setEmoji] = useState(GOAL_EMOJIS[0]);

  useEffect(() => {
    const refresh = () => {
      setGoals(getLifeGoals());
      setCost(getMonthlyCost());
      setWorth(Math.max(getNetWorthNow().netWorth, 0));
    };

    refresh();

    const events = [
      "lifeGoalsUpdated",
      "transactionsUpdated",
      "accountsUpdated",
      "languageUpdated",
      "settingsUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  const target = freedomNumber(cost);
  const percent = target > 0 ? Math.min(Math.round((worth / target) * 100), 100) : 0;
  const total = goals.reduce((sum, item) => sum + item.amount, 0);

  const submitGoal = () => {
    const value = Number(amount);

    if (!title.trim() || !(value > 0)) return;

    const yearValue = Number(year);

    addLifeGoal({
      title: title.trim(),
      amount: value,
      emoji,
      year: yearValue >= 2000 && yearValue <= 2200 ? yearValue : undefined,
    });

    setTitle("");
    setAmount("");
    setYear("");
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {/* FREEDOM NUMBER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C8962E] to-[#E4B85A] p-4 text-[#2B1F00] shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold opacity-80">
              <Target size={14} />
              {t("lgFreedomTitle")}
            </p>

            {target > 0 ? (
              <p className="mt-1 text-3xl font-bold leading-tight">
                {formatCurrency(target)}
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium">{t("lgSetCost")}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setCostInput(cost ? String(cost) : "");
              setEditingCost((open) => !open);
            }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold"
          >
            <Pencil size={12} />
            {t("lgEdit")}
          </button>
        </div>

        {editingCost && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={costInput}
              onChange={(event) => setCostInput(event.target.value)}
              placeholder={t("lgMonthlyCost")}
              className="min-w-0 flex-1 rounded-xl border-0 bg-white/70 px-3 py-2 text-sm outline-none"
            />

            <button
              type="button"
              onClick={() => {
                saveMonthlyCost(Number(costInput) || 0);
                setEditingCost(false);
              }}
              className="rounded-xl bg-[#2B1F00] px-4 py-2 text-sm font-semibold text-[#F6F0DC]"
            >
              {t("lgSaveCost")}
            </button>
          </div>
        )}

        {target > 0 && (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-black/15">
              <div
                className="h-full rounded-full bg-[#2B1F00]"
                style={{ width: `${Math.max(percent, 2)}%` }}
              />
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] font-medium opacity-80">
              <span>{t("lgYouHave", { amount: formatCurrency(worth) })}</span>
              <span>{t("lgPercentDone", { percent })}</span>
            </div>
          </div>
        )}

        <p className="mt-2 text-[11px] opacity-70">{t("lgFreedomHint")}</p>
      </section>

      {/* LIFE GOALS */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">{t("lgGoalsTitle")}</h3>

          <button
            type="button"
            onClick={() => setAdding((open) => !open)}
            className="flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white"
          >
            {adding ? <X size={13} /> : <Plus size={13} />}
            {t("lgAddGoal")}
          </button>
        </div>

        {adding && (
          <div className="mt-3 space-y-2 rounded-2xl bg-[var(--background)] p-3">
            <div className="flex flex-wrap gap-1.5">
              {GOAL_EMOJIS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`h-9 w-9 rounded-xl text-lg ${
                    emoji === item
                      ? "bg-[var(--gold-soft)] ring-2 ring-[var(--gold)]"
                      : "bg-[var(--card)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("lgGoalName")}
              maxLength={40}
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={t("lgAmount")}
                className={inputClass}
              />

              <input
                type="number"
                inputMode="numeric"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder={t("lgYear")}
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={submitGoal}
              disabled={!title.trim() || !(Number(amount) > 0)}
              className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {t("lgSave")}
            </button>
          </div>
        )}

        {goals.length === 0 && !adding ? (
          <p className="mt-3 text-sm text-[var(--muted)]">{t("lgEmpty")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)]">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-xl">
                  {goal.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{goal.title}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {goal.year ? t("lgByYear", { year: goal.year }) : " "}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-bold">
                  {formatCurrency(goal.amount)}
                </span>

                <button
                  type="button"
                  aria-label={t("lgDelete")}
                  onClick={() => removeLifeGoal(goal.id)}
                  className="shrink-0 p-1 text-[var(--muted)] hover:text-[var(--sun)]"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {goals.length > 0 && (
          <p className="mt-2 text-right text-xs font-medium text-[var(--muted)]">
            {t("lgTotal", { amount: formatCurrency(total) })}
          </p>
        )}
      </section>
    </div>
  );
}
