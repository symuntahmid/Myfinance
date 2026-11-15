"use client";

import { useEffect, useState } from "react";

import NumField from "./NumField";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getTransactions } from "@/app/data/transactions";
import { getPortfolioSummary } from "@/app/data/investments";
import { retirementPlan } from "@/app/data/investMath";

const KEY = "myfinance-invest-retire";

const DEFAULTS = {
  age: "30",
  retireAge: "60",
  lifeAge: "85",
  costNow: "",
  saved: "",
  monthly: "5000",
  inflation: "6",
  returnBefore: "9",
  returnAfter: "6",
};

type Values = typeof DEFAULTS;

const n = (v: string) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);

export default function RetireTab() {
  const { t, language } = useLanguage();

  const [v, setV] = useState<Values>(DEFAULTS);
  const [avgSpend, setAvgSpend] = useState(0);
  const [portfolio, setPortfolio] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        setV({ ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") });
      } catch {
        /* keep defaults */
      }

      const since = Date.now() - 90 * 86_400_000;
      const spent = getTransactions()
        .filter((x) => x.type === "Expense" && new Date(x.date).getTime() >= since)
        .reduce((sum, x) => sum + x.amount, 0);

      setAvgSpend(Math.round(spent / 3));
      setPortfolio(Math.round(getPortfolioSummary().current));
    };

    load();
  }, []);

  const set = (patch: Partial<Values>) =>
    setV((cur) => {
      const next = { ...cur, ...patch };

      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage may be blocked */
      }

      return next;
    });

  const costNow = n(v.costNow) || avgSpend;
  const saved = n(v.saved) || portfolio;

  const r = retirementPlan({
    age: n(v.age),
    retireAge: n(v.retireAge),
    lifeAge: n(v.lifeAge),
    costNow,
    saved,
    monthly: n(v.monthly),
    inflation: n(v.inflation),
    returnBefore: n(v.returnBefore),
    returnAfter: n(v.returnAfter),
  });

  const money = (x: number) => formatCurrency(Math.round(x));
  const locale = language === "bn" ? "bn-BD" : "en-US";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{t("ivRetTitle")}</h2>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <NumField label={t("ivAge")} value={v.age} onChange={(x) => set({ age: x })} />
          <NumField label={t("ivRetireAge")} value={v.retireAge} onChange={(x) => set({ retireAge: x })} />
          <NumField label={t("ivLifeTo")} value={v.lifeAge} onChange={(x) => set({ lifeAge: x })} />
        </div>

        <div className="mt-3 grid grid-cols-2 items-end gap-3">
          <NumField
            label={t("ivCostNow")}
            value={v.costNow || (avgSpend ? String(avgSpend) : "")}
            onChange={(x) => set({ costNow: x })}
          />

          <NumField
            label={t("ivSaved")}
            value={v.saved || (portfolio ? String(portfolio) : "")}
            onChange={(x) => set({ saved: x })}
          />

          <NumField label={t("ivSavingNow")} value={v.monthly} onChange={(x) => set({ monthly: x })} />
          <NumField label={t("ivInflation")} value={v.inflation} onChange={(x) => set({ inflation: x })} />
          <NumField label={t("ivRetReturn")} value={v.returnBefore} onChange={(x) => set({ returnBefore: x })} />
          <NumField label={t("ivPostReturn")} value={v.returnAfter} onChange={(x) => set({ returnAfter: x })} />
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">{t("ivExample")}</p>
      </section>

      {!r.valid ? (
        <p className="rounded-2xl bg-[var(--gold-soft)] p-4 text-sm font-semibold">
          {t("ivBadAges")}
        </p>
      ) : (
        <>
          <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm opacity-80">{t("ivNest")}</p>

              <p className="text-xs opacity-75">
                {t("ivYearsLeft", { n: r.yearsToGo.toLocaleString(locale) })}
              </p>
            </div>

            <p className="mt-1 text-4xl font-bold tracking-tight">{money(r.nest)}</p>

            <div className="mt-4 h-2 rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-[var(--gold)]"
                style={{ width: `${r.readyPct}%` }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold">
              {t("ivReady", { pct: r.readyPct.toLocaleString(locale) })}
            </p>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {[
              [t("ivNeedAtRet"), money(r.costThen)],
              [t("ivProjected"), money(r.projected)],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex justify-between gap-3 px-4 py-3 text-sm ${
                  index > 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                <span className="text-[var(--muted)]">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </section>

          <p
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              r.gap <= 0 ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--gold-soft)]"
            }`}
          >
            {r.gap <= 0
              ? t("ivOnTrack")
              : t("ivShort", { amount: money(r.gap), monthly: money(r.extraMonthly) })}
          </p>

          <p className="px-1 text-xs text-[var(--muted)]">{t("ivRetNote")}</p>
        </>
      )}
    </div>
  );
}
