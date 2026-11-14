"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import NotificationBell from "@/app/components/NotificationBell";
import HomeHero from "@/app/components/HomeHero";
import MonthStats from "@/app/components/MonthStats";
import MoneyMap from "@/app/components/MoneyMap";
import FloatingActionButton from "../../components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";


import DailyJourneyCard from "../../components/DailyJourneyCard";
import TodayCoachCard from "@/app/components/TodayCoachCard";

import WelcomeBanner from "../../components/WelcomeBanner";

import RecentTransactions from "../../components/RecentTransactions";


import { useLanguage } from "@/app/context/LanguageContext";

export default function Dashboard() {
  const { language, t } = useLanguage();

  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      {/* Header */}

      <div className="mb-4 flex items-center justify-between gap-3">
        <WelcomeBanner />

        <div className="flex shrink-0 items-center gap-3">
          <NotificationBell />

          <p className="hidden text-right text-sm leading-5 text-[var(--muted)] sm:block">
            {new Date().toLocaleDateString(
              language === "bn" ? "bn-BD" : "en-GB",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </p>
        </div>
      </div>

      {/* Main */}

<div className="space-y-4">

  <HomeHero onQuickAdd={() => setQuickOpen(true)} />

  <TodayCoachCard onQuickAdd={() => setQuickOpen(true)} />

  <MonthStats />

  <MoneyMap />

  {/* Daily journey keeps the streak alive */}

  <DailyJourneyCard />

  <RecentTransactions />

  <Link
    href="/insights"
    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--primary)]"
  >
    {t("insMore")}
    <ChevronRight size={16} />
  </Link>
</div>

      <FloatingActionButton onClick={() => setQuickOpen(true)} />

      <QuickAddSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
