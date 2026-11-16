"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  buildFreedomPath,
  type FreedomPath,
  type PathStep,
  type StepId,
} from "@/app/data/freedomPath";
import {
  computeRule,
  setBucket,
  TARGETS,
  type Bucket,
  type RuleResult,
} from "@/app/data/budgetRule";
import { quickExpenseCategories } from "@/app/data/quickAdd";

const HREF: Record<StepId, string> = {
  track: "/dashboard",
  plan: "/money",
  starter: "/accounts",
  debt: "/debt-plan",
  safety: "/accounts",
  invest: "/investments",
  freedom: "/profile",
};

const EVENTS = [
  "transactionsUpdated",
  "planUpdated",
  "debtsUpdated",
  "accountsUpdated",
  "investmentsUpdated",
  "lifeGoalsUpdated",
  "budgetRuleUpdated",
  "currencyUpdated",
  "languageUpdated",
];

export default function FreedomPage() {
  const { t, language } = useLanguage();

  const [path, setPath] = useState<FreedomPath | null>(null);
  const [rule, setRule] = useState<RuleResult | null>(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setPath(buildFreedomPath());
      setRule(computeRule());
      setReady(true);
    };

    refresh();

    EVENTS.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      EVENTS.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  const num = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US", {
      maximumFractionDigits: 1,
    });

  const titleOf = (id: StepId) =>
    t(
      ({
        track: "fpTrackTitle",
        plan: "fpPlanTitle",
        starter: "fpStarterTitle",
        debt: "fpDebtTitle",
        safety: "fpSafetyTitle",
        invest: "fpInvestTitle",
        freedom: "fpFreedomTitle",
      } as const)[id]
    );

  const hintOf = (step: PathStep) => {
    switch (step.id) {
      case "track":
        return t("fpTrackHint", {
          n: num(Math.min(step.value, step.target)),
          total: num(step.target),
        });
      case "plan":
        return t("fpPlanHint");
      case "starter":
      case "safety":
        return t("fpRunwayHint", { n: num(step.value) });
      case "debt":
        return step.done
          ? t("fpDebtFree")
          : t("fpDebtHint", { amount: formatCurrency(step.value) });
      case "invest":
        return t("fpInvestHint");
      case "freedom":
        return step.target > 0
          ? t("fpFreedomHint", {
              n: num(step.value),
              amount: formatCurrency(step.target),
            })
          : t("fpFreedomSet");
    }
  };

  const labelOf = (raw: string) => {
    const found = quickExpenseCategories.find((c) => c.value === raw);

    return found
      ? `${found.emoji} ${found[language]}`
      : raw;
  };

  if (!ready || !path) return null;

  const pct = (value: number, income: number) =>
    income > 0 ? Math.round((value / income) * 100) : 0;

  const bars: {
    id: "needs" | "wants" | "savings";
    label: string;
    value: number;
    color: string;
  }[] = rule
    ? [
        { id: "needs", label: t("brNeeds"), value: rule.needs, color: "#2E8B6A" },
        { id: "wants", label: t("brWants"), value: rule.wants, color: "#E0772F" },
        {
          id: "savings",
          label: t("brSavings"),
          value: Math.max(rule.savings, 0),
          color: "#C8962E",
        },
      ]
    : [];

  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{t("fpTitle")}</h1>
        <p className="text-sm text-[var(--muted)]">{t("fpSubtitle")}</p>
      </header>

      {/* Progress bar */}

      <div className="rounded-2xl bg-[var(--forest)] p-4 text-[var(--on-forest)]">
        <p className="text-sm font-semibold">
          {path.currentId
            ? t("fpStepOf", {
                n: num(path.steps.findIndex((x) => x.id === path.currentId) + 1),
                total: num(path.total),
              })
            : t("fpAllDone")}
        </p>

        <div className="mt-3 flex gap-1.5">
          {path.steps.map((step) => (
            <span
              key={step.id}
              className={`h-1.5 flex-1 rounded-full ${
                step.done ? "bg-[var(--gold)]" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Steps */}

      <ol className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {path.steps.map((step, index) => {
          const current = step.id === path.currentId;

          return (
            <li
              key={step.id}
              className={index > 0 ? "border-t border-[var(--border)]" : ""}
            >
              <Link
                href={HREF[step.id]}
                className={`flex items-center gap-3 px-4 py-3 ${
                  current ? "bg-[var(--gold-soft)]" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step.done
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {step.done ? <Check size={16} /> : num(index + 1)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {titleOf(step.id)}
                  </span>

                  <span className="block text-xs text-[var(--muted)]">
                    {current ? `${t("fpYouAreHere")} · ` : ""}
                    {hintOf(step)}
                  </span>

                  {!step.done && step.progress > 0 && (
                    <span className="mt-1.5 block h-1 rounded-full bg-[var(--border)]">
                      <span
                        className="block h-1 rounded-full bg-[var(--primary)]"
                        style={{ width: `${step.progress}%` }}
                      />
                    </span>
                  )}
                </span>

                <ChevronRight size={16} className="text-[var(--muted)]" />
              </Link>
            </li>
          );
        })}
      </ol>

      {/* 50/30/20 */}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">{t("brTitle")}</h2>
            <p className="text-xs text-[var(--muted)]">{t("brSubtitle")}</p>
          </div>

          {rule && (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="shrink-0 text-xs font-semibold text-[var(--primary)]"
            >
              {t("brSortTitle")}
            </button>
          )}
        </div>

        {!rule ? (
          <p className="py-4 text-sm text-[var(--muted)]">{t("brNoIncome")}</p>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {bars.map((bar) => {
                const actual = pct(bar.value, rule.income);

                return (
                  <div key={bar.id}>
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="font-semibold">{bar.label}</span>

                      <span className="text-[var(--muted)]">
                        {formatCurrency(bar.value)} · {num(actual)}% ·{" "}
                        {t("brTarget", { n: num(TARGETS[bar.id]) })}
                      </span>
                    </div>

                    <div className="relative h-2 rounded-full bg-[var(--border)]">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${Math.min(actual, 100)}%`,
                          background: bar.color,
                        }}
                      />

                      <span
                        className="absolute -top-0.5 h-3 w-0.5 bg-[var(--foreground)]"
                        style={{ left: `${TARGETS[bar.id]}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 rounded-xl bg-[var(--background)] px-3 py-2 text-xs">
              {rule.suggestion
                ? t("brSuggest", {
                    amount: formatCurrency(rule.suggestion.cut),
                    category: labelOf(rule.suggestion.raw),
                  })
                : t("brOnTrack")}
            </p>

            {editing && (
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {rule.rows.map((row) => (
                  <li
                    key={row.raw}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{labelOf(row.raw)}</span>

                    <span className="flex shrink-0 overflow-hidden rounded-full border border-[var(--border)] text-xs font-semibold">
                      {(["needs", "wants"] as Bucket[]).map((bucket) => (
                        <button
                          key={bucket}
                          type="button"
                          onClick={() => setBucket(row.raw, bucket)}
                          className={`px-3 py-1 ${
                            row.bucket === bucket
                              ? "bg-[var(--primary)] text-white"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {bucket === "needs" ? t("brTagNeed") : t("brTagWant")}
                        </button>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
