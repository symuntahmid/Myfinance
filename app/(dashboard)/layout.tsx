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

      <main className="flex-1 p-8 pb-24 lg:pb-8">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}