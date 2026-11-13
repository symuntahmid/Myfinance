"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ClipboardList,
  Flame,
  Plus,
  Receipt,
  Snowflake,
} from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getNetWorthNow } from "@/app/data/overview";
import { previousSnapshot, recordSnapshot } from "@/app/data/netWorth";
import { getPlayer } from "@/app/data/player";
import { getFreezeData, MAX_FREEZES } from "@/app/data/streakFreeze";

type Props = {
  onQuickAdd: () => void;
};

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function HomeHero({ onQuickAdd }: Props) {
  const { t, language } = useLanguage();

  const [state, setState] = useState<{
    worth: number;
    change: number | null;
    streak: number;
    freezes: number;
  } | null>(null);

  useEffect(() => {
    const refresh = () => {
      const worth = getNetWorthNow().netWorth;
      const month = currentMonth();

      recordSnapshot(month, worth);

      const before = previousSnapshot(month);

      setState({
        worth,
        change: before ? worth - before.value : null,
        streak: getPlayer().streak,
        freezes: getFreezeData().freezes,
      });
    };

    refresh();

    const events = [
      "accountsUpdated",
      "transactionsUpdated",
      "goalsUpdated",
      "debtsUpdated",
      "investmentsUpdated",
      "currencyUpdated",
      "languageUpdated",
      "player-updated",
      "dailyJourneyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (!state) return null;

  const number = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const actionIcon =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/35 bg-white/10 text-[var(--gold)] transition group-active:scale-95";

  const actionLabel = "text-[11px] text-[var(--on-forest)]/85";

  return (
    <section className="hero-rise alpona relative overflow-hidden rounded-3xl bg-[var(--forest)] p-4 text-[var(--on-forest)] shadow-[0_14px_30px_rgba(11,59,46,0.25)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,182,79,0.5) 0%, rgba(226,182,79,0.1) 45%, transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] text-[var(--on-forest)]/75">
            {t("netWorthTitle")}
          </p>

          <div className="flex items-center gap-2 rounded-full bg-black/25 px-2.5 py-1 text-xs">
            <span className="flex items-center gap-1">
              <Flame size={13} className="text-[var(--gold)]" />
              {number(state.streak)}
            </span>

            <span className="h-3 w-px bg-white/20" />

            <span className="flex items-center gap-1">
              <Snowflake size={13} className="text-[var(--gold)]" />
              {number(state.freezes)}/{number(MAX_FREEZES)}
            </span>
          </div>
        </div>

        <p className="font-display mt-1 text-[34px] leading-none">
          {formatCurrency(state.worth)}
        </p>

        {state.change !== null && state.change !== 0 && (
          <p className="mt-1.5 text-xs text-[var(--gold)]">
            {state.change > 0 ? "▲ " : "▼ "}
            {t("heroSinceLast", {
              amount: formatCurrency(Math.abs(state.change)),
            })}
          </p>
        )}

        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onQuickAdd}
            className="group flex flex-col items-center gap-1.5"
          >
            <span className={`${actionIcon} bg-[var(--gold)] text-[#1F1500]`}>
              <Plus size={20} />
            </span>

            <span className={actionLabel}>{t("heroAdd")}</span>
          </button>

          {(
            [
              ["/accounts", ArrowLeftRight, t("heroMove")],
              ["/bills", Receipt, t("billsTitle")],
              ["/plan", ClipboardList, t("planTitle")],
            ] as const
          ).map(([href, Icon, label]) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-1.5"
            >
              <span className={actionIcon}>
                <Icon size={18} />
              </span>

              <span className={actionLabel}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
