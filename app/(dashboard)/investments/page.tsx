"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import PortfolioTab from "@/app/components/invest/PortfolioTab";
import GrowTab from "@/app/components/invest/GrowTab";
import RetireTab from "@/app/components/invest/RetireTab";
import LearnTab from "@/app/components/invest/LearnTab";
import { useLanguage } from "@/app/context/LanguageContext";

type Tab = "portfolio" | "grow" | "retire" | "learn";

export default function InvestmentsPage() {
  const { t } = useLanguage();

  const [tab, setTab] = useState<Tab>("portfolio");

  const tabs: [Tab, string][] = [
    ["portfolio", t("ivTabPortfolio")],
    ["grow", t("ivTabGrow")],
    ["retire", t("ivTabRetire")],
    ["learn", t("ivTabLearn")],
  ];

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{t("ivTitle")}</h1>
          <p className="text-sm text-[var(--muted)]">{t("ivSub")}</p>
        </div>

        {tab === "portfolio" && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("openAddInvestment"))}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            {t("ivAdd")}
          </button>
        )}
      </header>

      <div className="grid grid-cols-4 gap-1 rounded-full bg-[var(--border)]/60 p-1">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full py-2 text-xs font-bold ${
              tab === id ? "bg-[var(--card)] text-[var(--primary)] shadow-sm" : "text-[var(--muted)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "portfolio" && <PortfolioTab onGrow={() => setTab("grow")} />}
      {tab === "grow" && <GrowTab />}
      {tab === "retire" && <RetireTab />}
      {tab === "learn" && <LearnTab />}
    </div>
  );
}
