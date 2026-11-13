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


  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? t("greetingMorning")
      : hour >= 12 && hour < 17
      ? t("greetingAfternoon")
      : hour >= 17 && hour < 21
      ? t("greetingEvening")
      : t("greetingNight");

  return (

    <div>

      <h2
        className="
          font-display
          max-w-full
          truncate
          text-[28px]
          leading-[1.2]
          text-[var(--foreground)]
          sm:text-4xl
        "
      >
        {greeting}, {displayName}
      </h2>

      <p
        className={`
          mt-1.5
          max-w-xl
          text-sm
          leading-6
          ${
            journeyCompleted
              ? "font-medium text-[var(--primary)]"
              : "text-[var(--muted)]"
          }
        `}
      >
        {journeyCompleted && "🎉 "}
        {message}
      </p>

    </div>

  );
}
