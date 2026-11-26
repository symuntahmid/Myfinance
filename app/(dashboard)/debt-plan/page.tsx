"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  Employee,
  RiceField,
  Shopkeeper,
  stageOf,
} from "@/app/components/debt/DebtArt";
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

/* ---------- words ---------- */

const TEXT = {
  en: {
    title: "Debt Planner",
    sub: "One debt at a time, until you are free",
    left: "left to pay",
    paidPct: "{p}% paid",
    freeBy: "Free by {d}",
    needPay: "Tell us what you can pay each month to see your free date.",
    stages: [
      "Every field starts with a seed. Today you begin.",
      "Green shoots! Keep going.",
      "Halfway grown. You are doing it.",
      "Almost harvest time.",
      "Harvest day. You are debt free!",
    ],
    empty: "No debts here yet. Add one and your field begins to grow.",
    yourDebts: "Your debts",
    addDebt: "Add a debt",
    focus: "Pay this first",
    edit: "Edit",
    paidBtn: "I paid {a}",
    otherAmt: "Other amount",
    amountLabel: "Amount paid",
    savePay: "Save payment",
    cleared: "Cleared",
    dueToday: "Due today",
    dueIn: "Due in {n} days",
    lastPaid: "Last paid {d}: {a}",
    flash: "Done. {a} off, {left} to go.",
    flashClear: "{name} is paid off!",
    newTitle: "Add a debt",
    editTitle: "Edit debt",
    who: "Who do you owe?",
    name: "Name",
    howMuch: "How much is left to pay?",
    more: "More details (optional)",
    moreHint: "Not sure? Skip these. You can add them later.",
    rate: "Interest a year (%)",
    min: "Smallest monthly payment",
    dueDay: "Due day (1-31)",
    save: "Save",
    remove: "Remove this debt",
    removeSure: "Tap again to remove",
    kinds: [
      ["🏦", "Bank loan"],
      ["🤝", "Friend or family"],
      ["🏪", "Shop (baki)"],
      ["📱", "Mobile or EMI"],
      ["💳", "Credit card"],
      ["🧾", "Other"],
    ],
    planTitle: "Your plan",
    extraLabel: "Extra you can pay each month",
    payLabel: "What you can pay each month",
    another: "Another amount",
    which: "Which debt first?",
    avalanche: "Highest interest first",
    avalancheHint: "Costs you the least",
    snowball: "Smallest debt first",
    snowballHint: "Quick wins keep you going",
    saves: "The extra saves you {saved} and {months} months.",
    never: "At this payment the debt never ends. Pay a little more each month.",
    interest: "Interest you will pay",
    order: "Order you will be free",
    inMonths: "month {n}",
    remind: "Remind me every month",
    remindOn: "Reminders are on.",
    remindNeed: "Add a due day to a debt first.",
    yes: "Yes",
  },
  bn: {
    title: "ঋণ পরিকল্পনা",
    sub: "একবারে একটি ঋণ, মুক্ত হওয়া পর্যন্ত",
    left: "শোধ বাকি",
    paidPct: "{p}% শোধ হয়েছে",
    freeBy: "মুক্তি: {d}",
    needPay: "প্রতি মাসে কত দিতে পারবেন তা লিখুন, মুক্তির মাস দেখতে পাবেন।",
    stages: [
      "প্রতিটি ফসল একটি বীজ থেকে শুরু হয়। আজ আপনার শুরু।",
      "সবুজ চারা উঠেছে! চালিয়ে যান।",
      "অর্ধেক পথ পার। দারুণ চলছে।",
      "ফসল তোলার সময় প্রায় হয়ে এল।",
      "ফসল তোলার দিন। আপনি ঋণমুক্ত!",
    ],
    empty: "এখনো কোনো ঋণ নেই। একটি যোগ করুন, আপনার মাঠ বাড়তে শুরু করবে।",
    yourDebts: "আপনার ঋণ",
    addDebt: "ঋণ যোগ করুন",
    focus: "আগে এটি শোধ করুন",
    edit: "বদলান",
    paidBtn: "{a} দিলাম",
    otherAmt: "অন্য অংক",
    amountLabel: "কত দিয়েছেন",
    savePay: "পেমেন্ট লিখুন",
    cleared: "শোধ হয়েছে",
    dueToday: "আজ দেওয়ার দিন",
    dueIn: "{n} দিন পরে দেওয়ার দিন",
    lastPaid: "শেষ দিয়েছেন {d}: {a}",
    flash: "হয়ে গেছে। {a} কমল, বাকি {left}।",
    flashClear: "{name} শোধ হয়ে গেছে!",
    newTitle: "ঋণ যোগ করুন",
    editTitle: "ঋণ বদলান",
    who: "কার কাছে ঋণ?",
    name: "নাম",
    howMuch: "কত টাকা শোধ বাকি?",
    more: "আরও তথ্য (ইচ্ছা হলে)",
    moreHint: "নিশ্চিত না হলে বাদ দিন। পরে দিতে পারবেন।",
    rate: "বছরে সুদ (%)",
    min: "মাসে সবচেয়ে কম কত দিতে হয়",
    dueDay: "মাসের কত তারিখে (১-৩১)",
    save: "সংরক্ষণ",
    remove: "এই ঋণ মুছুন",
    removeSure: "মুছতে আবার চাপ দিন",
    kinds: [
      ["🏦", "ব্যাংক ঋণ"],
      ["🤝", "বন্ধু বা পরিবার"],
      ["🏪", "দোকানের বাকি"],
      ["📱", "মোবাইল বা কিস্তি"],
      ["💳", "ক্রেডিট কার্ড"],
      ["🧾", "অন্য"],
    ],
    planTitle: "আপনার পরিকল্পনা",
    extraLabel: "প্রতি মাসে বাড়তি কত দিতে পারবেন",
    payLabel: "প্রতি মাসে কত দিতে পারবেন",
    another: "অন্য অংক",
    which: "কোন ঋণ আগে?",
    avalanche: "সবচেয়ে বেশি সুদ আগে",
    avalancheHint: "সবচেয়ে কম খরচ হয়",
    snowball: "সবচেয়ে ছোট ঋণ আগে",
    snowballHint: "দ্রুত জয় চালিয়ে যেতে সাহস দেয়",
    saves: "বাড়তি টাকায় {saved} আর {months} মাস বাঁচবে।",
    never: "এই অংকে ঋণ কখনো শেষ হবে না। মাসে একটু বেশি দিন।",
    interest: "মোট সুদ দিতে হবে",
    order: "যে ক্রমে মুক্ত হবেন",
    inMonths: "{n} মাসে",
    remind: "প্রতি মাসে মনে করিয়ে দিন",
    remindOn: "রিমাইন্ডার চালু হয়েছে।",
    remindNeed: "আগে কোনো ঋণে মাসের তারিখ দিন।",
    yes: "হ্যাঁ",
  },
} as const;

