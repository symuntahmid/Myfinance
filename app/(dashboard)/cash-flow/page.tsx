"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import CashFlowSankey, {
  type SankeyNode,
} from "@/app/components/CashFlowSankey";
import {
  buildCashFlow,
  type CashFlow,
  type CashFlowRange,
} from "@/app/data/cashFlow";
import { quickExpenseCategories } from "@/app/data/quickAdd";

const RANGES: { id: CashFlowRange; key: "cfThisMonth" | "cfLastMonth" | "cf3Months" | "cfYear" }[] = [
  { id: "thisMonth", key: "cfThisMonth" },
  { id: "lastMonth", key: "cfLastMonth" },
  { id: "threeMonths", key: "cf3Months" },
  { id: "year", key: "cfYear" },
];

const SOURCE_COLORS = ["#006A4E", "#2E8B6A", "#5BAE8E", "#8CC9B0", "#B7DCCB"];

const EXPENSE_COLORS = [
  "#D6322B",
  "#E0772F",
  "#C8962E",
  "#7A5AC8",
  "#3B82B6",
  "#8A8F98",
];

const INVEST_COLOR = "#0B3B2E";
const SAVED_COLOR = "#E4B85A";
const SHORT_COLOR = "#B7BDB5";

export default function CashFlowPage() {
  const { t, language } = useLanguage();

  const [range, setRange] = useState<CashFlowRange>("thisMonth");
  const [flow, setFlow] = useState<CashFlow | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setFlow(buildCashFlow(range));

    refresh();

    const events = [
      "transactionsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, [range]);

  const model = useMemo(() => {
    if (!flow) return null;

    const nameOf = (raw: string, expense: boolean) => {
      if (raw === "__other") return t("cfOther");

      if (expense) {
        const found = quickExpenseCategories.find(
          (item) => item.value === raw
        );

        if (found) return `${found.emoji} ${found[language]}`;
      }

      return raw;
    };

    const left: SankeyNode[] = flow.sources.map((item, index) => ({
      id: `src:${item.key}`,
      label: nameOf(item.raw, false),
      amountText: formatCurrency(item.amount),
      value: item.amount,
      color: SOURCE_COLORS[index % SOURCE_COLORS.length],
    }));

    if (flow.shortfall > 0) {
      left.push({
        id: "short",
        label: t("cfShortfall"),
        amountText: formatCurrency(flow.shortfall),
        value: flow.shortfall,
        color: SHORT_COLOR,
      });
    }

    const right: SankeyNode[] = flow.expenses.map((item, index) => ({
      id: `exp:${item.key}`,
      label: nameOf(item.raw, true),
      amountText: formatCurrency(item.amount),
      value: item.amount,
      color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
    }));

    if (flow.invested > 0) {
      right.push({
        id: "inv",
        label: t("cfInvested"),
        amountText: formatCurrency(flow.invested),
        value: flow.invested,
        color: INVEST_COLOR,
      });
    }

    if (flow.saved > 0) {
      right.push({
        id: "sav",
        label: t("cfSaved"),
        amountText: formatCurrency(flow.saved),
        value: flow.saved,
        color: SAVED_COLOR,
      });
    }

    return { left, right };
  }, [flow, language, t]);

  if (!flow || !model) {
    return <div className="h-72 animate-pulse rounded-3xl bg-[var(--card)]" />;
  }

  const empty = flow.totalIn <= 0;
  const spent = flow.expenses.reduce((sum, item) => sum + item.amount, 0);
  const earned = flow.sources.reduce((sum, item) => sum + item.amount, 0);
  const keptPercent =
    earned > 0 ? Math.round(((earned - spent - flow.invested) / earned) * 100) : 0;

  const picked = [...model.left, ...model.right].find(
    (node) => node.id === selected
  );

  const pct = (value: number) =>
    Math.round((value / Math.max(flow.totalIn, 1)) * 100);

  const tiles = [
    { label: t("cfIncome"), value: earned, color: SOURCE_COLORS[0] },
    { label: t("cfSpent"), value: spent, color: EXPENSE_COLORS[0] },
    { label: t("cfInvested"), value: flow.invested, color: INVEST_COLOR },
    { label: t("cfSaved"), value: flow.saved, color: SAVED_COLOR },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {t("cfTitle")}
        </h1>

        <p className="mt-0.5 text-sm text-[var(--muted)]">
          {t("cfSubtitle")}
        </p>
      </div>

      {/* RANGE */}
      <div className="grid grid-cols-4 gap-1.5">
        {RANGES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setRange(item.id);
              setSelected(null);
            }}
            className={`truncate rounded-full px-1 py-1.5 text-xs font-semibold transition ${
              range === item.id
                ? "bg-[var(--forest)] text-[var(--on-forest)]"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)]"
            }`}
          >
            {t(item.key)}
          </button>
        ))}
      </div>

      {/* TOTALS */}
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-3"
          >
            <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: tile.color }}
              />
              {tile.label}
            </p>

            <p className="mt-0.5 truncate text-lg font-bold">
              {formatCurrency(tile.value)}
            </p>
          </div>
        ))}
      </div>

      {/* FLOW */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-3">
        {empty ? (
          <p className="px-2 py-10 text-center text-sm text-[var(--muted)]">
            {t("cfEmpty")}
          </p>
        ) : (
          <>
            <CashFlowSankey
              left={model.left}
              right={model.right}
              total={flow.totalIn}
              hubLabel={t("cfIn")}
              selected={selected}
              onSelect={setSelected}
            />

            <div className="mt-2 min-h-[44px] rounded-2xl bg-[var(--background)] px-3.5 py-2.5 text-sm">
              {picked ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{picked.label}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {t("cfShare", { percent: pct(picked.value) })}
                    </p>
                  </div>

                  <p className="shrink-0 text-base font-bold">
                    {picked.amountText}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">
                  {flow.shortfall > 0
                    ? t("cfOverspent", { amount: formatCurrency(flow.shortfall) })
                    : t("cfKept", { percent: Math.max(keptPercent, 0) })}{" "}
                  {t("cfTapHint")}
                </p>
              )}
            </div>
          </>
        )}
      </section>

      {/* RANKED LIST */}
      {!empty && (
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-3 text-sm font-bold">{t("cfOut")}</h2>

          <ul className="space-y-3">
            {model.right.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelected(selected === node.id ? null : node.id)
                  }
                  className="block w-full text-left"
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{node.label}</span>

                    <span className="shrink-0 text-xs text-[var(--muted)]">
                      {node.amountText} · {pct(node.value)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[var(--background)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(pct(node.value), 2)}%`,
                        background: node.color,
                      }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
