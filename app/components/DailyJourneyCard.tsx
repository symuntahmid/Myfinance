"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  Flame,
  Snowflake,
  Trophy,
} from "lucide-react";

import {
  getDailyTasks,
  getJourneyProgress,
} from "../data/dailyJourney";

import { unlockAchievement } from "../data/achievements";
import {
  DEFAULT_FREEZE_DATA,
  MAX_FREEZES,
  getFreezeData,
  todayKey,
  type FreezeData,
} from "../data/streakFreeze";
import { t } from "@/app/data/i18n";

export default function DailyJourneyCard() {
  const [open, setOpen] = useState(false);

  const [, forceUpdate] = useState(0);

  const [, refreshLanguage] = useState(0);

  const [freeze, setFreeze] =
    useState<FreezeData>(DEFAULT_FREEZE_DATA);

  useEffect(() => {
    const updateJourney = () => {
      const progress = getJourneyProgress();

      if (
        progress.total > 0 &&
        progress.completed >= progress.total
      ) {
        unlockAchievement(3);
      }

      setFreeze(getFreezeData());

      forceUpdate((n) => n + 1);
    };

    const handleLanguageUpdate = () => {
      refreshLanguage((value) => value + 1);
    };

    updateJourney();

    window.addEventListener(
      "dailyJourneyUpdated",
      updateJourney
    );

    window.addEventListener(
      "player-updated",
      updateJourney
    );

    window.addEventListener(
      "transactionsUpdated",
      updateJourney
    );

    window.addEventListener(
      "languageUpdated",
      handleLanguageUpdate
    );

    return () => {
      window.removeEventListener(
        "dailyJourneyUpdated",
        updateJourney
      );

      window.removeEventListener(
        "player-updated",
        updateJourney
      );

      window.removeEventListener(
        "transactionsUpdated",
        updateJourney
      );

      window.removeEventListener(
        "languageUpdated",
        handleLanguageUpdate
      );
    };
  }, []);

  const tasks = getDailyTasks();
  const progress = getJourneyProgress();

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-[#C8962E]
        via-[#D8AA45]
        to-[#E6C268]
        p-4
        text-[#2B1F00]
        shadow-lg
        shadow-[#C8962E]/20
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-16
          -top-16
          h-48
          w-48
          rounded-full
          bg-white/30
          blur-3xl
        "
      />

      <div className="relative">

        {/* Header */}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="
            flex
            w-full
            items-center
            gap-3
            text-left
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              bg-white/30
              backdrop-blur
            "
          >
            <Flame size={20} />
          </div>

          <div>
            <p
              className="
                font-body
                text-xs
                font-medium
                tracking-[0.14em]
                text-[#2B1F00]/75
              "
            >
              {t("dailyJourney")}
            </p>

            <h2
              className="
                font-display
                text-base
                leading-snug
              "
            >
              {t("buildBetterMoneyHabits")}
            </h2>
          </div>
          <ChevronDown
            size={18}
            className={`ml-auto shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Progress */}

        <div className="mt-4">

          <div
            className="
              mb-3
              flex
              justify-between
              font-body
              text-sm
              font-medium
              tracking-[-0.015em]
            "
          >
            <span>
              {t("progress")}
            </span>

            <span>
              {progress.completed}/{progress.total}
            </span>
          </div>

          <div
            className="
              h-3
              overflow-hidden
              rounded-full
              bg-[#2B1F00]/15
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-[#2B1F00]
                transition-all
                duration-700
              "
              style={{
                width: `${progress.percent}%`,
              }}
            />
          </div>

        </div>

        {open && (
          <>
        {/* Streak freeze */}

        <div
          className="
            mt-4
            flex
            items-start
            gap-3
            rounded-2xl
            bg-[#2B1F00]/10
            p-3
            backdrop-blur-sm
          "
        >
          <Snowflake
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div className="min-w-0">
            <p className="font-body text-sm font-semibold">
              {t("streakFreezes")}: {freeze.freezes}/{MAX_FREEZES}
            </p>

            <p className="font-body text-xs text-[#2B1F00]/75">
              {freeze.lastUsed &&
              freeze.lastUsed.date === todayKey()
                ? t("streakFreezeUsed").replace(
                    "{streak}",
                    String(freeze.lastUsed.streak)
                  )
                : t("streakFreezeHint")}
            </p>
          </div>
        </div>

        {/* Tasks */}

        <div
          className="
            mt-4
            space-y-2
          "
        >
          {tasks.map((task) => (

            <div
              key={task.id}
              className="
                flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                bg-[#2B1F00]/10
                px-3
                py-2.5
                backdrop-blur-sm
                transition
                hover:bg-[#2B1F00]/15
              "
            >

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >

                {task.completed ? (
                  <CheckCircle2
                    size={22}
                    className="text-emerald-800"
                  />
                ) : (
                  <Circle
                    size={22}
                    className="text-[#2B1F00]/50"
                  />
                )}

                <div>

                  <p
                    className="
                      font-body
                      text-sm
                      font-medium
                      tracking-[-0.015em]
                      sm:text-base
                    "
                  >
                    {task.title}
                  </p>

                  <p
                    className="
                      font-body
                      text-xs
                      tracking-[-0.01em]
                      text-[#2B1F00]/75
                    "
                  >
                    +{task.reward} XP
                  </p>

                </div>

              </div>

              {task.completed ? (

                <span
                  className="
                    shrink-0
                    rounded-xl
                    bg-emerald-700/15
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-emerald-900
                  "
                >
                  ✓ {t("done")}
                </span>

              ) : (

                <span
                  className="
                    hidden
                    rounded-xl
                    bg-[#2B1F00]/10
                    px-3
                    py-2
                    text-xs
                    text-[#2B1F00]/70
                    sm:block
                  "
                >
                  {t("complete")}
                </span>

              )}

            </div>

          ))}
        </div>

        {/* Completed */}

        {progress.completed === progress.total &&
          progress.total > 0 && (

            <div
              className="
                mt-6
                rounded-2xl
                bg-white/30
                p-5
                backdrop-blur
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    rounded-full
                    bg-white/30
                    p-3
                  "
                >
                  <Trophy size={24} />
                </div>

                <div>

                  <h3
                    className="
                      font-display
                      text-2xl
                      font-medium
                      leading-tight
                      tracking-[-0.045em]
                    "
                  >
                    {t("dailyJourneyComplete")}
                  </h3>

                  <p
                    className="
                      font-body
                      text-sm
                      leading-6
                      tracking-[-0.015em]
                      text-[#2B1F00]/85
                    "
                  >
                    +45 {t("xpEarnedMessage")}
                  </p>

                </div>

              </div>

            </div>

          )}

          </>
        )}

      </div>
    </section>
  );
}