const fill = (text: string, vars: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");

const toNum = (value: string) => {
  const n = Number(value);

  return Number.isFinite(n) && n > 0 ? n : 0;
};

const digits = (value: string) => value.replace(/[^0-9.]/g, "");

const EXTRA_CHIPS = [0, 500, 1000, 2000, 5000];

/* ---------- add / edit sheet ---------- */

function DebtSheet({
  debt,
  onClose,
  language,
}: {
  debt?: Debt;
  onClose: () => void;
  language: "en" | "bn";
}) {
  const L = TEXT[language];

  const [emoji, setEmoji] = useState(debt?.emoji ?? "");
  const [name, setName] = useState(debt?.name ?? "");
  const [amount, setAmount] = useState(debt ? String(debt.amount || "") : "");
  const [rate, setRate] = useState(debt?.rate ? String(debt.rate) : "");
  const [minPay, setMinPay] = useState(debt?.minPay ? String(debt.minPay) : "");
  const [dueDay, setDueDay] = useState(debt?.dueDay ? String(debt.dueDay) : "");
  const [more, setMore] = useState(Boolean(debt?.rate || debt?.minPay || debt?.dueDay));
  const [sure, setSure] = useState(false);

  const ready = name.trim().length > 0 && toNum(amount) > 0;

  const save = () => {
    if (!ready) return;

    const day = Math.min(Math.round(toNum(dueDay)), 31) || undefined;

    if (debt) {
      updateDebt(debt.id, {
        name: name.trim(),
        emoji: emoji || debt.emoji,
        amount: toNum(amount),
        rate: toNum(rate),
        minPay: toNum(minPay),
        dueDay: day,
      });
    } else {
      addDebt({
        name: name.trim(),
        emoji: emoji || "🧾",
        amount: toNum(amount),
        rate: toNum(rate),
        minPay: toNum(minPay),
        dueDay: day,
      });
    }

    onClose();
  };

  const box =
    "w-full rounded-xl border-2 border-[var(--ink)]/15 bg-white/80 px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--pen)]";

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[92vh] max-w-md space-y-4 overflow-y-auto rounded-t-3xl bg-[var(--paper)] p-5 pb-8 text-[var(--ink)]">
        <h2 className="font-hand text-3xl text-[var(--pen)]">
          {debt ? L.editTitle : L.newTitle}
        </h2>

        <div>
          <p className="mb-2 text-sm font-semibold">{L.who}</p>

          <div className="flex flex-wrap gap-2">
            {L.kinds.map(([icon, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={emoji === icon}
                onClick={() => {
                  setEmoji(icon);
                  if (!name.trim() || L.kinds.some(([, k]) => k === name)) setName(label);
                }}
                className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold ${
                  emoji === icon
                    ? "border-[var(--pen)] bg-[var(--pen)] text-white"
                    : "border-[var(--ink)]/15 bg-white/70"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">{L.name}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={box} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">{L.howMuch}</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(digits(e.target.value))}
            className={`${box} text-2xl`}
          />
        </label>

        <div>
          <button
            type="button"
            aria-expanded={more}
            onClick={() => setMore(!more)}
            className="text-sm font-bold text-[var(--pen)]"
          >
            {more ? "−" : "+"} {L.more}
          </button>

          {more && (
            <div className="mt-3 space-y-3">
              <p className="text-xs opacity-70">{L.moreHint}</p>

              {(
                [
                  [L.rate, rate, setRate],
                  [L.min, minPay, setMinPay],
                  [L.dueDay, dueDay, setDueDay],
                ] as const
              ).map(([label, value, set]) => (
                <label key={label} className="block">
                  <span className="mb-1 block text-xs font-semibold opacity-70">{label}</span>
                  <input
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => set(digits(e.target.value))}
                    className={box}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={save}
          className="w-full rounded-full bg-[var(--pen)] px-5 py-3 text-base font-bold text-white disabled:opacity-40"
        >
          {L.save}
        </button>

        {debt && (
          <button
            type="button"
            onClick={() => {
              if (!sure) return setSure(true);
              deleteDebt(debt.id);
              onClose();
            }}
            className="block w-full text-center text-sm font-semibold text-red-600"
          >
            {sure ? L.removeSure : L.remove}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function DebtPlanPage() {
  const { t, language } = useLanguage();
  const lang: "en" | "bn" = language === "bn" ? "bn" : "en";
  const L = TEXT[lang];

  const [state, setState] = useState<DebtPlanState | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [slide, setSlide] = useState(0);
  const [sheet, setSheet] = useState<"new" | string | null>(null);
  const [openPay, setOpenPay] = useState<string | null>(null);
  const [payInputs, setPayInputs] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState<{ id: string; text: string } | null>(null);
  const [remindMsg, setRemindMsg] = useState<"on" | "needDay" | null>(null);

  useEffect(() => {
    const load = () => {
      setState(getDebtPlan());
      setDebts(getDebts());
    };

    load();

    window.addEventListener("debtsUpdated", load);

    return () => window.removeEventListener("debtsUpdated", load);
  }, []);

  useEffect(() => {
    if (!flash) return;

    const timer = setTimeout(() => setFlash(null), 5000);

    return () => clearTimeout(timer);
  }, [flash]);

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

  const money = (value: number) => formatCurrency(Math.round(value));
  const fmt = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

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

  const allDone = debts.length > 0 && totalOwed <= 0;
  const stage = stageOf(totalPct, allDone);

  const open = debts.filter((d) => d.amount > 0);
  const done = debts.filter((d) => d.amount <= 0);

  const focusId =
    open.length > 1
      ? [...open].sort((a, b) =>
          strategy === "avalanche"
            ? (b.rate ?? 0) - (a.rate ?? 0) || a.amount - b.amount
            : a.amount - b.amount
        )[0].id
      : null;

  const hasMins = debts.some((d) => (d.minPay ?? 0) > 0);

  const freeBy = (months: number) => {
    const date = new Date();

    date.setMonth(date.getMonth() + months);

    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  const story = storyNumbers();

  const slides = [
    {
      art: <Shopkeeper />,
      text: t("dpStory1", {
        amount: formatCurrency(story.amount),
        rate: fmt(story.rate),
        pay: formatCurrency(story.pay),
      }),
    },
    {
      art: <Employee />,
      text: t("dpStory2", {
        months: fmt(story.months),
        total: formatCurrency(story.total),
        interest: formatCurrency(story.interest),
      }),
    },
    {
      art: <RiceField stage={2} className="overflow-hidden rounded-2xl" />,
      text: t("dpStory3", {
        extra: formatCurrency(story.extra),
        months: fmt(story.monthsSooner),
        saved: formatCurrency(story.interestSaved),
      }),
    },
  ];

  const inStory = state.answer === null;

  const back = (
    <Link
      href="/money"
      className="mt-3 block text-center text-sm font-semibold text-[var(--pen)]"
    >
      {t("hpBack")}
    </Link>
  );

  const bigButton =
    "w-full rounded-full bg-[var(--pen)] px-5 py-3 text-base font-bold text-white transition active:scale-[0.98]";
  const plainButton =
    "w-full rounded-full border-2 border-[var(--ink)]/20 bg-white/70 px-5 py-3 text-base font-bold transition active:scale-[0.98]";

  const pay = (d: Debt, amount: number) => {
    const paid = Math.min(amount, d.amount);

    if (paid <= 0) return;

    payDebt(d.id, paid);

    setOpenPay(null);
    setPayInputs((cur) => {
      const next = { ...cur };

      delete next[d.id];

      return next;
    });

    setFlash({
      id: d.id,
      text:
        d.amount - paid <= 0.005
          ? fill(L.flashClear, { name: d.name })
          : fill(L.flash, { a: money(paid), left: money(d.amount - paid) }),
    });
  };

  const editing = sheet && sheet !== "new" ? debts.find((d) => d.id === sheet) : undefined;

  return (
    <div className="paper -mx-1 min-h-[80vh] rounded-3xl p-4 pb-28">
      {/* STORY */}

      {inStory && slide < slides.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-4">
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

          <div className="mx-auto w-full max-w-xs">{slides[slide].art}</div>

          <p className="font-hand text-3xl leading-snug text-[var(--pen)]">
            <span className="hl">{slides[slide].text}</span>
          </p>

          <button type="button" onClick={() => setSlide(slide + 1)} className={bigButton}>
            {t("hpNext")}
          </button>
        </div>
      )}

      {/* QUESTION */}

      {inStory && slide >= slides.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-4">
          <div className="mx-auto w-full max-w-xs">
            <RiceField stage={1} className="overflow-hidden rounded-2xl" />
          </div>

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("dpAsk")}</span>
          </p>

          <div className="space-y-3">
            <button type="button" onClick={() => update({ answer: "none" })} className={plainButton}>
              {t("dpNo")}
            </button>

            <button type="button" onClick={() => update({ answer: "owe" })} className={bigButton}>
              {t("dpYes")}
            </button>
          </div>
        </div>
      )}

      {/* DEBT FREE */}

      {state.answer === "none" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6">
          <div className="mx-auto w-full max-w-xs">
            <RiceField stage={4} className="overflow-hidden rounded-2xl" />
          </div>

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("dpNoReply")}</span>
          </p>

          <button type="button" onClick={() => update({ answer: null })} className={bigButton}>
            {t("dpRedo")}
          </button>

          {back}
        </div>
      )}

      {/* THE PLANNER: one page, no tabs */}

      {state.answer === "owe" && (
        <div className="space-y-4">
          <header>
            <h1 className="font-hand text-4xl text-[var(--pen)]">
              <span className="hl">{L.title}</span>
            </h1>

            <p className="mt-1 text-sm opacity-70">{L.sub}</p>
          </header>

          {/* the field: shows how far you have come */}

          <section className="overflow-hidden rounded-3xl border-2 border-[var(--ink)]/10 bg-white/50">
            <RiceField stage={stage} />

            <div className="space-y-1 p-4">
              {debts.length > 0 ? (
                <>
                  <p className="font-hand text-4xl leading-none text-[var(--pen)]">
                    {money(totalOwed)}
                  </p>

                  <p className="text-sm opacity-70">
                    {L.left} · {fill(L.paidPct, { p: fmt(totalPct) })}
                  </p>

                  <div className="!mt-3 h-2.5 rounded-full bg-[var(--ink)]/10">
                    <div
                      className="h-2.5 rounded-full bg-[var(--pen)] transition-all duration-700"
                      style={{ width: `${Math.min(totalPct, 100)}%` }}
                    />
                  </div>

                  <p className="!mt-3 text-sm font-semibold text-[var(--pen)]">
                    {allDone
                      ? L.stages[4]
                      : result && !result.plan.never && result.plan.months > 0
                      ? fill(L.freeBy, { d: freeBy(result.plan.months) })
                      : L.needPay}
                  </p>

                  <p className="text-xs opacity-70">{L.stages[stage]}</p>
                </>
              ) : (
                <p className="text-sm font-semibold">{L.empty}</p>
              )}
            </div>
          </section>

          {/* debts */}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-hand text-2xl text-[var(--pen)]">{L.yourDebts}</h2>

              <button
                type="button"
                onClick={() => setSheet("new")}
                className="flex items-center gap-1 rounded-full bg-[var(--pen)] px-4 py-2 text-sm font-bold text-white"
              >
                <Plus size={16} aria-hidden="true" />
                {L.addDebt}
              </button>
            </div>

            {open.map((d) => {
              const original = originalOf(d);
              const pct = Math.round(((original - d.amount) / original) * 100);
              const due = d.dueDay ? daysToDue(d.dueDay) : null;
              const suggest = Math.round(alloc[d.id] ?? d.minPay ?? 0);
              const custom = openPay === d.id || suggest <= 0;
              const last = d.payments?.[0];

              return (
                <div
                  key={d.id}
                  className={`space-y-3 rounded-3xl border-2 bg-white/60 p-4 ${
                    d.id === focusId ? "border-[var(--pen)]" : "border-[var(--ink)]/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold">
                        {d.emoji} {d.name}
                      </p>

                      {d.id === focusId && (
                        <span className="mt-1 inline-block rounded-full bg-[var(--mark)] px-2 py-0.5 text-[11px] font-bold">
                          {L.focus}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSheet(d.id)}
                      className="shrink-0 text-sm font-semibold text-[var(--pen)]"
                    >
                      {L.edit}
                    </button>
                  </div>

                  <div>
                    <p className="font-hand text-3xl leading-none">{money(d.amount)}</p>

                    <div className="mt-2 h-2 rounded-full bg-[var(--ink)]/10">
                      <div
                        className="h-2 rounded-full bg-[var(--pen)] transition-all duration-700"
                        style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
                      />
                    </div>

                    <p className="mt-1.5 text-xs opacity-70">
                      {due === null
                        ? ""
                        : due === 0
                        ? L.dueToday
                        : fill(L.dueIn, { n: fmt(due) })}
                      {due !== null && last ? " · " : ""}
                      {last ? fill(L.lastPaid, { d: last.date, a: money(last.amount) }) : ""}
                    </p>
                  </div>

                  {custom ? (
                    <div className="flex items-end gap-2">
                      <label className="block flex-1">
                        <span className="mb-1 block text-xs font-semibold opacity-70">
                          {L.amountLabel}
                        </span>

                        <input
                          inputMode="decimal"
                          value={payInputs[d.id] ?? ""}
                          onChange={(e) =>
                            setPayInputs((cur) => ({ ...cur, [d.id]: digits(e.target.value) }))
                          }
                          className="w-full rounded-xl border-2 border-[var(--ink)]/15 bg-white/80 px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--pen)]"
                        />
                      </label>

                      <button
                        type="button"
                        disabled={toNum(payInputs[d.id] ?? "") <= 0}
                        onClick={() => pay(d, toNum(payInputs[d.id] ?? ""))}
                        className="shrink-0 rounded-full bg-[var(--pen)] px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                      >
                        {L.savePay}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => pay(d, suggest)}
                        className={bigButton}
                      >
                        {fill(L.paidBtn, { a: money(suggest) })}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenPay(d.id)}
                        className="block w-full text-center text-sm font-semibold text-[var(--pen)]"
                      >
                        {L.otherAmt}
                      </button>
                    </div>
                  )}

                  {flash?.id === d.id && (
                    <p role="status" className="rounded-xl bg-[var(--pen)]/15 px-3 py-2 text-sm font-semibold text-[var(--pen)]">
                      🌾 {flash.text}
                    </p>
                  )}
                </div>
              );
            })}

            {done.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/40 px-4 py-3"
              >
                <p className="min-w-0 truncate text-sm font-semibold opacity-70">
                  {d.emoji} {d.name}
                </p>

                <span className="shrink-0 text-sm font-bold text-[var(--pen)]">
                  🌾 {L.cleared}
                </span>
              </div>
            ))}

            {flash && !debts.some((d) => d.id === flash.id && d.amount > 0) && (
              <p role="status" className="rounded-xl bg-[var(--pen)]/15 px-3 py-2 text-sm font-semibold text-[var(--pen)]">
                🌾 {flash.text}
              </p>
            )}
          </section>

          {/* plan */}

          {open.length > 0 && (
            <section className="space-y-4 rounded-3xl border-2 border-[var(--ink)]/10 bg-white/50 p-4">
              <h2 className="font-hand text-2xl text-[var(--pen)]">{L.planTitle}</h2>

              <div>
                <p className="mb-2 text-sm font-semibold">
                  {hasMins ? L.extraLabel : L.payLabel}
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXTRA_CHIPS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={extra === v}
                      onClick={() => update({ extra: v ? String(v) : "" })}
                      className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-bold ${
                        extra === v
                          ? "border-[var(--pen)] bg-[var(--pen)] text-white"
                          : "border-[var(--ink)]/15 bg-white/70"
                      }`}
                    >
                      {v === 0 ? (hasMins ? "0" : "–") : `+${fmt(v)}`}
                    </button>
                  ))}
                </div>

                <input
                  inputMode="decimal"
                  placeholder={L.another}
                  value={EXTRA_CHIPS.includes(extra) ? "" : state.extra}
                  onChange={(e) => update({ extra: digits(e.target.value) })}
                  className="mt-2 w-full rounded-xl border-2 border-[var(--ink)]/15 bg-white/80 px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--pen)]"
                />
              </div>

              {open.length > 1 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">{L.which}</p>

                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["avalanche", L.avalanche, L.avalancheHint],
                        ["snowball", L.snowball, L.snowballHint],
                      ] as [Strategy, string, string][]
                    ).map(([id, label, hint]) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={strategy === id}
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
                </div>
              )}

              {result?.plan.never ? (
                <p className="rounded-xl bg-[var(--mark)]/60 px-3 py-2 text-sm font-semibold">
                  {hasMins || extra > 0 ? L.never : L.needPay}
                </p>
              ) : (
                result && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">{L.interest}</span>
                      <span className="font-bold">{money(result.plan.interest)}</span>
                    </div>

                    {extra > 0 && hasMins && !result.base.never && (
                      <p className="rounded-xl bg-[var(--pen)]/15 px-3 py-2 text-sm font-semibold text-[var(--pen)]">
                        {fill(L.saves, {
                          saved: money(result.base.interest - result.plan.interest),
                          months: fmt(result.base.months - result.plan.months),
                        })}
                      </p>
                    )}

                    {open.length > 1 && (
                      <div>
                        <p className="mb-1 text-xs font-semibold opacity-70">{L.order}</p>

                        <ol className="space-y-1">
                          {result.plan.cleared.map((item, index) => {
                            const debt = debts.find((d) => d.id === item.id);

                            return (
                              <li key={item.id} className="flex justify-between gap-3 text-sm">
                                <span className="min-w-0 truncate">
                                  <span className="font-hand text-lg text-[var(--pen)]">
                                    {fmt(index + 1)}.
                                  </span>{" "}
                                  {debt?.emoji} {debt?.name}
                                </span>

                                <span className="shrink-0 font-semibold">
                                  {fill(L.inMonths, { n: fmt(item.month) })}
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    )}
                  </div>
                )
              )}

              <div>
                <button
                  type="button"
                  onClick={() => {
                    const count = syncReminders(alloc);

                    setRemindMsg(count > 0 ? "on" : "needDay");
                  }}
                  className={plainButton}
                >
                  {L.remind}
                </button>

                {remindMsg && (
                  <p role="status" className="mt-2 text-sm font-semibold text-[var(--pen)]">
                    {remindMsg === "on" ? L.remindOn : L.remindNeed}
                  </p>
                )}
              </div>
            </section>
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

      {sheet && (sheet === "new" || editing) && (
        <DebtSheet
          key={sheet}
          debt={editing}
          language={lang}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}
