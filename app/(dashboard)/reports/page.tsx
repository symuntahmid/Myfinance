"use client";

import PageLinks from "@/app/components/PageLinks";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import { completeTask } from "@/app/data/dailyJourney";
import { addXP } from "@/app/data/player";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import {
  buildMonthReport,
  monthKey,
  reportCsv,
  shiftMonth,
  type MonthReport,
} from "@/app/data/reportData";

const SHADES = ["#0B3B2E", "#2E8B6A", "#5BAE8E", "#C8962E", "#8CC9B0"];

const strip = (text: string) => text.replace(/^[^\p{L}\p{N}]+/u, "");

export default function ReportsPage() {
  const { t, language } = useLanguage();

  const thisMonth = monthKey(new Date());

  const [month, setMonth] = useState(thisMonth);
  const [, bump] = useState(0);

  useEffect(() => {
    // Opening the report counts as the daily "review" task, once.
    if (completeTask(2)) {
      addXP(10);
      window.dispatchEvent(new Event("dailyJourneyUpdated"));
    }

    const redraw = () => bump((v) => v + 1);
    const events = [
      "transactionsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, redraw));

    return () =>
      events.forEach((name) => window.removeEventListener(name, redraw));
  }, []);

  const report: MonthReport = buildMonthReport(month);
  const prev: MonthReport = buildMonthReport(shiftMonth(month, -1));

  const trend = Array.from({ length: 6 }, (_, i) => {
    const key = shiftMonth(month, i - 5);
    const r = buildMonthReport(key);

    return { key, kept: r.kept, has: r.hasData };
  });

  const locale = language === "bn" ? "bn-BD" : "en-GB";
  const num = (value: number) => value.toLocaleString(locale);

  const [y, m] = month.split("-").map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const labelOf = (raw: string) => {
    const found = quickExpenseCategories.find((c) => c.value === raw);

    return found ? `${found.emoji} ${found[language]}` : strip(raw);
  };

  const headline =
    report.keptPct === null
      ? t("rpNoIncome")
      : report.keptPct < 0
      ? t("rpOver")
      : t("rpKept", { pct: num(report.keptPct) });

  const pointsDelta =
    report.keptPct !== null && prev.keptPct !== null
      ? report.keptPct - prev.keptPct
      : null;

  const change = (now: number, before: number) =>
    before > 0 ? Math.round(((now - before) / before) * 100) : null;

  const tiles: {
    label: string;
    value: number;
    delta: number | null;
    goodWhenUp: boolean;
  }[] = [
    {
      label: t("rpEarned"),
      value: report.income,
      delta: change(report.income, prev.income),
      goodWhenUp: true,
    },
    {
      label: t("rpSpentLabel"),
      value: report.spent,
      delta: change(report.spent, prev.spent),
      goodWhenUp: false,
    },
    {
      label: t("rpInvestedLabel"),
      value: report.invested,
      delta: change(report.invested, prev.invested),
      goodWhenUp: true,
    },
  ];

  // Top four categories, the rest folded into "Other".
  const top = report.categories.slice(0, 4);
  const rest = report.categories.slice(4);
  const restAmount = rest.reduce((sum, c) => sum + c.amount, 0);
  const slices = [
    ...top.map((c) => ({ label: labelOf(c.raw), amount: c.amount, pct: c.pct })),
    ...(restAmount > 0
      ? [
          {
            label: t("rpOther"),
            amount: restAmount,
            pct: report.spent > 0 ? Math.round((restAmount / report.spent) * 100) : 0,
          },
        ]
      : []),
  ];

  const maxDay = Math.max(...report.daily, 1);
  const maxTrend = Math.max(...trend.map((x) => Math.abs(x.kept)), 1);

  const download = () => {
    const blob = new Blob(["﻿" + reportCsv(report)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `myfinance-${month}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{t("rpTitle")}</h1>

        <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--card)]">
          <button
            type="button"
            aria-label={t("txPrevMonth")}
            onClick={() => setMonth(shiftMonth(month, -1))}
            className="rounded-full p-2"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-[7.5rem] text-center text-sm font-semibold">
            {monthLabel}
          </span>

          <button
            type="button"
            aria-label={t("txNextMonth")}
            disabled={month >= thisMonth}
            onClick={() => setMonth(shiftMonth(month, 1))}
            className="rounded-full p-2 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <PageLinks
        items={[
          { href: "/insights", en: "Insights", bn: "ইনসাইট" },
          { href: "/cash-flow", en: "Cash flow", bn: "টাকার প্রবাহ" },
          { href: "/net-worth", en: "Net worth", bn: "মোট সম্পদ" },
        ]}
      />

      {/* The one sentence that matters */}

      <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
        <p className="text-2xl font-bold leading-snug">{headline}</p>

        {report.keptPct !== null && report.keptPct >= 0 && (
          <div className="mt-4 h-2 rounded-full bg-white/15">
            <div
              className="h-2 rounded-full bg-[var(--gold)]"
              style={{ width: `${Math.min(report.keptPct, 100)}%` }}
            />
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="opacity-80">
            {t("rpKeptOf", {
              kept: formatCurrency(report.kept < 0 ? 0 : report.kept),
              income: formatCurrency(report.income),
            })}
          </span>

          {pointsDelta !== null && pointsDelta !== 0 && (
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
              {pointsDelta > 0 ? "▲" : "▼"} {num(Math.abs(pointsDelta))}%{" "}
              {t("rpVsLast")}
            </span>
          )}
        </div>
      </section>

      {!report.hasData ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] py-10 text-center text-sm text-[var(--muted)]">
          {t("rpEmpty")}
        </p>
      ) : (
        <>
          {/* Three numbers */}

          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile) => {
              const good =
                tile.delta === null || tile.delta === 0
                  ? null
                  : tile.delta > 0 === tile.goodWhenUp;

              return (
                <div
                  key={tile.label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
                >
                  <p className="text-xs text-[var(--muted)]">{tile.label}</p>

                  <p className="mt-1 truncate text-base font-bold">
                    {formatCurrency(tile.value)}
                  </p>

                  {tile.delta !== null && tile.delta !== 0 && (
                    <p
                      className={`mt-0.5 text-[11px] font-semibold ${
                        good ? "text-[var(--success)]" : "text-[var(--sun)]"
                      }`}
                    >
                      {tile.delta > 0 ? "▲" : "▼"} {num(Math.abs(tile.delta))}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Where it went */}

          {slices.length > 0 && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <h2 className="text-sm font-bold">{t("rpWhere")}</h2>

              <div className="mt-3 flex h-3 overflow-hidden rounded-full">
                {slices.map((slice, index) => (
                  <span
                    key={slice.label}
                    style={{
                      width: `${Math.max(slice.pct, 2)}%`,
                      background: SHADES[index % SHADES.length],
                    }}
                  />
                ))}
              </div>

              <ul className="mt-3 space-y-2">
                {slices.map((slice, index) => (
                  <li
                    key={slice.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: SHADES[index % SHADES.length] }}
                    />

                    <span className="min-w-0 flex-1 truncate">{slice.label}</span>

                    <span className="text-xs text-[var(--muted)]">
                      {num(slice.pct)}%
                    </span>

                    <span className="w-24 text-right font-semibold">
                      {formatCurrency(slice.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Day by day */}

          {report.spent > 0 && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <h2 className="text-sm font-bold">{t("rpByDay")}</h2>

              <svg
                viewBox={`0 0 ${report.days * 10} 60`}
                preserveAspectRatio="none"
                className="mt-3 h-20 w-full"
                role="img"
                aria-label={t("rpByDay")}
              >
                {report.daily.map((value, index) => {
                  const height = value > 0 ? Math.max((value / maxDay) * 58, 3) : 1.5;

                  return (
                    <rect
                      key={index}
                      x={index * 10 + 1.5}
                      y={60 - height}
                      width={7}
                      height={height}
                      rx={2}
                      fill={
                        report.biggestDay?.day === index + 1
                          ? "#C8962E"
                          : value > 0
                          ? "#2E8B6A"
                          : "#D6DDD6"
                      }
                    />
                  );
                })}
              </svg>

              {report.biggestDay && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {t("rpBiggestDay", {
                    day: new Date(y, m - 1, report.biggestDay.day).toLocaleDateString(
                      locale,
                      { day: "numeric", month: "short" }
                    ),
                    amount: formatCurrency(report.biggestDay.amount),
                  })}
                </p>
              )}
            </section>
          )}

          {/* Quick facts */}

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="px-4 pt-4 text-sm font-bold">{t("rpFacts")}</h2>

            {[
              [
                t("rpBiggest"),
                report.biggest
                  ? `${labelOf(report.biggest.raw)} · ${formatCurrency(report.biggest.amount)}`
                  : "-",
              ],
              [t("rpAvgDay"), formatCurrency(Math.round(report.avgPerDay))],
              [t("rpNoSpend"), num(report.noSpendDays)],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex justify-between gap-3 px-4 py-3 text-sm ${
                  index === 0 ? "mt-1" : "border-t border-[var(--border)]"
                }`}
              >
                <span className="text-[var(--muted)]">{label}</span>
                <span className="truncate font-semibold">{value}</span>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Six months */}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{t("rpTrend")}</h2>

        <div className="mt-4 flex h-24 items-end gap-2">
          {trend.map((point) => {
            const height = point.has
              ? Math.max((Math.abs(point.kept) / maxTrend) * 100, 4)
              : 4;

            return (
              <div
                key={point.key}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span
                  className="w-full rounded-md"
                  style={{
                    height: `${height}%`,
                    background: !point.has
                      ? "#D6DDD6"
                      : point.kept < 0
                      ? "#E0772F"
                      : point.key === month
                      ? "#C8962E"
                      : "#2E8B6A",
                  }}
                />

                <span className="text-[10px] text-[var(--muted)]">
                  {new Date(
                    Number(point.key.slice(0, 4)),
                    Number(point.key.slice(5, 7)) - 1,
                    1
                  ).toLocaleDateString(locale, { month: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {report.hasData && (
        <button
          type="button"
          onClick={download}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] py-3 text-sm font-semibold"
        >
          <Download size={16} />
          {t("rpDownload")}
        </button>
      )}
    </div>
  );
}
