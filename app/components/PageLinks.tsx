"use client";

import Link from "next/link";

import { useLanguage } from "@/app/context/LanguageContext";

type Item = { href: string; en: string; bn: string };

// A quiet row of links to related pages, so the menus can stay short.
export default function PageLinks({ items }: { items: Item[] }) {
  const { language } = useLanguage();

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-semibold text-[var(--foreground)]"
        >
          {language === "bn" ? item.bn : item.en} ›
        </Link>
      ))}
    </nav>
  );
}
