"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Landmark } from "lucide-react";

import BudgetPlan from "@/app/components/BudgetPlan";
import SpendingInsights from "@/app/components/SpendingInsights";
import MoneyTrendChart from "@/app/components/MoneyTrendChart";
import RecentTransactions from "@/app/components/RecentTransactions";
import FloatingActionButton from "@/app/components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getSummary } from "@/app/data/transactions";

export default function MoneyPage() {
  const { t } = useLanguage();

  const [quickOpen, setQuickOpen] = useState(false);
  const [summary, setSummary] = useState(() => getSummary());
  const [, bump] = useState(0);

  useEffect(() => {
    const refresh = () => setSummary(getSummary());
    const redraw = () => bump((v) => v + 1);

    refresh();

    const data = ["transactionsUpdated", "investmentsUpdated"];
    const view = ["currencyUpdated", "languageUpdated"];

    data.forEach((name) => window.addEventListener(name, refresh));
    view.forEach((name) => window.addEventListener(name, redraw));

    return () => {
      data.forEach((name) => window.removeEventListener(name, refresh));
      view.forEach((name) => window.removeEventListener(name, redraw));
    };
  }, []);

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{t("myMoney")}</h1>

        <Link
          href="/accounts"
          className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-semibold"
        >
          <Landmark size={15} />
          {t("accountsLink")}
        </Link>
      </header>

      {/* Cash and the month */}

      <section className="rounded-2xl bg-[var(--forest)] p-4 text-[var(--on-forest)]">
        <p className="text-sm opacity-80">{t("availableCash")}</p>

        <p className="mt-1 text-4xl font-bold tracking-tight">
          {formatCurrency(summary.availableCash)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
          <div>
            <p className="text-xs opacity-70">
              {t("income")} · {t("thisMonth")}
            </p>

            <p className="text-base font-semibold">
              +{formatCurrency(summary.income)}
            </p>
          </div>

          <div>
            <p className="text-xs opacity-70">
              {t("expenses")} · {t("thisMonth")}
            </p>

            <p className="text-base font-semibold">
              -{formatCurrency(summary.expense)}
            </p>
          </div>
        </div>
      </section>

      <BudgetPlan />

      {/* A story, not a feature list */}

      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/home-plan", title: t("hpEntryTitle"), sub: t("hpEntrySub") },
          { href: "/debt-plan", title: t("dpEntryTitle"), sub: t("dpEntrySub") },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="paper block rounded-3xl border-2 border-[var(--ink)]/10 p-4"
          >
            <p className="font-hand text-2xl leading-tight text-[var(--pen)]">
              <span className="hl">{card.title}</span>
            </p>

            <p className="mt-2 text-xs">{card.sub}</p>
          </Link>
        ))}
      </div>

      <MoneyTrendChart />

      <SpendingInsights />

      <RecentTransactions />

      <Link
        href="/money/analytics"
        className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--primary)]"
      >
        {t("exploreMoneyAnalytics")}
        <ChevronRight size={16} />
      </Link>

      <FloatingActionButton onClick={() => setQuickOpen(true)} />

      <QuickAddSheet
        open={quickOpen}
        onClose={() => {
          setQuickOpen(false);
          setSummary(getSummary());
        }}
      />
    </div>
  );
}
