"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Flag,
  Home,
  Hourglass,
  Moon,
  Target,
  Users,
} from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";

const TEXT = {
  en: {
    title: "Plan ahead",
    sub: "Decide where your money goes, and see where it takes you.",
    items: [
      { href: "/goals", icon: Target, name: "Savings goals", about: "Save for a trip, a phone, or anything you want." },
      { href: "/occasions", icon: Moon, name: "Eid and festivals", about: "Put aside a little each month for the big days." },
      { href: "/home-plan", icon: Home, name: "Rent to own", about: "A short story, then your plan to own a home." },
      { href: "/debt-plan", icon: BadgeCheck, name: "Debt free", about: "Pay off what you owe, in the smartest order." },
      { href: "/somiti", icon: Users, name: "Somiti", about: "Track who paid and whose turn it is." },
      { href: "/time-machine", icon: Hourglass, name: "Time Machine", about: "See how saving more changes your future." },
      { href: "/freedom", icon: Flag, name: "Freedom Path", about: "How much you need to stop worrying about money." },
    ],
  },
  bn: {
    title: "সামনের পরিকল্পনা",
    sub: "টাকা কোথায় যাবে ঠিক করুন, আর দেখুন সামনে কী হতে পারে।",
    items: [
      { href: "/goals", icon: Target, name: "সঞ্চয়ের লক্ষ্য", about: "ভ্রমণ, ফোন বা যা চান তার জন্য জমান।" },
      { href: "/occasions", icon: Moon, name: "ঈদ ও উৎসব", about: "বড় দিনের জন্য প্রতি মাসে অল্প অল্প আলাদা করুন।" },
      { href: "/home-plan", icon: Home, name: "ভাড়া থেকে নিজের বাড়ি", about: "ছোট একটি গল্প, তারপর নিজের বাড়ির পরিকল্পনা।" },
      { href: "/debt-plan", icon: BadgeCheck, name: "দেনামুক্ত", about: "যা ধার আছে, সবচেয়ে বুদ্ধিমানের ক্রমে শোধ করুন।" },
      { href: "/somiti", icon: Users, name: "সমিতি", about: "কে দিল আর কার পালা, হিসাব রাখুন।" },
      { href: "/time-machine", icon: Hourglass, name: "টাইম মেশিন", about: "বেশি জমালে ভবিষ্যৎ কেমন বদলায় দেখুন।" },
      { href: "/freedom", icon: Flag, name: "ফ্রিডম পাথ", about: "টাকার চিন্তা ছাড়তে কত লাগবে।" },
    ],
  },
} as const;

export default function AheadPage() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];
  const firstHrefs = ["/goals", "/occasions", "/somiti", "/debt-plan"];
  const main = x.items.filter((item) => firstHrefs.includes(item.href));
  const later = x.items.filter((item) => !firstHrefs.includes(item.href));

  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      <ul className="space-y-3">
        {main.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--primary)]">
                  <Icon size={22} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="block text-xs text-[var(--muted)]">{item.about}</span>
                </span>

                <ChevronRight size={18} className="text-[var(--muted)]" />
              </Link>
            </li>
          );
        })}
      </ul>

      <details className="group">
        <summary className="cursor-pointer list-none rounded-full border border-[var(--border)] bg-[var(--card)] py-2.5 text-center text-sm font-semibold">
          {language === "bn" ? "বড় স্বপ্ন ও লম্বা পরিকল্পনা" : "Big dreams and long-term plans"}
        </summary>

        <div className="mt-3">
      <ul className="space-y-3">
        {later.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--primary)]">
                  <Icon size={22} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="block text-xs text-[var(--muted)]">{item.about}</span>
                </span>

                <ChevronRight size={18} className="text-[var(--muted)]" />
              </Link>
            </li>
          );
        })}
      </ul>
        </div>
      </details>
    </div>
  );
}
