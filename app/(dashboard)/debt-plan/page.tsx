"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Field, Pill, Section } from "@/app/components/PaperUI";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  addDebt,
  deleteDebt,
  getDebts,
  updateDebt,
  type Debt,
} from "@/app/data/netWorth";
import {
  allocation,
  daysToDue,
  getDebtPlan,
  payDebt,
  saveDebtPlan,
  simulate,
  storyNumbers,
  syncReminders,
  type DebtPlanState,
  type Strategy,
} from "@/app/data/debtPlan";

const toNum = (value: string) => {
  const n = Number(value);

  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function DebtPlanPage() {
  const { t, language } = useLanguage();

  const [state, setState] = useState<DebtPlanState | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<"debts" | "strategy" | "plan" | "track">("debts");
  const [remindMsg, setRemindMsg] = useState<"on" | "needDay" | null>(null);
  const [payInputs, setPayInputs] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [minPay, setMinPay] = useState("");

  useEffect(() => {
    const load = () => {
      setState(getDebtPlan());
      setDebts(getDebts());
    };

    load();

    window.addEventListener("debtsUpdated", load);

    return () => window.removeEventListener("debtsUpdated", load);
  }, []);

  const update = (patch: Partial<DebtPlanState>) =>
    setState((current) => {
      if (!current) return current;

      const next = { ...current, ...patch };

      saveDebtPlan(next);

      return next;
    });

  const extra = state ? toNum(state.extra) : 0;
  const strategy: Strategy = state?.strategy ?? "avalanche";

  const result = useMemo(() => {
    if (debts.length === 0) return null;

    return {
      plan: simulate(debts, extra, strategy),
      base: simulate(debts, 0, strategy),
    };
  }, [debts, extra, strategy]);

  if (!state) return null;

  const alloc = allocation(debts, extra, strategy);

  const originalOf = (d: Debt) =>
    Math.max(
      d.original ?? d.amount + (d.payments ?? []).reduce((s, p) => s + p.amount, 0),
      d.amount,
      1
    );

  const totalOriginal = debts.reduce((sum, d) => sum + originalOf(d), 0);
  const totalOwed = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPct =
    totalOriginal > 0
      ? Math.round(((totalOriginal - totalOwed) / totalOriginal) * 100)
      : 0;

  const tabs: [typeof tab, string][] = [
    ["debts", t("dpTabDebts")],
    ["strategy", t("dpTabStrategy")],
    ["plan", t("dpTabPlan")],
    ["track", t("dpTabTrack")],
  ];

  const money = (value: number) => formatCurrency(Math.round(value));
  const fmt = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const story = storyNumbers();

  const slides = [
    t("dpStory1", {
      amount: formatCurrency(story.amount),
      rate: fmt(story.rate),
      pay: formatCurrency(story.pay),
    }),
    t("dpStory2", {
      months: fmt(story.months),
      total: formatCurrency(story.total),
      interest: formatCurrency(story.interest),
    }),
    t("dpStory3", {
      extra: formatCurrency(story.extra),
      months: fmt(story.monthsSooner),
      saved: formatCurrency(story.interestSaved),
    }),
  ];

  const inStory = state.answer === null;

  const freeBy = (months: number) => {
    const date = new Date();

    date.setMonth(date.getMonth() + months);

    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  const addNew = () => {
    if (!name.trim() || toNum(amount) <= 0) return;

    addDebt({
      name: name.trim(),
      emoji: "💳",
      amount: toNum(amount),
      rate: toNum(rate),
      minPay: toNum(minPay),
    });

    setName("");
    setAmount("");
    setRate("");
    setMinPay("");
  };

  const strategies: [Strategy, string, string][] = [
    ["avalanche", t("dpAvalanche"), t("dpAvalancheHint")],
    ["snowball", t("dpSnowball"), t("dpSnowballHint")],
  ];

  const back = (
    <Link
      href="/money"
      className="mt-3 block text-center text-sm font-semibold text-[var(--pen)]"
    >
      {t("hpBack")}
    </Link>
  );

  return (
    <div className="paper -mx-1 min-h-[80vh] rounded-3xl p-4 pb-28">
      {/* STORY */}

      {inStory && slide < slides.length && (
        <div className="flex min-h-[70vh] flex-col justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= slide ? "bg-[var(--pen)]" : "bg-[var(--ink)]/15"
                }`}
              />
            ))}
          </div>

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{slides[slide]}</span>
          </p>

          <Pill onClick={() => setSlide(slide + 1)}>{t("hpNext")}</Pill>
        </div>
      )}

      {/* QUESTION */}

      {inStory && slide >= slides.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-6">
          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("dpAsk")}</span>
          </p>

          <div className="space-y-3">
            <Pill tone="plain" onClick={() => update({ answer: "none" })}>
              {t("dpNo")}
            </Pill>

            <Pill onClick={() => update({ answer: "owe" })}>{t("dpYes")}</Pill>
          </div>
        </div>
      )}

      {/* DEBT FREE */}

      {state.answer === "none" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6">
          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("dpNoReply")}</span>
          </p>

          <Pill onClick={() => update({ answer: null })}>{t("dpRedo")}</Pill>

          {back}
        </div>
      )}

      {/* THE TOOL: four short tabs */}

      {state.answer === "owe" && (
        <div className="space-y-4">
          <header>
            <h1 className="font-hand text-4xl text-[var(--pen)]">
              <span className="hl">{t("dpPlanTitle")}</span>
            </h1>

            <p className="mt-1 text-sm opacity-70">{t("dpPlanSub")}</p>
          </header>

          <div className="grid grid-cols-4 gap-1 rounded-full bg-[var(--ink)]/10 p-1">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={`rounded-full py-2 text-xs font-bold ${
                  tab === id ? "bg-[var(--pen)] text-white" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* DEBTS */}

          {tab === "debts" && (
            <Section title={t("dpListTitle")} hint={t("dpListHint")}>
              {debts.map((debt) => (
                <div
                  key={debt.id}
                  className="space-y-2 rounded-2xl bg-[var(--paper)] p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-bold">
                      {debt.emoji} {debt.name}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteDebt(debt.id)}
                      className="shrink-0 text-xs font-semibold text-red-600"
                    >
                      {t("dpRemove")}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label={t("dpOwed")}
                      value={String(debt.amount || "")}
                      onChange={(v) => updateDebt(debt.id, { amount: toNum(v) })}
                    />

                    <Field
                      label={t("dpRate")}
                      value={String(debt.rate || "")}
                      onChange={(v) => updateDebt(debt.id, { rate: toNum(v) })}
                    />

                    <Field
                      label={t("dpMin")}
                      value={String(debt.minPay || "")}
                      onChange={(v) => updateDebt(debt.id, { minPay: toNum(v) })}
                    />

                    <Field
                      label={t("dpDueDay")}
                      value={String(debt.dueDay || "")}
                      onChange={(v) =>
                        updateDebt(debt.id, {
                          dueDay: Math.min(Math.round(toNum(v)), 31) || undefined,
                        })
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2 rounded-2xl border-2 border-dashed border-[var(--ink)]/20 p-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold opacity-70">
                    {t("dpName")}
                  </span>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-[var(--ink)]/15 bg-white/70 px-3 py-2 text-base font-semibold outline-none focus:border-[var(--pen)]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <Field label={t("dpOwed")} value={amount} onChange={setAmount} />
                  <Field label={t("dpRate")} value={rate} onChange={setRate} />
                  <Field label={t("dpMin")} value={minPay} onChange={setMinPay} />
                </div>

                <Pill onClick={addNew}>{t("dpAdd")}</Pill>
              </div>
            </Section>
          )}

          {/* STRATEGY */}

          {tab === "strategy" && (
            <Section title={t("dpTabStrategy")}>
              <Field
                label={t("dpExtra")}
                value={state.extra}
                onChange={(value) => update({ extra: value })}
              />

              <div className="grid grid-cols-2 gap-2">
                {strategies.map(([id, label, hint]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update({ strategy: id })}
                    className={`rounded-2xl border-2 px-3 py-2 text-left ${
                      strategy === id
                        ? "border-[var(--pen)] bg-[var(--pen)] text-white"
                        : "border-[var(--ink)]/15 bg-white/70"
                    }`}
                  >
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="block text-[11px] opacity-80">{hint}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* PLAN */}

          {tab === "plan" && (
            <Section title={t("dpPlanSection")}>
              {!result ? (
                <p className="text-sm opacity-70">{t("dpNoDebts")}</p>
              ) : result.plan.never ? (
                <p className="rounded-xl bg-[var(--mark)]/60 px-3 py-2 text-sm font-semibold">
                  {debts.some((d) => (d.minPay ?? 0) > 0) || extra > 0
                    ? t("dpNever")
                    : t("dpNeedPay")}
                </p>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm opacity-70">{t("dpFreeBy")}</span>

                    <span className="font-hand text-3xl text-[var(--pen)]">
                      <span className="hl">{freeBy(result.plan.months)}</span>
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">{t("dpInterestTotal")}</span>
                    <span className="font-bold">
                      {money(result.plan.interest)}
                    </span>
                  </div>

                  {extra > 0 && !result.base.never && (
                    <p className="rounded-xl bg-[var(--pen)]/15 px-3 py-2 text-sm font-semibold text-[var(--pen)]">
                      {t("dpSaves", {
                        saved: money(result.base.interest - result.plan.interest),
                        months: fmt(result.base.months - result.plan.months),
                      })}
                    </p>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-semibold opacity-70">
                      {t("dpOrder")}
                    </p>

                    <ol className="space-y-1">
                      {result.plan.cleared.map((item, index) => {
                        const debt = debts.find((d) => d.id === item.id);

                        return (
                          <li
                            key={item.id}
                            className="flex justify-between gap-3 text-sm"
                          >
                            <span className="min-w-0 truncate">
                              <span className="font-hand text-lg text-[var(--pen)]">
                                {fmt(index + 1)}.
                              </span>{" "}
                              {debt?.emoji} {debt?.name}
                            </span>

                            <span className="shrink-0 font-semibold">
                              {t("dpClearedIn", { n: fmt(item.month) })}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold opacity-70">
                      {t("dpThisMonth")}
                    </p>

                    {debts
                      .filter((d) => d.amount > 0)
                      .map((d) => (
                        <div key={d.id} className="flex justify-between text-sm">
                          <span className="truncate">
                            {d.emoji} {d.name}
                          </span>

                          <span className="font-bold">
                            {money(alloc[d.id] ?? 0)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <Pill
                    onClick={() => {
                      const count = syncReminders(alloc);

                      setRemindMsg(count > 0 ? "on" : "needDay");
                    }}
                  >
                    {t("dpRemind")}
                  </Pill>

                  {remindMsg && (
                    <p className="text-sm font-semibold text-[var(--pen)]">
                      {remindMsg === "on"
                        ? t("dpRemindOn")
                        : t("dpRemindNeedDay")}
                    </p>
                  )}
                </>
              )}
            </Section>
          )}

          {/* TRACK */}

          {tab === "track" && (
            <Section title={t("dpTotalProgress")}>
              {debts.length === 0 ? (
                <p className="text-sm opacity-70">{t("dpNoDebts")}</p>
              ) : (
                <>
                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-hand text-3xl text-[var(--pen)]">
                        <span className="hl">{fmt(totalPct)}%</span>
                      </span>

                      <span className="text-xs opacity-70">
                        {t("dpPaidSoFar", {
                          paid: money(totalOriginal - totalOwed),
                          total: money(totalOriginal),
                        })}
                      </span>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-[var(--ink)]/10">
                      <div
                        className="h-2 rounded-full bg-[var(--pen)]"
                        style={{ width: `${totalPct}%` }}
                      />
                    </div>
                  </div>

                  {debts.map((d) => {
                    const original = originalOf(d);
                    const pct = Math.round(((original - d.amount) / original) * 100);
                    const cleared = d.amount <= 0;

                    return (
                      <div
                        key={d.id}
                        className="space-y-2 rounded-2xl bg-[var(--paper)] p-3"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="min-w-0 truncate text-sm font-bold">
                            {d.emoji} {d.name}
                          </p>

                          <p className="shrink-0 text-xs font-semibold text-[var(--pen)]">
                            {cleared ? t("dpCleared") : money(d.amount)}
                          </p>
                        </div>

                        <div className="h-1.5 rounded-full bg-[var(--ink)]/10">
                          <div
                            className="h-1.5 rounded-full bg-[var(--pen)]"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>

                        {!cleared && (
                          <>
                            <p className="text-xs opacity-70">
                              {d.dueDay
                                ? daysToDue(d.dueDay) === 0
                                  ? t("dpDueToday")
                                  : t("dpDueIn", { n: fmt(daysToDue(d.dueDay)) })
                                : t("dpNoDue")}
                            </p>

                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <Field
                                  label={t("dpPayAmount")}
                                  value={
                                    payInputs[d.id] ??
                                    String(Math.round(alloc[d.id] ?? d.minPay ?? 0) || "")
                                  }
                                  onChange={(v) =>
                                    setPayInputs((cur) => ({ ...cur, [d.id]: v }))
                                  }
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  payDebt(
                                    d.id,
                                    toNum(
                                      payInputs[d.id] ??
                                        String(Math.round(alloc[d.id] ?? d.minPay ?? 0))
                                    )
                                  );

                                  setPayInputs((cur) => {
                                    const next = { ...cur };

                                    delete next[d.id];

                                    return next;
                                  });
                                }}
                                className="mb-0.5 shrink-0 rounded-full bg-[var(--pen)] px-4 py-2.5 text-sm font-bold text-white"
                              >
                                {t("dpLogPayment")}
                              </button>
                            </div>
                          </>
                        )}

                        {(d.payments?.length ?? 0) > 0 && (
                          <div className="border-t border-[var(--ink)]/10 pt-2">
                            <p className="mb-1 text-xs font-semibold opacity-70">
                              {t("dpHistory")}
                            </p>

                            {d.payments!.slice(0, 3).map((pay, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className="opacity-70">{pay.date}</span>
                                <span className="font-semibold">{money(pay.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </Section>
          )}

          <p className="text-center text-xs opacity-60">{t("dpDisclaimer")}</p>

          <button
            type="button"
            onClick={() => {
              setSlide(0);
              update({ answer: null });
            }}
            className="block w-full text-center text-sm font-semibold text-[var(--pen)]"
          >
            {t("dpRedo")}
          </button>

          {back}
        </div>
      )}
    </div>
  );
}
