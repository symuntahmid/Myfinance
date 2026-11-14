"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { GOAL_TERMS, type GoalTerm } from "@/app/data/goals";

const LABEL = {
  short: ["gtShort", "gtShortRange"],
  medium: ["gtMedium", "gtMediumRange"],
  long: ["gtLong", "gtLongRange"],
} as const;

type Props = {
  value: GoalTerm;
  onChange: (term: GoalTerm) => void;
};

export default function TermPicker({ value, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">
        {t("gtPick")}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {GOAL_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChange(term)}
            className={`rounded-2xl border px-2 py-2.5 text-center transition ${
              value === term
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            }`}
          >
            <span className="block text-sm font-semibold">
              {t(LABEL[term][0])}
            </span>

            <span
              className={`block text-[11px] ${
                value === term ? "text-white/80" : "text-[var(--muted)]"
              }`}
            >
              {t(LABEL[term][1])}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
