"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/app/context/LanguageContext";

export default function DashboardTabs() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const bn = language === "bn";

  const tabs = [
    { href: "/dashboard", name: bn ? "হোম" : "Home" },
    { href: "/accounts", name: t("heroMove") },
    { href: "/reports", name: t("reports") },
    { href: "/goals", name: bn ? "লক্ষ্য" : "Goals" },
    { href: "/cash-flow", name: t("cfTitle") },
    { href: "/coach", name: bn ? "কোচ" : "Coach" },
  ];

  return (
    <nav
      aria-label="Shortcuts"
      className="-mx-4 mb-3 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 py-2 text-sm ${
              active
                ? "font-extrabold text-[var(--foreground)]"
                : "font-medium text-[var(--muted)]"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
