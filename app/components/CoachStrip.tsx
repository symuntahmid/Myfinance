"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { buildCoach, type CoachState } from "@/app/data/coach";

/* One line on the dashboard: today's safe amount, and how many notes wait. */
export default function CoachStrip() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";

  const [state, setState] = useState<CoachState | null>(null);

  useEffect(() => {
    const load = () => setState(buildCoach(lang));

    load();

    const events = [
      "transactionsUpdated",
      "billsUpdated",
      "accountsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, load));

    return () => events.forEach((name) => window.removeEventListener(name, load));
  }, [lang]);

  if (!state || state.cash <= 0) return null;

  const warns = state.tips.filter((tip) => tip.tone === "warn").length;

  return (
    <Link
      href="/coach"
      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
    >
      <div>
        <p className="text-xs text-[var(--muted)]">
          {lang === "bn" ? "আজ নিরাপদে খরচ করা যায়" : "Safe to spend today"}
        </p>

        <p className="text-lg font-bold">{formatCurrency(state.perDay)}</p>
      </div>

      <span className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
        {warns > 0
          ? lang === "bn"
            ? `${warns}টি জরুরি`
            : `${warns} to check`
          : lang === "bn"
            ? "কোচ দেখুন"
            : "Open coach"}
        <ChevronRight size={14} />
      </span>
    </Link>
  );
}
