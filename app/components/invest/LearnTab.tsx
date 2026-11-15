"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { LEARN } from "@/app/data/investLearn";

export default function LearnTab() {
  const { t, language } = useLanguage();

  const [open, setOpen] = useState<string | null>(null);

  const rules = [t("ivRule1"), t("ivRule2"), t("ivRule3"), t("ivRule4")];

  const timeline: [string, string][] = [
    [t("ivUnder1"), t("ivUnder1Do")],
    [t("ivMid"), t("ivMidDo")],
    [t("ivOver5"), t("ivOver5Do")],
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
        <h2 className="text-sm font-bold">{t("ivRules")}</h2>

        <ol className="mt-3 space-y-2">
          {rules.map((rule, index) => (
            <li key={rule} className="flex gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[var(--forest)]">
                {(index + 1).toLocaleString(language === "bn" ? "bn-BD" : "en-US")}
              </span>

              {rule}
            </li>
          ))}
        </ol>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <h2 className="px-4 pt-4 text-sm font-bold">{t("ivByTime")}</h2>

        {timeline.map(([when, what], index) => (
          <div
            key={when}
            className={`px-4 py-3 ${index === 0 ? "mt-1" : "border-t border-[var(--border)]"}`}
          >
            <p className="text-sm font-semibold text-[var(--primary)]">{when}</p>
            <p className="text-sm">{what}</p>
          </div>
        ))}
      </section>

      <ul className="space-y-2">
        {LEARN.map((card) => {
          const isOpen = open === card.id;

          return (
            <li
              key={card.id}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : card.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-xl">
                  {card.emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{card.name[language]}</span>

                  <span className="mt-1 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        className={`h-1.5 w-4 rounded-full ${
                          dot <= card.risk ? "bg-[var(--gold)]" : "bg-[var(--border)]"
                        }`}
                      />
                    ))}

                    <span className="ml-1 text-[11px] text-[var(--muted)]">{t("ivRisk")}</span>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[var(--muted)] transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-[var(--border)] px-4 py-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-[var(--muted)]">{t("ivHorizon")}</p>
                    <p>{card.horizon[language]}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--muted)]">{t("ivGoodFor")}</p>
                    <p>{card.goodFor[language]}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--muted)]">{t("ivWatch")}</p>
                    <p>{card.watch[language]}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="px-1 text-xs text-[var(--muted)]">{t("ivCheckRates")}</p>
    </div>
  );
}
