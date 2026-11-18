"use client";

import { useState } from "react";

import NotificationBell from "@/app/components/NotificationBell";
import HomeHero from "@/app/components/HomeHero";
import FloatingActionButton from "../../components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";


import VoiceButton from "@/app/components/VoiceButton";
import BudgetRings from "@/app/components/BudgetRings";

import WelcomeBanner from "../../components/WelcomeBanner";
import BackupNudge from "@/app/components/BackupNudge";
import FirstRunWelcome from "@/app/components/FirstRunWelcome";

import HomeToday from "@/app/components/HomeToday";
import RecentTransactions from "../../components/RecentTransactions";


import { useLanguage } from "@/app/context/LanguageContext";

export default function Dashboard() {
  const { language } = useLanguage();

  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      {/* Header */}

      <div className="mb-2.5 flex items-center justify-between gap-3">
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

<div className="space-y-3">

  <HomeHero />

  <BudgetRings />

  <VoiceButton />

  <RecentTransactions />

  <HomeToday />

  <BackupNudge />
</div>

      <FirstRunWelcome />

      <FloatingActionButton onClick={() => setQuickOpen(true)} />

      <QuickAddSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
