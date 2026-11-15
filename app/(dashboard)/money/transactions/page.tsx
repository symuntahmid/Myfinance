"use client";

import { useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import TransactionTable from "@/app/components/TransactionTable";
import FloatingActionButton from "@/app/components/FloatingActionButton";
import QuickAddSheet from "@/app/components/QuickAddSheet";

export default function TransactionsPage() {
  const { t } = useLanguage();

  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-bold">{t("txTitle")}</h1>

      <TransactionTable />

      <FloatingActionButton onClick={() => setQuickOpen(true)} />

      <QuickAddSheet open={quickOpen} onClose={() => setQuickOpen(false)} />
    </div>
  );
}
