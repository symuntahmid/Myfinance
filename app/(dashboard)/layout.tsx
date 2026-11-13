"use client";

import { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import BottomNavigation from "@/app/components/BottomNavigation";

import { runTransactionScheduler } from "@/app/services/transactionScheduler";

import {
  requestNotificationPermission,
  resetNotificationCacheIfNewDay,
} from "@/app/services/browserNotification";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Reset notification cache if a new day has started
    resetNotificationCacheIfNewDay();

    // Ask notification permission
    requestNotificationPermission();

    // Generate recurring transactions
    runTransactionScheduler();

    // Refresh all transaction-based components
    window.dispatchEvent(
      new Event("transactionsUpdated")
    );
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:p-8 lg:pb-8">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}