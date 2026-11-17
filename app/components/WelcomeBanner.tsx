"use client";

import { useEffect, useState } from "react";

import { getProfile, type UserProfile } from "@/app/data/profile";
import { t } from "@/app/data/i18n";

export default function WelcomeBanner() {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [, redraw] = useState(0);

  useEffect(() => {
    const refresh = () => setProfile(getProfile());
    const again = () => redraw((value) => value + 1);

    refresh();

    window.addEventListener("profileUpdated", refresh);
    window.addEventListener("languageUpdated", again);

    return () => {
      window.removeEventListener("profileUpdated", refresh);
      window.removeEventListener("languageUpdated", again);
    };
  }, []);

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

  const initial = Array.from(displayName.trim())[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white"
      >
        {initial}
      </span>

      <div className="min-w-0 leading-tight">
        <p className="truncate text-xs text-[var(--muted)]">{greeting}</p>
        <h2 className="truncate text-base font-semibold text-[var(--foreground)]">
          {displayName}
        </h2>
      </div>
    </div>
  );
}
