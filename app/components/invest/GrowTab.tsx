"use client";

import { useEffect, useState } from "react";

import NumField from "./NumField";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  compoundSeries,
  doublingYears,
  inTodaysMoney,
} from "@/app/data/investMath";

const KEY = "myfinance-invest-grow";

const DEFAULTS = {
  start: "50000",
  monthly: "5000",
  rate: "8",
  years: "20",
  inflation: "6",
};

type Values = typeof DEFAULTS;

const n = (v: string) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);

export default function GrowTab() {
  const { t, language } = useLanguage();

  const [v, setV] = useState<Values>(DEFAULTS);

  useEffect(() => {
    const load = () => {
      try {
        setV({ ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") });
      } catch {
        /* keep defaults */
      }
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

  const years = Math.min(Math.max(Math.round(n(v.years)), 1), 60);
  const rate = n(v.rate);
  const series = compoundSeries(n(v.start), n(v.monthly), rate, years);
  const last = series[series.length - 1];
  const earned = last.value - last.invested;

  const later = Math.max(years - 5, 0);
  const waited = later > 0 ? compoundSeries(n(v.start), n(v.monthly), rate, later) : null;
  const lostByWaiting = waited
    ? last.value - waited[waited.length - 1].value
    : 0;

  const doubles = doublingYears(rate);
  const money = (x: number) => formatCurrency(Math.round(x));
  const locale = language === "bn" ? "bn-BD" : "en-US";

  const max = Math.max(...series.map((p) => p.value), 1);
  const W = series.length * 12;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{t("ivGrowTitle")}</h2>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumField label={t("ivStart")} value={v.start} onChange={(x) => set({ start: x })} />
          <NumField label={t("ivMonthly")} value={v.monthly} onChange={(x) => set({ monthly: x })} />
          <NumField label={t("ivRate")} value={v.rate} onChange={(x) => set({ rate: x })} />
          <NumField label={t("ivYears")} value={v.years} onChange={(x) => set({ years: x })} />
          <NumField label={t("ivInflation")} value={v.inflation} onChange={(x) => set({ inflation: x })} />
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">{t("ivExample")}</p>
      </section>

      <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
        <p className="text-sm opacity-80">{t("ivFinal")}</p>

        <p className="mt-1 text-4xl font-bold tracking-tight">{money(last.value)}</p>

        <p className="mt-1 text-xs opacity-75">
          {t("ivReal", { amount: money(inTodaysMoney(last.value, n(v.inflation), years)) })}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
          <div>
            <p className="text-xs opacity-70">{t("ivPutIn")}</p>
            <p className="text-base font-semibold">{money(last.invested)}</p>
          </div>

          <div>
            <p className="text-xs opacity-70">{t("ivEarned")}</p>
            <p className="text-base font-semibold text-[var(--gold)]">{money(earned)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{t("ivChart")}</h2>

        <svg
          viewBox={`0 0 ${W} 100`}
          preserveAspectRatio="none"
          className="mt-3 h-36 w-full"
          role="img"
          aria-label={t("ivChart")}
        >
          {series.map((p, i) => {
            const total = (p.value / max) * 96;
            const put = (p.invested / max) * 96;

            return (
              <g key={p.year}>
                <rect x={i * 12 + 1.5} y={100 - total} width={9} height={Math.max(total, 1)} rx={2} fill="#C8962E" />
                <rect x={i * 12 + 1.5} y={100 - put} width={9} height={Math.max(put, 1)} rx={2} fill="#2E8B6A" />
              </g>
            );
          })}
        </svg>

        <div className="mt-2 flex items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2E8B6A]" />
            {t("ivPutIn")}
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C8962E]" />
            {t("ivEarned")}
          </span>

          <span className="ml-auto">
            {(0).toLocaleString(locale)}–{years.toLocaleString(locale)} {t("ivYears")}
          </span>
        </div>
      </section>

      {lostByWaiting > 0 && (
        <section className="rounded-2xl bg-[var(--gold-soft)] p-4">
          <h2 className="text-sm font-bold">{t("ivEarlyTitle")}</h2>

          <p className="mt-1 text-sm">{t("ivEarlyText", { amount: money(lostByWaiting) })}</p>
        </section>
      )}

      {doubles !== null && (
        <p className="px-1 text-sm text-[var(--muted)]">
          {t("ivDouble", {
            rate: rate.toLocaleString(locale),
            n: doubles.toLocaleString(locale),
          })}
        </p>
      )}
    </div>
  );
}
