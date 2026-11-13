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

    <div className="min-w-0">

      <h2
        className="
          font-display
          truncate
          text-[22px]
          leading-tight
          text-[var(--foreground)]
        "
      >
        {greeting}, {displayName}
      </h2>

      <p className="mt-0.5 truncate text-[13px] text-[var(--muted)]">
        {journeyCompleted && "🎉 "}
        {message}
      </p>

    </div>

  );
}
