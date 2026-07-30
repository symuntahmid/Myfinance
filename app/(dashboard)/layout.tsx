"use client";

import { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import BottomNavigation from "@/app/components/BottomNavigation";

import { runTransactionScheduler } from "@/app/services/transactionScheduler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    runTransactionScheduler();

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