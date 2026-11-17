"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/app/context/LanguageContext";

export default function DashboardTabs() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const bn = language === "bn";

  // Only the front page has the shortcut bar.
  if (pathname !== "/dashboard") return null;

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
      className="sticky top-0 z-20 -mx-4 -mt-5 mb-2 flex gap-5 overflow-x-auto bg-[var(--background)] px-4 pt-3 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,#000_88%,transparent)] sm:-mx-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-5 [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 py-1.5 text-[13px] ${
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
