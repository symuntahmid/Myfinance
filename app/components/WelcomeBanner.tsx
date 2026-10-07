"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  type UserProfile,
} from "@/app/data/profile";

import {
  getLevel,
} from "@/app/data/player";

import {
  getJourneyProgress,
} from "@/app/data/dailyJourney";

import { t } from "@/app/data/i18n";


export default function WelcomeBanner() {

  const [profile, setProfile] =
    useState<UserProfile>(
      getProfile()
    );


  const [level, setLevel] =
    useState(
      getLevel()
    );


  const [journey, setJourney] =
    useState(
      getJourneyProgress()
    );


  const [, refreshLanguage] =
    useState(0);


  useEffect(() => {

    const refresh = () => {

      setProfile(
        getProfile()
      );

      setLevel(
        getLevel()
      );

      setJourney(
        getJourneyProgress()
      );

    };


    const handleLanguageUpdate = () => {

      refreshLanguage(
        value => value + 1
      );

    };


    refresh();


    window.addEventListener(
      "profileUpdated",
      refresh
    );

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
        "profileUpdated",
        refresh
      );

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


  const journeyCompleted =
    journey.total > 0 &&
    journey.completed >= journey.total;


  let message =
    t("dailyJourneyChallenge");


  if (journeyCompleted) {

    message =
      t("dailyJourneyComplete");

  }
  else if (
    level.nextLevelXP -
    level.currentXP <= 20
  ) {

    const xpRemaining =
      level.nextLevelXP -
      level.currentXP;


    message =
      t("xpUntilLevel")
        .replace(
          "{xp}",
          String(xpRemaining)
        )
        .replace(
          "{level}",
          String(level.level + 1)
        );

  }


  const displayName =
    profile.displayName ||
    `${profile.firstName} ${profile.lastName}`.trim() ||
    profile.username ||
    "User";


  return (

    <div className="mb-6 md:mb-8">


      {/* Greeting */}

      <h2
        className="
          font-display
          max-w-full
          truncate
          text-4xl
          font-medium
          tracking-[-0.045em]
          leading-[1.05]
          text-[var(--foreground)]
          sm:text-5xl
        "
      >
        {t("welcomeBack")},{" "}
        {displayName} 👋
      </h2>


      {/* Journey Message */}

      <div
        className={`
          mt-3
          max-w-2xl
          rounded-2xl
          border
          px-4
          py-3
          text-sm
          leading-6
          font-body
          transition-all

          ${
            journeyCompleted
              ? `
                border-emerald-400/40
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-400
                shadow-sm
              `
              : `
                border-[var(--border)]
                bg-[var(--card)]
                text-[var(--muted)]
                shadow-sm
              `
          }
        `}
      >

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          {journeyCompleted && (

            <span
              className="
                mt-0.5
                text-lg
              "
            >
              🎉
            </span>

          )}


          <p
            className="
              font-body
              text-sm
              font-normal
              leading-6
              tracking-[-0.015em]
            "
          >
            {message}
          </p>

        </div>

      </div>

    </div>

  );

}