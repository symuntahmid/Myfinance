"use client";

import { useEffect, useState } from "react";

import {
  Flame,
  Trophy,
  Check,
  Snowflake,
} from "lucide-react";

import { getPlayer } from "@/app/data/player";
import {
  DEFAULT_FREEZE_DATA,
  MAX_FREEZES,
  getFreezeData,
  type FreezeData,
} from "@/app/data/streakFreeze";
import { t } from "@/app/data/i18n";
import { getSettings } from "@/app/data/settings";


const HISTORY_KEY =
  "myfinance-streak-history";


function getStreakHistory(): string[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {

    return JSON.parse(
      localStorage.getItem(
        HISTORY_KEY
      ) || "[]"
    );

  } catch {

    return [];

  }

}


function getDateKey(
  date: Date
) {

  return [
    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(2, "0"),

    String(
      date.getDate()
    ).padStart(2, "0"),

  ].join("-");

}


function getWeekDays() {

  const today =
    new Date();

  const day =
    today.getDay();

  const monday =
    new Date(today);

  monday.setDate(
    today.getDate()
    -
    (day === 0 ? 6 : day - 1)
  );


  const language =
    getSettings().language === "bn"
      ? "bn"
      : "en";


  const weekdayNames =
    language === "bn"
      ? [
          "সোম",
          "মঙ্গল",
          "বুধ",
          "বৃহস্পতি",
          "শুক্র",
          "শনি",
          "রবি",
        ]
      : [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ];


  return Array.from(
    {
      length: 7,
    },
    (_, index) => {

      const date =
        new Date(monday);

      date.setDate(
        monday.getDate()
        +
        index
      );

      return {
        name:
          weekdayNames[index],

        key:
          getDateKey(date),
      };

    }
  );

}


export default function ProfileMoneyProgressCard() {

  const [
    streak,
    setStreak,
  ] = useState(0);


  const [
    history,
    setHistory,
  ] = useState<string[]>([]);


  const [
    freeze,
    setFreeze,
  ] = useState<FreezeData>(DEFAULT_FREEZE_DATA);


  const [
    languageVersion,
    setLanguageVersion,
  ] = useState(0);


  useEffect(() => {

    const refresh = () => {

      const player =
        getPlayer();

      setStreak(
        player.streak
      );

      setHistory(
        getStreakHistory()
      );

      setFreeze(
        getFreezeData()
      );

    };


    const handleLanguageUpdate = () => {

      setLanguageVersion(
        (value) => value + 1
      );

    };


    refresh();


    window.addEventListener(
      "player-updated",
      refresh
    );

    window.addEventListener(
      "dailyJourneyUpdated",
      refresh
    );

    window.addEventListener(
      "languageUpdated",
      handleLanguageUpdate
    );


    return () => {

      window.removeEventListener(
        "player-updated",
        refresh
      );

      window.removeEventListener(
        "dailyJourneyUpdated",
        refresh
      );

      window.removeEventListener(
        "languageUpdated",
        handleLanguageUpdate
      );

    };

  }, []);


  /*
    Forces React to re-render
    when language changes.
  */
  void languageVersion;


  const weekDays =
    getWeekDays();


  const milestones = [
    {
      days: 3,
    },
    {
      days: 7,
    },
    {
      days: 30,
    },
  ];


  return (

    <section
      className="
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-sm
      "
    >

      <div
        className="
          absolute
          -right-20
          -top-20
          h-56
          w-56
          rounded-full
          bg-orange-500/10
          blur-3xl
        "
      />


      <div className="relative">


        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
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
                rounded-2xl
                bg-orange-500/10
                p-3
              "
            >

              <Flame
                className="text-orange-500"
                size={32}
              />

            </div>


            <div>

              <p
                className="
                  font-display
                  text-5xl
                  font-medium
                  tracking-[-0.05em]
                  text-[var(--foreground)]
                "
              >
                {streak}
              </p>


              <p
                className="
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted)]
                "
              >
                {t("moneyStreak")}
              </p>

            </div>

          </div>


          <div
            className="
              rounded-xl
              bg-orange-500/10
              px-4
              py-2
              font-body
              text-xs
              font-medium
              uppercase
              tracking-[0.08em]
              text-orange-500
            "
          >
            {t("keepGoing")} 🔥
          </div>

        </div>


        {/* DESCRIPTION */}

        <p
          className="
            mt-4
            font-body
            text-sm
            leading-relaxed
            text-[var(--muted)]
          "
        >
          {t("dailyJourneyMessage")}
        </p>


        <div
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-sky-500/10
            px-3
            py-2
            font-body
            text-xs
            font-medium
            text-sky-600
          "
        >
          <Snowflake size={14} />

          {t("streakFreezes")}: {freeze.freezes}/{MAX_FREEZES}
        </div>


        {/* WEEKLY TRACKER */}

        <div
          className="
            mt-8
            grid
            grid-cols-7
            gap-2
          "
        >

          {weekDays.map((day) => {

            const completed =
              history.includes(
                day.key
              );

            const frozen =
              !completed &&
              freeze.frozenDays.includes(
                day.key
              );


            return (

              <div
                key={day.key}
                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                "
              >

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    transition

                    ${
                      completed
                        ? "border-orange-500 bg-orange-500 text-white"
                        : frozen
                          ? "border-sky-400 bg-sky-500/15 text-sky-500"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]"
                    }
                  `}
                >

                  {completed && (
                    <Check size={20} />
                  )}

                  {frozen && (
                    <Snowflake size={18} />
                  )}

                </div>


                <span
                  className="
                    text-xs
                    font-medium
                    text-[var(--muted)]
                  "
                >
                  {day.name}
                </span>

              </div>

            );

          })}

        </div>


        {/* MILESTONES */}

        <div
          className="
            mt-8
            grid
            grid-cols-3
            gap-3
          "
        >

          {milestones.map((item) => {

            const completed =
              streak >= item.days;


            return (

              <div
                key={item.days}
                className={`
                  rounded-2xl
                  border
                  p-3
                  text-center

                  ${
                    completed
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }
                `}
              >

                <Trophy
                  size={20}
                  className="
                    mx-auto
                    text-yellow-500
                  "
                />


                <p
                  className="
                    mt-2
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                  "
                >
                  {item.days}
                </p>


                <p
                  className="
                    text-xs
                    text-[var(--muted)]
                  "
                >
                  {t("days")}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>

  );

}