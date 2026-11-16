/* ==========================================
   FESTIVALS: Eid, Qurbani, Pohela Boishakh

   The Islamic dates come from the calendar built into the
   browser, then moved one day later because Bangladesh
   usually sees the moon a day after Saudi Arabia. The real
   day can differ by a day or two, so we always say "about".
========================================== */

import { todayLocal } from "@/app/utils/date";

export type OccasionKind = "fitr" | "adha" | "boishakh";

export type Occasion = {
  id: string; // e.g. "fitr-2027"
  kind: OccasionKind;
  date: Date;
  year: number;
};

const DAY = 86_400_000;

/* First day on or after `from` that is month/day in the Islamic calendar. */
function islamicDay(month: number, day: number, from: Date): Date | null {
  let formatter: Intl.DateTimeFormat;

  try {
    formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      month: "numeric",
      day: "numeric",
    });
  } catch {
    return null;
  }

  for (let i = 0; i < 400; i += 1) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const parts = formatter.formatToParts(date);
    const m = Number(parts.find((p) => p.type === "month")?.value);
    const d = Number(parts.find((p) => p.type === "day")?.value);

    if (m === month && d === day) return date;
  }

  return null;
}

const plusDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export function upcomingOccasions(now: Date = new Date()): Occasion[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const list: Occasion[] = [];

  // Search from a few days back so a festival "today" still shows.
  const from = plusDays(today, -1);

  const fitr = islamicDay(10, 1, from);
  const adha = islamicDay(12, 10, from);

  [
    ["fitr", fitr],
    ["adha", adha],
  ].forEach(([kind, found]) => {
    if (!found) return;

    const date = plusDays(found as Date, 1);

    if (date.getTime() >= today.getTime()) {
      list.push({
        id: `${kind}-${date.getFullYear()}`,
        kind: kind as OccasionKind,
        date,
        year: date.getFullYear(),
      });
    }
  });

  let boishakh = new Date(today.getFullYear(), 3, 14);

  if (boishakh.getTime() < today.getTime()) {
    boishakh = new Date(today.getFullYear() + 1, 3, 14);
  }

  list.push({
    id: `boishakh-${boishakh.getFullYear()}`,
    kind: "boishakh",
    date: boishakh,
    year: boishakh.getFullYear(),
  });

  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function daysUntil(date: Date, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((date.getTime() - today.getTime()) / DAY);
}

/* Whole months left, at least 1, so the monthly amount is never silly. */
export function monthsToSave(date: Date, now: Date = new Date()): number {
  const days = daysUntil(date, now);

  return Math.max(Math.round(days / 30), 1);
}

export function monthlyNeed(target: number, saved: number, months: number): number {
  return Math.max(Math.ceil((target - saved) / Math.max(months, 1)), 0);
}

/* How much should be saved by now to be on time (straight line). */
export function expectedSaved(
  target: number,
  createdAt: string,
  due: Date,
  now: Date = new Date()
): number {
  const start = new Date(createdAt).getTime();
  const end = due.getTime();

  if (Number.isNaN(start) || end <= start) return target;

  const share = Math.min(Math.max((now.getTime() - start) / (end - start), 0), 1);

  return Math.round(target * share);
}

export const isoDay = (date: Date) => todayLocal(date);

/* What each festival usually costs, as lines the person fills in. */
export const LINES: Record<OccasionKind, { id: string; emoji: string; en: string; bn: string }[]> = {
  fitr: [
    { id: "clothes", emoji: "👕", en: "New clothes", bn: "নতুন পোশাক" },
    { id: "food", emoji: "🍲", en: "Food and sweets", bn: "খাবার ও মিষ্টি" },
    { id: "eidi", emoji: "🎁", en: "Eidi and gifts", bn: "ঈদি ও উপহার" },
    { id: "travel", emoji: "🚌", en: "Travel home", bn: "বাড়ি যাওয়ার ভাড়া" },
  ],
  adha: [
    { id: "animal", emoji: "🐄", en: "Animal or cow share", bn: "পশু বা গরুর অংশ" },
    { id: "extras", emoji: "🧂", en: "Spices and extras", bn: "মসলা ও আনুষঙ্গিক" },
    { id: "clothes", emoji: "👕", en: "New clothes", bn: "নতুন পোশাক" },
    { id: "travel", emoji: "🚌", en: "Travel home", bn: "বাড়ি যাওয়ার ভাড়া" },
  ],
  boishakh: [
    { id: "clothes", emoji: "👗", en: "New clothes", bn: "নতুন পোশাক" },
    { id: "food", emoji: "🍛", en: "Food and outing", bn: "খাবার ও ঘোরাঘুরি" },
    { id: "gifts", emoji: "🎁", en: "Gifts", bn: "উপহার" },
  ],
};
