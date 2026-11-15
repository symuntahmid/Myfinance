"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { getBadgeProgress } from "@/app/data/badgeProgress";

const TEXT = {
  en: {
    title: "Badges",
    sub: "Small wins that show your progress.",
    of: "{a} of {b} unlocked",
    next: "Next up",
    done: "Unlocked",
    all: "All badges",
    premium: "Premium badges",
    none: "Earn XP by adding entries and finishing your Daily Journey. Your first badge is close.",
  },
  bn: {
    title: "ব্যাজ",
    sub: "ছোট ছোট অর্জন, যা আপনার অগ্রগতি দেখায়।",
    of: "{b}টির মধ্যে {a}টি পেয়েছেন",
    next: "এরপর যা পাবেন",
    done: "পেয়েছেন",
    all: "সব ব্যাজ",
    premium: "প্রিমিয়াম ব্যাজ",
    none: "এন্ট্রি যোগ করে ও ডেইলি জার্নি শেষ করে XP জিতুন। প্রথম ব্যাজ কাছেই।",
  },
} as const;

type Item = ReturnType<typeof getBadgeProgress>[number];

function Row({ item }: { item: Item }) {
  const { badge } = item;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-2xl">
        {badge.icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{badge.name}</p>
        <p className="truncate text-xs text-[var(--muted)]">
          {badge.requirement}
        </p>

        {!item.unlocked && (
          <div className="mt-2 h-1.5 rounded-full bg-[var(--border)]">
            <div
              className="h-1.5 rounded-full bg-[var(--primary)]"
              style={{ width: `${Math.min(100, item.progress)}%` }}
            />
          </div>
        )}
      </div>

      <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">
        {item.unlocked ? "✓" : `${Math.round(item.progress)}%`}
      </span>
    </li>
  );
}

export default function BadgesPage() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];

  const items = getBadgeProgress();

  const unlocked = items.filter((i) => i.unlocked);
  const regular = items.filter((i) => !i.unlocked && !i.badge.premium);
  const premium = items.filter((i) => i.badge.premium && !i.unlocked);

  const next = [...regular].sort((a, b) => b.progress - a.progress).slice(0, 3);

  return (
    <div className="space-y-5 pb-24">
      <header className="flex items-start gap-3">
        <Link
          href="/profile"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)]"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-xl font-bold">{x.title}</h1>
          <p className="text-sm text-[var(--muted)]">{x.sub}</p>
        </div>
      </header>

      <div className="rounded-2xl bg-[var(--forest)] p-4 text-[var(--on-forest)]">
        <p className="text-sm font-semibold">
          {x.of
            .replace("{a}", String(unlocked.length))
            .replace("{b}", String(items.length))}
        </p>

        <div className="mt-2 h-2 rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-[var(--gold)]"
            style={{
              width: `${items.length ? (unlocked.length / items.length) * 100 : 0}%`,
            }}
          />
        </div>

        {unlocked.length === 0 && (
          <p className="mt-3 text-xs opacity-80">{x.none}</p>
        )}
      </div>

      {unlocked.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold">{x.done}</h2>
          <ul className="space-y-2">
            {unlocked.map((i) => (
              <Row key={i.badge.id} item={i} />
            ))}
          </ul>
        </section>
      )}

      {next.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold">{x.next}</h2>
          <ul className="space-y-2">
            {next.map((i) => (
              <Row key={i.badge.id} item={i} />
            ))}
          </ul>
        </section>
      )}

      {[
        { label: x.all, list: regular.filter((i) => !next.includes(i)) },
        { label: x.premium, list: premium },
      ]
        .filter((g) => g.list.length > 0)
        .map((g) => (
          <details
            key={g.label}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
              {g.label} ({g.list.length})
              <ChevronRight
                size={16}
                className="transition group-open:rotate-90"
              />
            </summary>

            <ul className="space-y-2 px-3 pb-3">
              {g.list.map((i) => (
                <Row key={i.badge.id} item={i} />
              ))}
            </ul>
          </details>
        ))}
    </div>
  );
}
