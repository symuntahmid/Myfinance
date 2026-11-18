"use client";

import { useState } from "react";

import BudgetPlan from "@/app/components/BudgetPlan";
import SpendingMindMap from "@/app/components/SpendingMindMap";
import FloatingActionButton from "@/app/components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";

export default function MoneyPage() {
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="space-y-5 pb-28">
      <BudgetPlan />

      <SpendingMindMap />

      <FloatingActionButton onClick={() => setQuickOpen(true)} />

      <QuickAddSheet open={quickOpen} onClose={() => setQuickOpen(false)} />
    </div>
  );
}
