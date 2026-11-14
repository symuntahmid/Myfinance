"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Lock,
  Share2,
  Target,
} from "lucide-react";

import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import InvestmentPieChart from "../../components/InvestmentPieChart";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  SAVING_GOAL_PERCENT,
  buildInsights,
  type Insights,
} from "@/app/data/insights";
import { freedomNumber, getMonthlyCost } from "@/app/data/lifeGoals";
import { getNetWorthNow } from "@/app/data/overview";
import { getLevel, getPlayer } from "@/app/data/player";
import { levelTitle } from "@/app/data/levels";
import { getBadgeProgress } from "@/app/data/badgeProgress";
import { renderFlexImage, type FlexTheme } from "@/app/utils/flexImage";
import type { TranslationKey } from "@/app/data/translations";

const HIDE_KEY = "myfinance-hide-amounts";
const DISPLAY = { fontFamily: "var(--font-tiro), Georgia, serif" } as const;

type Extra = {
  streak: number;
  level: number;
  levelName: string;
  worth: number;
  freedomTarget: number;
  badges: ReturnType<typeof getBadgeProgress>;
};

type Flex = {
  id: string;
  emoji: string;
  big: string;
  caption: string;
  style: string;
  theme: FlexTheme;
};

// One look per card. The text colour always matches its background.
const THEMES: { className: string; theme: FlexTheme }[] = [
  {
    className: "bg-[var(--forest)] text-[var(--on-forest)]",
    theme: { from: "#0B3B2E", to: "#06241B", fg: "#F6F0DC" },
  },
  {
    className: "bg-gradient-to-br from-[#C8962E] to-[#E4B85A] text-[#2B1F00]",
    theme: { from: "#C8962E", to: "#E4B85A", fg: "#2B1F00" },
  },
  {
    className: "bg-[#14110F] text-[#F2C96B]",
    theme: { from: "#14110F", to: "#2A211A", fg: "#F2C96B" },
  },
  {
    className: "bg-[#D6322B] text-white",
    theme: { from: "#D6322B", to: "#A82019", fg: "#FFFFFF" },
  },
  {
    className: "bg-[#CFE8DC] text-[#0B3B2E]",
    theme: { from: "#CFE8DC", to: "#A9D4C0", fg: "#0B3B2E" },
  },
];

