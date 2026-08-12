"use client";

import ProfileCard from "@/app/components/ProfileCard";
import ProfileMoneyProgressCard from "@/app/components/profile/ProfileMoneyProgressCard";
import ProfileSavingCard from "@/app/components/profile/ProfileSavingCard";
import BadgesCard from "@/app/components/profile/BadgesCard";
import GlobalComparisonCard from "@/app/components/profile/GlobalComparisonCard";

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Your financial identity, progress, and money habits.
        </p>
      </div>

      {/* PROFILE + LEVEL */}
      <ProfileCard />

      {/* MONEY STREAK */}
      <ProfileMoneyProgressCard />

      {/* SAVING + BADGES */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSavingCard />
        <BadgesCard />
      </div>

      {/* GLOBAL COMPARISON */}
      <GlobalComparisonCard />

    </div>
  );
}