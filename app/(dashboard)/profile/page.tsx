"use client";

import ProfileCard from "@/app/components/ProfileCard";
import AchievementCard from "@/app/components/AchievementCard";
import FinancialGoalsCard from "@/app/components/FinancialGoalsCard";
import FinancialHealthCard from "@/app/components/FinancialHealthCard";
import { resetLessons } from "@/app/data/lessons";
import { getFinancialHealthScore } from "../../data/transactions";

export default function ProfilePage() {
  const score = getFinancialHealthScore();
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

<FinancialHealthCard score={score} />
  <FinancialGoalsCard />

</div>

      </div>

    </div>
  );
}

<button
  onClick={() => {
    resetLessons();
    location.reload();
  }}
  className="mt-8 w-full rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
>
  🔄 Reset Academy (Developer)
</button>