export default function InsightsPage() {
  const { t, language } = useLanguage();

  const [data, setData] = useState<Insights | null>(null);
  const [extra, setExtra] = useState<Extra | null>(null);
  const [hide, setHide] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deepOpen, setDeepOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const level = getLevel();

      try {
        setHide(localStorage.getItem(HIDE_KEY) === "1");
      } catch {
        /* storage not available: keep amounts visible */
      }

      setData(buildInsights());
      setExtra({
        streak: getPlayer().streak,
        level: level.level,
        levelName: level.title,
        worth: Math.max(getNetWorthNow().netWorth, 0),
        freedomTarget: freedomNumber(getMonthlyCost()),
        badges: getBadgeProgress(),
      });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "investmentsUpdated",
      "lifeGoalsUpdated",
      "player-updated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  const toggleHide = () => {
    const next = !hide;

    setHide(next);

    try {
      localStorage.setItem(HIDE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const number = useCallback(
    (value: number) =>
      value.toLocaleString(language === "bn" ? "bn-BD" : "en-US"),
    [language]
  );

  // Amounts can be hidden, so a screenshot shows the flex, not the balance.
  const money = useCallback(
    (value: number) => (hide ? "•••••" : formatCurrency(value)),
    [hide]
  );

  const flexes = useMemo<Flex[]>(() => {
    if (!data || !extra) return [];

    const list: Omit<Flex, "style" | "theme">[] = [];
    const hasIncome = data.income > 0;

    if (hasIncome && data.kept > 0) {
      list.push({
        id: "kept",
        emoji: "💰",
        big: t("fxKeptBig", { amount: money(data.kept) }),
        caption: t("fxKeptCap"),
      });
    }

    if (hasIncome && data.rate >= 10) {
      list.push({
        id: "rate",
        emoji: "🔥",
        big: t("fxRateBig", { percent: number(data.rate) }),
        caption:
          data.rate >= SAVING_GOAL_PERCENT ? t("fxRateHigh") : t("fxRateMid"),
      });
    }

    if (extra.streak >= 2) {
      list.push({
        id: "streak",
        emoji: "⚡",
        big: t("fxStreakBig", { days: number(extra.streak) }),
        caption: t("fxStreakCap"),
      });
    }

    if (data.noSpendDays >= 2) {
      list.push({
        id: "nospend",
        emoji: "🧊",
        big: t("fxNoSpendBig", { count: number(data.noSpendDays) }),
        caption: t("fxNoSpendCap"),
      });
    }

    if (data.lastExpense > 0 && data.expense < data.lastExpense) {
      list.push({
        id: "less",
        emoji: "📉",
        big: t("fxLessBig", {
          amount: money(data.lastExpense - data.expense),
        }),
        caption: t("fxLessCap"),
      });
    }

    if (extra.freedomTarget > 0 && extra.worth > 0) {
      const percent = Math.min(
        Math.round((extra.worth / extra.freedomTarget) * 100),
        100
      );

      if (percent >= 1) {
        list.push({
          id: "free",
          emoji: "🕊️",
          big: t("fxFreeBig", { percent: number(percent) }),
          caption: t("fxFreeCap"),
        });
      }
    }

    const trophies = extra.badges.filter((item) => item.unlocked).length;

    if (trophies > 0) {
      list.push({
        id: "trophy",
        emoji: "🏆",
        big: t("fxTrophyBig", { count: number(trophies) }),
        caption: t("fxTrophyCap"),
      });
    }

    if (extra.level >= 2) {
      list.push({
        id: "level",
        emoji: "🚀",
        big: t("fxLevelBig", { level: number(extra.level) }),
        caption: levelTitle(extra.levelName, language),
      });
    }

    if (extra.worth > 0) {
      list.push({
        id: "worth",
        emoji: "💎",
        big: t("fxWorthBig", { amount: money(extra.worth) }),
        caption: t("fxWorthCap"),
      });
    }

    if (list.length === 0) {
      list.push({
        id: "start",
        emoji: "✨",
        big: t("fxStartBig"),
        caption: t("fxStartCap"),
      });
    }

    return list.slice(0, 6).map((item, index) => ({
      ...item,
      style: THEMES[index % THEMES.length].className,
      theme: THEMES[index % THEMES.length].theme,
    }));
  }, [data, extra, language, t, money, number]);

  if (!data || !extra) {
    return <div className="h-72 animate-pulse rounded-3xl bg-[var(--card)]" />;
  }

  const hasIncome = data.income > 0;

  const era: { key: TranslationKey; emoji: string } = !hasIncome
    ? { key: "fxEra0", emoji: "✨" }
    : data.rate >= 40
      ? { key: "fxEra1", emoji: "👑" }
      : data.rate >= SAVING_GOAL_PERCENT
        ? { key: "fxEra2", emoji: "😎" }
        : data.rate >= 5
          ? { key: "fxEra3", emoji: "🌱" }
          : { key: "fxEra4", emoji: "🛠️" };

  // Draws the card as a 9:16 picture, then shares it (or saves it).
  const makeImage = (flex: Flex) =>
    renderFlexImage({
      emoji: flex.emoji,
      big: flex.big,
      caption: flex.caption,
      theme: flex.theme,
      footer: window.location.host,
    });

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "myfinance-flex.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const flash = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 1600);
  };

  const share = async (flex: Flex) => {
    try {
      const blob = await makeImage(flex);
      const file = new File([blob], "myfinance-flex.png", {
        type: "image/png",
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }

      // No share sheet (computer): save the picture instead.
      download(blob);
      flash(flex.id);
    } catch {
      /* person closed the share sheet */
    }
  };

  const save = async (flex: Flex) => {
    try {
      download(await makeImage(flex));
      flash(flex.id);
    } catch {
      /* ignore */
    }
  };

  const shelf = extra.badges.slice(0, 8);
  const nextBadge = extra.badges
    .filter((item) => !item.unlocked)
    .sort((a, b) => b.progress - a.progress)[0];

  const freedomPercent =
    extra.freedomTarget > 0
      ? Math.min(Math.round((extra.worth / extra.freedomTarget) * 100), 100)
      : 0;

  const today = data.day;
  const spent = new Set(data.spendDays);

  return (
    <div className="mx-auto max-w-3xl space-y-5 overflow-x-clip pb-6">
      {/* ERA */}
      <section>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--muted)]">
            {t("fxTitle")}
          </p>

          <button
            type="button"
            onClick={toggleHide}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
          >
            {hide ? <EyeOff size={13} /> : <Eye size={13} />}
            {hide ? t("fxShow") : t("fxHide")}
          </button>
        </div>

        <p className="mt-4 text-sm text-[var(--muted)]">{t("fxEraLabel")}</p>

        <h1
          style={DISPLAY}
          className="mt-1 text-[40px] font-bold leading-none tracking-tight text-[var(--foreground)]"
        >
          {t(era.key)} <span className="text-3xl">{era.emoji}</span>
        </h1>
      </section>

      {/* FLEX CARDS */}
      <section>
        <p className="mb-2 text-sm font-bold">{t("fxCards")}</p>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {flexes.map((flex) => (
            <article
              key={flex.id}
              className={`relative flex aspect-[9/16] w-[58%] max-w-[230px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-soft)] ${flex.style}`}
            >
              <div className="alpona pointer-events-none absolute inset-0 opacity-30" />

              <div className="relative flex items-start justify-between">
                <span className="text-[10px] font-semibold opacity-60">
                  MyFinance
                </span>

                <span className="-rotate-6 text-4xl leading-none">
                  {flex.emoji}
                </span>
              </div>

              <div className="relative">
                <p
                  style={DISPLAY}
                  className="text-[28px] font-bold leading-[1.05]"
                >
                  {flex.big}
                </p>

                <p className="mt-2 text-sm font-medium opacity-80">
                  {flex.caption}
                </p>

                {flex.id === "start" ? (
                  <Link
                    href="/dashboard"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-semibold"
                  >
                    {t("fxStartCap")}
                    <ChevronRight size={13} />
                  </Link>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => share(flex)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-semibold active:scale-95"
                    >
                      <Share2 size={13} />
                      {copied === flex.id ? t("fxSaved") : t("fxShare")}
                    </button>

                    <button
                      type="button"
                      aria-label={t("fxSave")}
                      onClick={() => save(flex)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 active:scale-95"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TROPHY SHELF */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">{t("fxShelfTitle")}</h2>

          <Link
            href="/profile/badges"
            className="text-xs font-semibold text-[var(--primary)]"
          >
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {shelf.map((item) => (
            <div
              key={item.badge.id}
              className={`relative flex aspect-square items-center justify-center rounded-2xl text-3xl ${
                item.unlocked
                  ? "bg-[var(--gold-soft)]"
                  : "bg-[var(--background)] grayscale"
              }`}
            >
              <span className={item.unlocked ? "" : "opacity-30"}>
                {item.badge.icon}
              </span>

              {!item.unlocked && (
                <Lock
                  size={12}
                  className="absolute bottom-1.5 right-1.5 text-[var(--muted)]"
                />
              )}
            </div>
          ))}
        </div>

        {nextBadge && (
          <div className="mt-3 flex items-center gap-2.5">
            <span className="text-xl">{nextBadge.badge.icon}</span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--background)]">
              <div
                className="h-full rounded-full bg-[var(--gold)]"
                style={{
                  width: `${Math.max(Math.round(nextBadge.progress), 3)}%`,
                }}
              />
            </div>

            <span className="text-xs font-semibold text-[var(--muted)]">
              {number(Math.round(nextBadge.progress))}%
            </span>
          </div>
        )}
      </section>

      {/* SPEND-FREE DAYS */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">{t("fxDaysTitle")}</h2>

          <span className="text-xs font-semibold text-[var(--primary)]">
            {t("fxDaysCount", { count: number(data.noSpendDays) })}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: data.daysInMonth }, (_, index) => {
            const day = index + 1;
            const past = day < today;
            const free = past && !spent.has(day);

            return (
              <span
                key={day}
                className={`h-[22px] w-[22px] rounded-md ${
                  day === today
                    ? "ring-2 ring-[var(--gold)] bg-[var(--background)]"
                    : free
                      ? "bg-[var(--primary)]"
                      : past
                        ? "bg-[var(--muted)]/30"
                        : "border border-dashed border-[var(--border)]"
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* FREEDOM */}
      <Link
        href="/profile"
        className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[#8A6212]">
          <Target size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{t("fxFreedomTitle")}</p>

          {extra.freedomTarget > 0 ? (
            <>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--background)]">
                <div
                  className="h-full rounded-full bg-[var(--gold)]"
                  style={{ width: `${Math.max(freedomPercent, 2)}%` }}
                />
              </div>

              <p className="mt-1 text-xs text-[var(--muted)]">
                {t("lgPercentDone", { percent: number(freedomPercent) })}
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--muted)]">{t("inFreedomSet")}</p>
          )}
        </div>

        <ChevronRight size={16} className="shrink-0 text-[var(--muted)]" />
      </Link>

      {/* DEEP DIVE */}
      <button
        type="button"
        onClick={() => setDeepOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold"
      >
        {t("inDeepDive")}

        <ChevronDown
          size={16}
          className={`transition ${deepOpen ? "rotate-180" : ""}`}
        />
      </button>

      {deepOpen && (
        <div className="space-y-3">
          <div className="min-w-0">
            <NetWorthChart />
          </div>

          <div className="min-w-0">
            <FinancialInsights />
          </div>

          <div className="min-w-0">
            <IncomeExpenseChart />
          </div>

          <div className="min-w-0">
            <InvestmentPieChart />
          </div>
        </div>
      )}
    </div>
  );
}
