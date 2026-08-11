"use client";

import ProfileCard from "@/app/components/ProfileCard";
import GlobalComparisonCard from "@/app/components/profile/GlobalComparisonCard";
import BadgesCard from "@/app/components/profile/BadgesCard";

export default function ProfilePage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Your financial identity, progress, and money habits.
        </p>
      </div>

      {/* PROFILE */}
      <ProfileCard />

    

      {/* BADGES */}
      <BadgesCard />

      {/* GLOBAL COMPARISON */}
      <GlobalComparisonCard />

    </div>
  );
}