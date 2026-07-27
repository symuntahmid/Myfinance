"use client";

import ProfileCard from "@/app/components/ProfileCard";
import AchievementCard from "@/app/components/AchievementCard";
import FinancialGoalsCard from "@/app/components/FinancialGoalsCard";
import FinancialHealthCard from "@/app/components/FinancialHealthCard";


export default function ProfilePage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Your financial identity, progress, and achievements.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <ProfileCard />
        </div>

        <AchievementCard />

        <div className="grid gap-6 lg:grid-cols-2">

<FinancialHealthCard />
  <FinancialGoalsCard />

</div>

      </div>

    </div>
  );
}