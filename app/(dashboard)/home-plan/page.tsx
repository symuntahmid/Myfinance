"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, CalendarCheck, Target } from "lucide-react";

import { Field } from "@/app/components/PaperUI";
import { HouseScene, houseStage } from "@/app/components/home/HouseArt";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { addGoal, getGoals } from "@/app/data/goals";
import { getTransactions } from "@/app/data/transactions";
import {
  DTI,
  cashNeeded,
  futurePrice,
  getHomePlan,
  maxLoan,
  monthlyNeeded,
  num,
  rentInvested,
  rentPaid,
  saveHomePlan,
  type HomeAnswer,
  type HomePlan,
} from "@/app/data/homePlan";

const TEXT = {
  en: {
    title: "Home Plan",
    tabs: ["Target", "Save", "Afford"],
    intro: [
      "Pick a home price and when you want it. Drag to try different ones.",
      "This is what to put aside each month.",
      "Check what your income can safely carry.",
    ],
    next: "Next: {t}",
    in: "In {n} years",
    heroLine: "for {n} years. Cash needed on the day: {x}",
    noHero: "Drag the sliders to see your monthly amount.",
    price: "Home price today",
    years: "Buy in",
    more: "More settings",
    rentTitle: "What rent costs you",
    homeProgress: "Your home is {p}% built",
    ready: "Your home fund is ready",
  },
  bn: {
    title: "বাড়ির পরিকল্পনা",
    tabs: ["লক্ষ্য", "জমানো", "সামর্থ্য"],
    intro: [
      "বাড়ির দাম আর কবে নিতে চান বেছে নিন। টেনে দেখুন।",
      "প্রতি মাসে এই টাকা আলাদা করে রাখুন।",
      "আপনার আয়ে নিরাপদে কত সামলানো যায় দেখুন।",
    ],
    next: "পরের ধাপ: {t}",
    in: "{n} বছর পরে",
    heroLine: "{n} বছর ধরে। বাড়ির দিনে লাগবে {x}",
    noHero: "স্লাইডার টেনে মাসিক অংক দেখুন।",
    price: "আজকের বাড়ির দাম",
    years: "কত বছরে কিনবেন",
    more: "আরও সেটিংস",
    rentTitle: "ভাড়া আপনার কত খরচ করছে",
    homeProgress: "আপনার বাড়ি {p}% তৈরি",
    ready: "আপনার বাড়ির তহবিল তৈরি",
  },
} as const;

