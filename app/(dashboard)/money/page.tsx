"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";

import BudgetPlan from "@/app/components/BudgetPlan";
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
