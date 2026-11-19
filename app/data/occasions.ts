/* ==========================================
   FESTIVALS: Eid, Qurbani, Pohela Boishakh

   The Islamic dates come from the calendar built into the
   browser, then moved one day later because Bangladesh
   usually sees the moon a day after Saudi Arabia. The real
   day can differ by a day or two, so we always say "about".
========================================== */

import { todayLocal } from "@/app/utils/date";

export type OccasionKind =
  | "fitr"
  | "adha"
  | "boishakh"
  | "milad"
  | "durga"
  | "janmashtami"
  | "saraswati"
  | "kali"
  | "buddha"
  | "christmas";

export const OCCASION_META: Record<OccasionKind, { emoji: string; en: string; bn: string }> = {
  fitr: { emoji: "🌙", en: "Eid-ul-Fitr", bn: "ঈদুল ফিতর" },
  adha: { emoji: "🐄", en: "Eid-ul-Adha (Qurbani)", bn: "ঈদুল আযহা (কুরবানি)" },
  milad: { emoji: "🕌", en: "Eid-e-Miladunnabi", bn: "ঈদে মিলাদুন্নবী" },
  boishakh: { emoji: "🎊", en: "Pohela Boishakh", bn: "পহেলা বৈশাখ" },
  durga: { emoji: "🪔", en: "Durga Puja", bn: "দুর্গাপূজা" },
  janmashtami: { emoji: "🦚", en: "Janmashtami", bn: "জন্মাষ্টমী" },
  saraswati: { emoji: "📚", en: "Saraswati Puja", bn: "সরস্বতী পূজা" },
  kali: { emoji: "🕯️", en: "Kali Puja", bn: "কালীপূজা" },
  buddha: { emoji: "☸️", en: "Buddha Purnima", bn: "বুদ্ধ পূর্ণিমা" },
  christmas: { emoji: "🎄", en: "Christmas", bn: "বড়দিন" },
};

// Festivals that follow the Hindu or Buddhist moon calendar. The browser cannot work
// these out, so the dates are listed by hand from the government holiday list
// (2027 list published by the cabinet) and the Hindu calendar. Add the next year when
// it is published. Dates are "about": the real day can move by a day.
const FIXED_DATES: Partial<Record<OccasionKind, string[]>> = {
  durga: ["2027-10-10"], // Bijoya Dashami (Nabami is the day before)
  janmashtami: ["2027-08-25"],
  saraswati: ["2027-02-11"],
  kali: ["2027-10-29"],
  buddha: ["2027-05-20"],
};

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

  // Eid-e-Miladunnabi: 12 Rabi al-Awwal, the same one-day shift as Eid.
  const milad = islamicDay(3, 12, from);

  if (milad) {
    const date = plusDays(milad, 1);

    if (date.getTime() >= today.getTime()) {
      list.push({ id: `milad-${date.getFullYear()}`, kind: "milad", date, year: date.getFullYear() });
    }
  }

  // Christmas is always 25 December.
  let christmas = new Date(today.getFullYear(), 11, 25);

  if (christmas.getTime() < today.getTime()) christmas = new Date(today.getFullYear() + 1, 11, 25);

  list.push({
    id: `christmas-${christmas.getFullYear()}`,
    kind: "christmas",
    date: christmas,
    year: christmas.getFullYear(),
  });

  // Hindu and Buddhist festivals from the list above: the next one of each.
  (Object.keys(FIXED_DATES) as OccasionKind[]).forEach((kind) => {
    const next = (FIXED_DATES[kind] ?? [])
      .map((text) => {
        const [y, m, d] = text.split("-").map(Number);

        return new Date(y, m - 1, d);
      })
      .find((date) => date.getTime() >= today.getTime());

    if (next) list.push({ id: `${kind}-${next.getFullYear()}`, kind, date: next, year: next.getFullYear() });
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
  milad: [
    { id: "charity", emoji: "🤲", en: "Charity and donation", bn: "দান ও সদকা" },
    { id: "food", emoji: "🍲", en: "Food (tabarruk)", bn: "খাবার (তাবারুক)" },
    { id: "decor", emoji: "🕌", en: "Decoration and lights", bn: "সাজসজ্জা ও আলোকসজ্জা" },
  ],
  durga: [
    { id: "clothes", emoji: "👗", en: "New clothes", bn: "নতুন পোশাক" },
    { id: "puja", emoji: "🪔", en: "Puja items and offerings", bn: "পূজার সামগ্রী ও ভোগ" },
    { id: "food", emoji: "🍬", en: "Food and sweets", bn: "খাবার ও মিষ্টি" },
    { id: "outing", emoji: "🎡", en: "Pandal visit and outing", bn: "মণ্ডপ ঘোরা ও বেড়ানো" },
    { id: "travel", emoji: "🚌", en: "Travel home", bn: "বাড়ি যাওয়ার ভাড়া" },
  ],
  janmashtami: [
    { id: "puja", emoji: "🪔", en: "Puja items and offerings", bn: "পূজার সামগ্রী ও ভোগ" },
    { id: "food", emoji: "🍬", en: "Food and sweets", bn: "খাবার ও মিষ্টি" },
    { id: "donate", emoji: "🙏", en: "Donation", bn: "দান" },
  ],
  saraswati: [
    { id: "puja", emoji: "🌼", en: "Flowers and puja items", bn: "ফুল ও পূজার সামগ্রী" },
    { id: "books", emoji: "📚", en: "Books and pens", bn: "বই ও কলম" },
    { id: "food", emoji: "🍛", en: "Food and prasad", bn: "খিচুড়ি ও প্রসাদ" },
  ],
  kali: [
    { id: "puja", emoji: "🪔", en: "Puja items and offerings", bn: "পূজার সামগ্রী ও ভোগ" },
    { id: "lights", emoji: "🕯️", en: "Lamps and decoration", bn: "প্রদীপ ও সাজসজ্জা" },
    { id: "food", emoji: "🍬", en: "Food and sweets", bn: "খাবার ও মিষ্টি" },
  ],
  buddha: [
    { id: "offer", emoji: "🌼", en: "Flowers and offerings", bn: "ফুল ও নৈবেদ্য" },
    { id: "donate", emoji: "🙏", en: "Donation", bn: "দান" },
    { id: "food", emoji: "🍲", en: "Food", bn: "খাবার" },
  ],
  christmas: [
    { id: "clothes", emoji: "👗", en: "New clothes", bn: "নতুন পোশাক" },
    { id: "food", emoji: "🎂", en: "Cake and food", bn: "কেক ও খাবার" },
    { id: "gifts", emoji: "🎁", en: "Gifts", bn: "উপহার" },
    { id: "decor", emoji: "🎄", en: "Tree and decoration", bn: "গাছ ও সাজসজ্জা" },
  ],
};
