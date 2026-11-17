"use client";

import Link from "next/link";

import { useLanguage } from "@/app/context/LanguageContext";

export default function DashboardTabs() {
  const { t, language } = useLanguage();

  const tabs = [
    { href: "/dashboard", name: language === "bn" ? "ওভারভিউ" : "Overview", active: true },
    { href: "/accounts", name: t("heroMove"), active: false },
    { href: "/reports", name: t("reports"), active: false },
    { href: "/goals", name: language === "bn" ? "লক্ষ্য" : "Goals", active: false },
    { href: "/cash-flow", name: t("cfTitle"), active: false },
  ];

  return (
    <nav
      aria-label="Shortcuts"
      className="-mx-4 mb-3 flex gap-6 overflow-x-auto border-b border-[var(--border)] px-4"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={`shrink-0 border-b-2 pb-2.5 pt-2 text-sm font-semibold ${
            tab.active
              ? "border-[var(--primary)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted)]"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
