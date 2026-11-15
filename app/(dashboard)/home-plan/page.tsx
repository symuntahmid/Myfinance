"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Field, Pill, Section } from "@/app/components/PaperUI";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { addGoal } from "@/app/data/goals";
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

export default function HomePlanPage() {
  const { t, language } = useLanguage();

  const [plan, setPlan] = useState<HomePlan | null>(null);
  const [slide, setSlide] = useState(0);
  const [avgIncome, setAvgIncome] = useState(0);

  useEffect(() => {
    const load = () => {
      const since = Date.now() - 90 * 86_400_000;
      const income = getTransactions()
        .filter(
          (item) =>
            item.type === "Income" && new Date(item.date).getTime() >= since
        )
        .reduce((sum, item) => sum + item.amount, 0);

      setAvgIncome(Math.round(income / 3));
      setPlan(getHomePlan());
    };

    load();
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
        <div className="flex min-h-[70vh] flex-col justify-between">
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

          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{story[slide]}</span>
          </p>

          <Pill onClick={() => setSlide(slide + 1)}>{t("hpNext")}</Pill>
        </div>
      )}

      {/* QUESTION */}

      {inStory && slide >= story.length && (
        <div className="flex min-h-[70vh] flex-col justify-between gap-6">
          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("hpAsk")}</span>
          </p>

          <div className="space-y-3">
            <Pill tone="plain" onClick={() => answer("own")}>
              {t("hpOwn")}
            </Pill>

            <Pill onClick={() => answer("rent")}>{t("hpRentAns")}</Pill>

            <Pill onClick={() => answer("family")}>{t("hpFamily")}</Pill>
          </div>
        </div>
      )}

      {/* OWNER */}

      {plan.answer === "own" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6">
          <p className="font-hand text-4xl leading-snug text-[var(--pen)]">
            <span className="hl">{t("hpOwnReply")}</span>
          </p>

          <Pill onClick={() => update({ answer: null })}>{t("hpRedo")}</Pill>

          {homeBack}
        </div>
      )}

      {/* THE PLAN */}

      {(plan.answer === "rent" || plan.answer === "family") && (
        <div className="space-y-4">
          <header>
            <h1 className="font-hand text-4xl text-[var(--pen)]">
              <span className="hl">{t("hpPlanTitle")}</span>
            </h1>

            <p className="mt-1 text-sm opacity-70">{t("hpPlanSub")}</p>
          </header>

          {/* 1. Rent burn */}

          <Section title={t("hpBurnTitle")} hint={t("hpBurnHint")}>
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

                    <span className="font-bold">
                      {money(rentPaid(rent, hike, years))}
                    </span>

                    <span className="font-bold text-[var(--pen)]">
                      {money(rentInvested(rent, hike, ret, years))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 2. Real target */}

          <Section title={t("hpTargetTitle")} hint={t("hpTargetHint")}>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label={t("hpPrice")}
                value={plan.price}
                onChange={(value) => update({ price: value })}
              />

              <Field
                label={t("hpBuyIn")}
                value={plan.buyYears}
                onChange={(value) => update({ buyYears: value })}
              />

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

            <div className="flex items-baseline justify-between text-sm">
              <span className="opacity-70">{t("hpFuturePrice")}</span>
              <span className="font-bold">{money(calc.priceThen)}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm opacity-70">{t("hpCashNeeded")}</span>

              <span className="font-hand text-3xl text-[var(--pen)]">
                <span className="hl">{money(calc.cash)}</span>
              </span>
            </div>
          </Section>

          {/* 3. Monthly saving */}

          <Section title={t("hpSaveTitle")}>
            <Field
              label={t("hpReturn")}
              value={plan.ret}
              onChange={(value) => update({ ret: value })}
            />

            <div className="flex items-baseline justify-between">
              <span className="text-sm opacity-70">{t("hpMonthly")}</span>

              <span className="font-hand text-3xl text-[var(--pen)]">
                <span className="hl">{money(calc.monthly)}</span>
              </span>
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
              <Pill onClick={makeGoal}>{t("hpMakeGoal")}</Pill>
            )}
          </Section>

          {/* 4. Safe zone */}

          <Section title={t("hpSafeTitle")} hint={t("hpSafeHint")}>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label={t("hpIncome")}
                value={plan.income || (avgIncome ? String(avgIncome) : "")}
                onChange={(value) => update({ income: value })}
              />

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
          </Section>

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
