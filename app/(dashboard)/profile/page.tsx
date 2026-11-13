"use client";

import Link from "next/link";

import ProfileOverview from "@/app/components/profile/ProfileOverview";
import LifeGoalsCard from "@/app/components/profile/LifeGoalsCard";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {t("myProfile")}
        </h1>

        <Link
          href="/profile/edit"
          className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]"
        >
          {t("editProfile")}
        </Link>
      </div>

      <ProfileOverview />

      <LifeGoalsCard />

      <Link
        href="/profile/developer"
        className="block text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        {t("developerMode")}
      </Link>
    </div>
  );
}
