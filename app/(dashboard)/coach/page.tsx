"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { buildCoach, type CoachState } from "@/app/data/coach";

const TEXT = {
  en: {
    title: "Money Coach",
    sub: "What matters today, from your own numbers.",
    safe: "Safe to spend today",
    perDay: "per day for the next {n} days",
    after: "After {b} of bills still to pay",
    afford: "Can I afford it?",
    ph: "Amount",
    check: "Check",
    notes: "Coach notes",
    clear: "All clear. Nothing needs you right now.",
    note: "A simple guide from your own numbers, not financial advice.",
  },
  bn: {
    title: "মানি কোচ",
    sub: "আজ কী জরুরি, আপনার নিজের হিসাব থেকে।",
    safe: "আজ নিরাপদে খরচ করা যায়",
    perDay: "পরের {n} দিন প্রতিদিন",
    after: "বাকি {b} বিল দেওয়ার পর",
    afford: "এটা কেনা কি ঠিক হবে?",
    ph: "টাকার অঙ্ক",
    check: "দেখুন",
    notes: "কোচের পরামর্শ",
    clear: "সব ঠিক আছে। এখন কিছু করার নেই।",
    note: "আপনার নিজের হিসাব থেকে সহজ দিকনির্দেশ, আর্থিক পরামর্শ নয়।",
  },
} as const;

export default function CoachPage() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [state, setState] = useState<CoachState | null>(null);
  const [amount, setAmount] = useState("");
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    const load = () => setState(buildCoach(lang));

    load();

    const events = [
      "transactionsUpdated",
      "billsUpdated",
      "accountsUpdated",
      "goalsUpdated",
      "debtsUpdated",
      "planUpdated",
      "settingsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, load));

    return () => events.forEach((name) => window.removeEventListener(name, load));
  }, [lang]);

  if (!state) return null;

  const answer = asked ? state.afford(Number(amount)) : null;

  const verdictStyle = {
    yes: "bg-[var(--gold-soft)]",
    tight: "bg-[var(--gold-soft)] border border-[var(--gold)]",
    no: "border border-red-300 bg-red-50 text-red-900",
  } as const;

  const toneBar = {
    warn: "border-l-[var(--sun)]",
    nudge: "border-l-[var(--gold)]",
    win: "border-l-[var(--success)]",
  } as const;

  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      <div className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
        <p className="text-sm opacity-80">{x.safe}</p>

        <p className="mt-1 text-4xl font-bold">{formatCurrency(state.perDay)}</p>

        <p className="mt-1 text-sm opacity-80">
          {x.perDay.replace("{n}", String(state.daysLeft))}
        </p>

        <p className="mt-3 border-t border-white/20 pt-3 text-xs opacity-80">
          {x.after.replace("{b}", formatCurrency(state.billsLeft))}
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{x.afford}</h2>

        <div className="mt-3 flex gap-2">
          <input
            inputMode="decimal"
            value={amount}
            placeholder={x.ph}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^\d.]/g, ""));
              setAsked(false);
            }}
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-base font-semibold outline-none focus:border-[var(--primary)]"
          />

          <button
            type="button"
            onClick={() => setAsked(true)}
            className="rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-white"
          >
            {x.check}
          </button>
        </div>

        {answer && (
          <p
            role="status"
            className={`mt-3 rounded-xl px-3 py-3 text-sm font-semibold ${verdictStyle[answer.verdict]}`}
          >
            {answer.text}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold">{x.notes}</h2>

        {state.tips.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm text-[var(--muted)]">
            {x.clear}
          </p>
        ) : (
          <ul className="space-y-2">
            {state.tips.map((tip) => (
              <li
                key={tip.id}
                className={`rounded-2xl border border-l-4 border-[var(--border)] bg-[var(--card)] p-4 ${toneBar[tip.tone]}`}
              >
                <p className="text-sm">{tip.text}</p>

                <Link
                  href={tip.href}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                >
                  {tip.cta}
                  <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-[var(--muted)]">{x.note}</p>
    </div>
  );
}