const fill = (text: string, vars: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");

const TAB_ICONS = [Target, Banknote, CalendarCheck];

const slider = "w-full accent-[var(--pen)]";
const card = "space-y-3 rounded-3xl border-2 border-[var(--ink)]/10 bg-white/50 p-4";
const moreBox = "rounded-2xl border-2 border-[var(--ink)]/10 bg-white/40 p-3";
const moreTitle = "cursor-pointer text-sm font-bold text-[var(--pen)]";

export default function HomePlanPage() {
  const { t, language } = useLanguage();
  const lang: "en" | "bn" = language === "bn" ? "bn" : "en";
  const L = TEXT[lang];

  const [plan, setPlan] = useState<HomePlan | null>(null);
  const [slide, setSlide] = useState(0);
  const [avgIncome, setAvgIncome] = useState(0);
  const [tab, setTab] = useState<0 | 1 | 2 | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const load = () => {
      const since = Date.now() - 90 * 86_400_000;
      const income = getTransactions()
        .filter(
          (item) =>
            item.type === "Income" && new Date(item.date).getTime() >= since
        )
        .reduce((sum, item) => sum + item.amount, 0);

      const current = getHomePlan();
      const goal = current.goalId
        ? getGoals().find((g) => g.id === current.goalId)
        : undefined;

      setAvgIncome(Math.round(income / 3));
      setPlan(current);
      setProgress(
        goal && goal.targetAmount > 0
          ? Math.round((goal.savedAmount / goal.targetAmount) * 100)
          : 0
      );
    };

    load();

    window.addEventListener("goalsUpdated", load);
    window.addEventListener("accountsUpdated", load);

    return () => {
      window.removeEventListener("goalsUpdated", load);
      window.removeEventListener("accountsUpdated", load);
    };
  }, []);

  const update = (patch: Partial<HomePlan>) =>
    setPlan((current) => {
      if (!current) return current;

      const next = { ...current, ...patch };

      saveHomePlan(next);

      return next;
    });

  const rent = plan ? num(plan.rent) : 0;
  const hike = plan ? num(plan.hike) : 0;
  const ret = plan ? num(plan.ret) : 0;
  const buyYears = plan ? Math.max(1, Math.round(num(plan.buyYears))) : 1;
  const income = plan ? num(plan.income) || avgIncome : 0;

  const calc = useMemo(() => {
    if (!plan) return null;

    const price = num(plan.price);
    const cash = cashNeeded(
      price,
      num(plan.propInflation),
      buyYears,
      num(plan.down),
      num(plan.reg)
    );
    const emi = income * DTI;
    const loan = maxLoan(emi, num(plan.loanRate), Math.max(1, num(plan.tenor)));
    const safePrice = loan / (1 - Math.min(num(plan.down), 90) / 100);
    const priceThen = futurePrice(price, num(plan.propInflation), buyYears);

    return {
      cash,
      priceThen,
      monthly: monthlyNeeded(cash, ret, buyYears),
      monthlyBank: monthlyNeeded(cash, 4, buyYears),
      emi,
      loan,
      safePrice,
    };
  }, [plan, buyYears, ret, income]);

  if (!plan || !calc) return null;

  const money = (value: number) => formatCurrency(Math.round(value));
  const fmt = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const price = num(plan.price) || 6_000_000;
  const priceMax = Math.max(30_000_000, price);
  const stage = houseStage(progress);
  const tabNow: 0 | 1 | 2 = tab ?? (plan.goalId ? 1 : 0);

  const story = [
    t("hpStory1", { rent: formatCurrency(15000) }),
    t("hpStory2", { total: formatCurrency(15000 * 12 * 20) }),
    t("hpStory3"),
  ];

  const inStory = plan.answer === null;

  const answer = (value: HomeAnswer) => update({ answer: value });

  const makeGoal = () => {
    const id = Date.now().toString();
    const end = new Date();

    end.setFullYear(end.getFullYear() + buyYears);

    addGoal({
      id,
      title: t("hpGoalTitle"),
      emoji: "🏠",
      targetAmount: Math.ceil(calc.cash),
      savedAmount: 0,
      targetDate: end.toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    });

    update({ goalId: id });
  };

  const bigButton =
    "w-full rounded-full bg-[var(--pen)] px-5 py-3 text-base font-bold text-white transition active:scale-[0.98]";
  const plainButton =
    "w-full rounded-full border-2 border-[var(--ink)]/20 bg-white/70 px-5 py-3 text-base font-bold transition active:scale-[0.98]";

  const homeBack = (
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

      {inStory && slide < story.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-4">
          <div className="flex gap-1.5">
            {story.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= slide ? "bg-[var(--pen)]" : "bg-[var(--ink)]/15"
                }`}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-xs">
            <HouseScene
              stage={[0, 1, 3][slide] as 0 | 1 | 3}
              className="overflow-hidden rounded-2xl"
            />
          </div>

          <p className="font-hand text-3xl leading-snug text-[var(--pen)]">
            <span className="hl">{story[slide]}</span>
          </p>

          <button type="button" onClick={() => setSlide(slide + 1)} className={bigButton}>
            {t("hpNext")}
          </button>
        </div>
      )}

      {/* QUESTION */}

      {inStory && slide >= story.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-4">
          <div className="mx-auto w-full max-w-xs">
            <HouseScene stage={2} className="overflow-hidden rounded-2xl" />
          </div>

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("hpAsk")}</span>
          </p>

          <div className="space-y-3">
            <button type="button" onClick={() => answer("own")} className={plainButton}>
              {t("hpOwn")}
            </button>

            <button type="button" onClick={() => answer("rent")} className={bigButton}>
              {t("hpRentAns")}
            </button>

            <button type="button" onClick={() => answer("family")} className={plainButton}>
              {t("hpFamily")}
            </button>
          </div>
        </div>
      )}

      {/* OWNER */}

      {plan.answer === "own" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6">
          <div className="mx-auto w-full max-w-xs">
            <HouseScene stage={4} className="overflow-hidden rounded-2xl" />
          </div>

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("hpOwnReply")}</span>
          </p>

          <button type="button" onClick={() => update({ answer: null })} className={bigButton}>
            {t("hpRedo")}
          </button>

          {homeBack}
        </div>
      )}

      {/* THE PLAN: three steps, one job each */}

      {(plan.answer === "rent" || plan.answer === "family") && (
        <div className="space-y-3">
          <h1 className="font-hand text-3xl text-[var(--pen)]">
            <span className="hl">{L.title}</span>
          </h1>

          <section className="overflow-hidden rounded-3xl border-2 border-[var(--ink)]/10 bg-white/50">
            <HouseScene stage={stage} compact />

            <div className="space-y-1 px-4 py-3">
              {calc.monthly > 0 ? (
                <>
                  <p className="text-xs opacity-70">{t("hpMonthly")}</p>

                  <p className="font-hand text-4xl leading-none text-[var(--pen)]">
                    {money(calc.monthly)}
                  </p>

                  <p className="text-xs opacity-70">
                    {fill(L.heroLine, { n: fmt(buyYears), x: money(calc.cash) })}
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold">{L.noHero}</p>
              )}

              {plan.goalId && (
                <p className="text-xs font-semibold text-[var(--pen)]">
                  {progress >= 100 ? L.ready : fill(L.homeProgress, { p: fmt(progress) })}
                </p>
              )}
            </div>
          </section>

          <nav
            aria-label={L.title}
            className="grid grid-cols-3 gap-1 rounded-3xl bg-[var(--ink)]/10 p-1"
          >
            {TAB_ICONS.map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={tabNow === i}
                onClick={() => setTab(i as 0 | 1 | 2)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-bold ${
                  tabNow === i ? "bg-[var(--pen)] text-white" : ""
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {L.tabs[i]}
              </button>
            ))}
          </nav>

          <p className="text-sm font-semibold">{L.intro[tabNow]}</p>

          {/* 1 TARGET */}

          {tabNow === 0 && (
            <section className="space-y-4">
              <div className={card}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold">{L.price}</p>
                  <p className="font-hand text-2xl text-[var(--pen)]">{money(price)}</p>
                </div>

                <input
                  type="range"
                  min={1_000_000}
                  max={priceMax}
                  step={100_000}
                  value={price}
                  aria-label={L.price}
                  onChange={(e) => update({ price: e.target.value })}
                  className={slider}
                />

                <div className="flex items-baseline justify-between gap-3 pt-1">
                  <p className="text-sm font-semibold">{L.years}</p>
                  <p className="font-hand text-2xl text-[var(--pen)]">
                    {t("hpNYears", { n: fmt(buyYears) })}
                  </p>
                </div>

                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={Math.min(buyYears, 20)}
                  aria-label={L.years}
                  onChange={(e) => update({ buyYears: e.target.value })}
                  className={slider}
                />
              </div>

              <div className={card}>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">{t("hpFuturePrice")}</span>
                  <span className="font-bold">{money(calc.priceThen)}</span>
                </div>

                <div>
                  <p className="text-sm opacity-70">{t("hpCashNeeded")}</p>

                  <p className="font-hand text-4xl text-[var(--pen)]">
                    <span className="hl">{money(calc.cash)}</span>
                  </p>
                </div>
              </div>

              <details className={moreBox}>
                <summary className={moreTitle}>{L.more}</summary>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field
                    label={t("hpPropInfl")}
                    value={plan.propInflation}
                    onChange={(value) => update({ propInflation: value })}
                  />

                  <Field
                    label={t("hpDown")}
                    value={plan.down}
                    onChange={(value) => update({ down: value })}
                  />

                  <Field
                    label={t("hpReg")}
                    value={plan.reg}
                    onChange={(value) => update({ reg: value })}
                  />
                </div>
              </details>
            </section>
          )}

          {/* 2 SAVE */}

          {tabNow === 1 && (
            <section className="space-y-4">
              <div className={card}>
                <div>
                  <p className="text-sm opacity-70">{t("hpMonthly")}</p>

                  <p className="font-hand text-4xl text-[var(--pen)]">
                    <span className="hl">{money(calc.monthly)}</span>
                  </p>
                </div>

                <p className="text-xs opacity-70">
                  {t("hpIfBank", { amount: money(calc.monthlyBank) })}
                </p>

                <p className="rounded-xl bg-[var(--paper)] px-3 py-2 text-sm">
                  {buyYears < 2 ? t("hpBucketShort") : t("hpBucketLong")}
                </p>

                {plan.goalId ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[var(--pen)]">
                      ✓ {t("hpGoalMade")}
                    </span>

                    <Link
                      href="/goals"
                      className="text-sm font-semibold text-[var(--pen)] underline"
                    >
                      {t("hpSeeGoals")}
                    </Link>
                  </div>
                ) : (
                  <button type="button" onClick={makeGoal} className={bigButton}>
                    {t("hpMakeGoal")}
                  </button>
                )}
              </div>

              <details className={moreBox}>
                <summary className={moreTitle}>{L.rentTitle}</summary>

                <div className="mt-3 space-y-3">
                  <p className="text-xs opacity-70">{t("hpBurnHint")}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label={t("hpRentLabel")}
                      value={plan.rent}
                      onChange={(value) => update({ rent: value })}
                    />

                    <Field
                      label={t("hpHike")}
                      value={plan.hike}
                      onChange={(value) => update({ hike: value })}
                    />
                  </div>

                  {rent > 0 && (
                    <div className="overflow-hidden rounded-2xl bg-[var(--paper)]">
                      <div className="grid grid-cols-3 px-3 py-2 text-xs font-semibold opacity-70">
                        <span />
                        <span>{t("hpPaid")}</span>
                        <span>{t("hpCouldBe")}</span>
                      </div>

                      {[5, 10, 20].map((years) => (
                        <div
                          key={years}
                          className="grid grid-cols-3 gap-1 border-t border-[var(--ink)]/10 px-3 py-2 text-sm"
                        >
                          <span className="font-hand text-lg text-[var(--pen)]">
                            {t("hpNYears", { n: fmt(years) })}
                          </span>

                          <span className="font-bold">{money(rentPaid(rent, hike, years))}</span>

                          <span className="font-bold text-[var(--pen)]">
                            {money(rentInvested(rent, hike, ret, years))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>

              <details className={moreBox}>
                <summary className={moreTitle}>{L.more}</summary>

                <div className="mt-3">
                  <Field
                    label={t("hpReturn")}
                    value={plan.ret}
                    onChange={(value) => update({ ret: value })}
                  />
                </div>
              </details>
            </section>
          )}

          {/* 3 AFFORD */}

          {tabNow === 2 && (
            <section className="space-y-4">
              <div className={card}>
                <Field
                  label={t("hpIncome")}
                  value={plan.income || (avgIncome ? String(avgIncome) : "")}
                  onChange={(value) => update({ income: value })}
                />

                {income > 0 ? (
                  <>
                    <div className="space-y-1 text-sm">
                      {[
                        [t("hpMaxEmi"), calc.emi],
                        [t("hpMaxLoan"), calc.loan],
                        [t("hpMaxPrice"), calc.safePrice],
                      ].map(([label, value]) => (
                        <div key={label as string} className="flex justify-between">
                          <span className="opacity-70">{label}</span>
                          <span className="font-bold">{money(value as number)}</span>
                        </div>
                      ))}
                    </div>

                    <p
                      className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                        calc.priceThen <= calc.safePrice
                          ? "bg-[var(--pen)]/15 text-[var(--pen)]"
                          : "bg-[var(--mark)]/60"
                      }`}
                    >
                      {calc.priceThen <= calc.safePrice
                        ? t("hpSafeYes")
                        : t("hpSafeNo", { amount: money(calc.safePrice) })}
                    </p>
                  </>
                ) : (
                  <p className="text-sm opacity-70">{t("hpNeedIncome")}</p>
                )}
              </div>

              <details className={moreBox}>
                <summary className={moreTitle}>{L.more}</summary>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field
                    label={t("hpLoanRate")}
                    value={plan.loanRate}
                    onChange={(value) => update({ loanRate: value })}
                  />

                  <Field
                    label={t("hpTenor")}
                    value={plan.tenor}
                    onChange={(value) => update({ tenor: value })}
                  />
                </div>
              </details>
            </section>
          )}

          {tabNow < 2 && (
            <button
              type="button"
              onClick={() => setTab((tabNow + 1) as 1 | 2)}
              className={bigButton}
            >
              {fill(L.next, { t: L.tabs[tabNow + 1] })}
            </button>
          )}

          <p className="text-center text-xs opacity-60">{t("hpDisclaimer")}</p>

          <button
            type="button"
            onClick={() => {
              setSlide(0);
              update({ answer: null });
            }}
            className="block w-full text-center text-sm font-semibold text-[var(--pen)]"
          >
            {t("hpRedo")}
          </button>

          {homeBack}
        </div>
      )}
    </div>
  );
}
