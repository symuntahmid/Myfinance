"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  BadgeCheck,
  Flame,
  Lock,
  PiggyBank,
  Snowflake,
  TrendingUp,
  User,
} from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getLevel, getPlayer } from "@/app/data/player";
import { getProfile, updateProfile } from "@/app/data/profile";
import { fileToAvatar } from "@/app/utils/imageResize";
import { getFreezeData, MAX_FREEZES } from "@/app/data/streakFreeze";
import { getMonthlyReport } from "@/app/data/transactions";
import { getBadgeProgress } from "@/app/data/badgeProgress";

const HISTORY_KEY = "myfinance-streak-history";

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function readHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function weekDays(language: string) {
  const names =
    language === "bn"
      ? ["সো", "ম", "বু", "বৃ", "শু", "শ", "র"]
      : ["M", "T", "W", "T", "F", "S", "S"];

  const today = new Date();
  const offset = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - offset);

  return names.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return { name, key: dateKey(date) };
  });
}

type State = {
  name: string;
  avatar: string;
  level: ReturnType<typeof getLevel>;
  streak: number;
  freezes: number;
  history: string[];
  frozen: string[];
  saved: number;
  rate: number;
  unlocked: ReturnType<typeof getBadgeProgress>;
  next: ReturnType<typeof getBadgeProgress>[number] | null;
};

export default function ProfileOverview() {
  const { t, language } = useLanguage();
  const [state, setState] = useState<State | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const player = getPlayer();
      const profile = getProfile();
      const report = getMonthlyReport();
      const freeze = getFreezeData();
      const badges = getBadgeProgress();

      const next =
        badges
          .filter((item) => !item.unlocked)
          .sort((a, b) => b.progress - a.progress)[0] ?? null;

      setState({
        name:
          profile.displayName ||
          `${profile.firstName} ${profile.lastName}`.trim() ||
          player.name,
        avatar: profile.avatar || "",
        level: getLevel(),
        streak: player.streak,
        freezes: freeze.freezes,
        history: readHistory(),
        frozen: freeze.frozenDays,
        saved: report.savings,
        rate: report.savingsRate,
        unlocked: badges.filter((item) => item.unlocked),
        next,
      });
    };

    refresh();

    const events = [
      "player-updated",
      "profileUpdated",
      "transactionsUpdated",
      "dailyJourneyUpdated",
      "investmentsUpdated",
      "settingsUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  if (!state) {
    return <div className="h-64 animate-pulse rounded-3xl bg-[var(--card)]" />;
  }

  const { level } = state;
  const today = dateKey(new Date());
  const days = weekDays(language);

  return (
    <div className="space-y-3">
      {/* IDENTITY + LEVEL + STREAK */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--forest)] p-4 text-[var(--on-forest)] shadow-[var(--shadow-soft)]">
        <div className="alpona pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative flex items-center gap-3">
          <label
            aria-label={t("lgChangePhoto")}
            className="relative block h-14 w-14 shrink-0 cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];

                event.target.value = "";

                if (!file) return;

                try {
                  updateProfile({ avatar: await fileToAvatar(file) });
                } catch {
                  /* not an image: ignore */
                }
              }}
            />

            <span className="relative block h-14 w-14 overflow-hidden rounded-full border-2 border-[var(--gold)]/60 bg-[var(--primary)]">
              {state.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={state.avatar} alt="" className="h-full w-full object-cover" />
              ) : !avatarError ? (
                <Image
                  src="/images/quokka/quokka-profile.png"
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <User size={24} />
                </span>
              )}
            </span>

            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)] text-[#2B1F00]">
              <Camera size={11} />
            </span>
          </label>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-lg font-bold leading-tight">
                {state.name}
              </h2>
              <BadgeCheck size={16} className="shrink-0 text-[var(--gold)]" />
            </div>

            <p className="truncate text-xs opacity-75">
              {level.icon} {t("level")} {level.level} · {level.title}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-bold">
              <Flame size={13} className="text-[var(--gold)]" />
              {state.streak}
            </span>

            <span className="flex items-center gap-1 text-[11px] opacity-75">
              <Snowflake size={11} />
              {state.freezes}/{MAX_FREEZES}
            </span>
          </div>
        </div>

        {/* XP */}
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] opacity-80">
            <span>
              {level.isMaxLevel
                ? t("pfMaxLevel")
                : t("xpUntilLevel", {
                    xp: level.xpToNextLevel,
                    level: level.level + 1,
                  })}
            </span>
            <span>{t("pfXpTotal", { xp: level.totalXP })}</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all"
              style={{ width: `${Math.min(Math.max(level.percent, 3), 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* WEEK */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">{t("pfThisWeek")}</p>
          <p className="text-xs text-[var(--muted)]">
            {state.streak} {t("heroStreak")}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const done = state.history.includes(day.key);
            const frozen = state.frozen.includes(day.key);
            const isToday = day.key === today;

            return (
              <div key={day.key} className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    done
                      ? "bg-[var(--primary)] text-white"
                      : frozen
                        ? "bg-sky-100 text-sky-600"
                        : "bg-[var(--background)] text-[var(--muted)]"
                  } ${isToday ? "ring-2 ring-[var(--gold)]" : ""}`}
                >
                  {done ? (
                    <Flame size={14} />
                  ) : frozen ? (
                    <Snowflake size={14} />
                  ) : null}
                </span>

                <span className="text-[10px] text-[var(--muted)]">
                  {day.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SAVINGS + BADGES */}
      <div className="grid grid-cols-2 gap-3">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <PiggyBank size={14} className="text-[var(--primary)]" />
            {t("pfSavedMonth")}
          </div>

          <p
            className={`mt-1 text-xl font-bold ${
              state.saved < 0 ? "text-[var(--sun)]" : ""
            }`}
          >
            {formatCurrency(state.saved)}
          </p>

          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--muted)]">
            <TrendingUp size={11} />
            {t("pfSavingRate")} {Math.round(state.rate)}%
          </p>
        </section>

        <Link
          href="/profile/badges"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5"
        >
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("pfBadges")}</span>
            <ArrowUpRight size={14} />
          </div>

          {state.unlocked.length > 0 ? (
            <div className="mt-1 flex items-center gap-1 text-xl">
              {state.unlocked.slice(0, 4).map((item) => (
                <span key={item.badge.id}>{item.badge.icon}</span>
              ))}
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-1.5 text-[var(--muted)]">
              <Lock size={16} />
              <span className="text-xl font-bold text-[var(--foreground)]">
                0
              </span>
            </div>
          )}

          <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
            {state.next
              ? `${t("pfNextBadge")}: ${state.next.badge.icon} ${Math.round(state.next.progress)}%`
              : t("pfNoBadges")}
          </p>
        </Link>
      </div>
    </div>
  );
}
