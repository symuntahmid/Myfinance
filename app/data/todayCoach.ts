/* ==========================================
   TODAY'S COACH

   Two small, pure pieces of logic:

   1. getDayReminders  - reminders tied to the date:
      salary day, rent day, Ramadan and Eid season.
   2. pickNudge        - ONE short, useful nudge for
      today, chosen from the user's own data.

   Both return translation keys (never text), so the
   screen can show them in English or Bangla.
========================================== */

import type { TranslationKey } from "./translations";
import { addDays } from "./streakFreeze";

export type CoachParams = Record<string, string | number>;

export type CoachCta = "quickAdd" | "goals" | "reports";

export type CoachNudge = {
  id: string;
  key: TranslationKey;
  params?: CoachParams;
  cta?: CoachCta;
};

export type CoachReminder = {
  id: string;
  key: TranslationKey;
  params?: CoachParams;
  cta?: CoachCta;
};

type CoachTransaction = {
  type: string;
  category?: string;
  amount: number;
  date: string;
};


/* ==========================================
   DATE HELPERS
========================================== */

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// How many days from `today` until the next time it is `day`
// of the month (0 = today). Short months are handled, so
// "31" means the last day of a 30-day month.
export function daysUntilDayOfMonth(
  today: Date,
  day: number
): number {
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const thisMonthTarget = new Date(
    today.getFullYear(),
    today.getMonth(),
    Math.min(
      day,
      daysInMonth(today.getFullYear(), today.getMonth())
    )
  );

  let target = thisMonthTarget;

  if (target < startOfToday) {
    const nextMonth = today.getMonth() + 1;
    const nextYear =
      today.getFullYear() + (nextMonth > 11 ? 1 : 0);
    const nextIndex = nextMonth % 12;

    target = new Date(
      nextYear,
      nextIndex,
      Math.min(day, daysInMonth(nextYear, nextIndex))
    );
  }

  return Math.round(
    (target.getTime() - startOfToday.getTime()) / 86_400_000
  );
}


/* ==========================================
   ISLAMIC CALENDAR (for Ramadan and Eid season)

   Uses the browser's built-in calendar, so no dates
   are hard-coded. It can differ from Bangladesh's
   moon sighting by about a day, which is fine here
   because we only talk about "Eid is close".
========================================== */

export function hijriParts(
  date: Date
): { month: number; day: number } | null {
  try {
    const parts = new Intl.DateTimeFormat(
      "en-u-ca-islamic-umalqura-nu-latn",
      { day: "numeric", month: "numeric", year: "numeric" }
    ).formatToParts(date);

    const month = Number(
      parts.find((part) => part.type === "month")?.value
    );

    const day = Number(
      parts.find((part) => part.type === "day")?.value
    );

    if (!month || !day) return null;

    return { month, day };
  } catch {
    return null;
  }
}


/* ==========================================
   REMINDERS
========================================== */

export function getDayReminders(input: {
  date: Date;
  salaryDay?: number | null;
  rentDay?: number | null;
}): CoachReminder[] {
  const { date, salaryDay, rentDay } = input;

  const reminders: CoachReminder[] = [];

  if (salaryDay && salaryDay >= 1 && salaryDay <= 31) {
    const days = daysUntilDayOfMonth(date, salaryDay);

    if (days === 0) {
      reminders.push({
        id: "salary-today",
        key: "reminderSalaryToday",
        cta: "goals",
      });
    } else if (days === 1) {
      reminders.push({
        id: "salary-tomorrow",
        key: "reminderSalaryTomorrow",
      });
    }
  }

  if (rentDay && rentDay >= 1 && rentDay <= 31) {
    const days = daysUntilDayOfMonth(date, rentDay);

    if (days === 0) {
      reminders.push({
        id: "rent-today",
        key: "reminderRentToday",
      });
    } else if (days >= 1 && days <= 3) {
      reminders.push({
        id: "rent-soon",
        key: "reminderRentSoon",
        params: { days },
      });
    }
  }

  const hijri = hijriParts(date);

  if (hijri) {
    // Ramadan is month 9.
    if (hijri.month === 9) {
      if (hijri.day >= 20) {
        reminders.push({
          id: "eid-fitr",
          key: "reminderEidFitr",
          cta: "goals",
        });
      } else {
        reminders.push({
          id: "ramadan",
          key: "reminderRamadan",
        });
      }
    }

    // Dhul Hijjah is month 12. Eid-ul-Adha is on day 10.
    if (hijri.month === 12 && hijri.day <= 9) {
      reminders.push({
        id: "eid-adha",
        key: "reminderEidAdha",
        cta: "goals",
      });
    }
  }

  return reminders.slice(0, 2);
}


/* ==========================================
   DAILY NUDGE
========================================== */

const TIP_KEYS: TranslationKey[] = [
  "nudgeTip1",
  "nudgeTip2",
  "nudgeTip3",
  "nudgeTip4",
  "nudgeTip5",
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);

  return Math.floor(
    (date.getTime() - start.getTime()) / 86_400_000
  );
}

function sumExpenses(
  transactions: CoachTransaction[],
  fromKey: string,
  toKey: string
): number {
  return transactions
    .filter(
      (item) =>
        item.type === "Expense" &&
        item.date.slice(0, 10) >= fromKey &&
        item.date.slice(0, 10) <= toKey
    )
    .reduce((sum, item) => sum + item.amount, 0);
}

export function pickNudge(input: {
  transactions: CoachTransaction[];
  now: Date;
  // Turns a stored category (like "🍔 Food") into display text.
  categoryLabel?: (category: string) => string;
}): CoachNudge {
  const { transactions, now } = input;

  const labelFor =
    input.categoryLabel ??
    ((category: string) =>
      category.replace(/^[^\p{L}\p{N}]+/u, ""));

  const today = dateKey(now);
  const hour = now.getHours();

  /* 1. Brand new user */

  if (transactions.length === 0) {
    return {
      id: "first-entry",
      key: "nudgeFirstEntry",
      cta: "quickAdd",
    };
  }

  /* 2. Evening and nothing logged today */

  const loggedToday = transactions.some(
    (item) =>
      item.type === "Expense" &&
      item.date.slice(0, 10) === today
  );

  if (!loggedToday && hour >= 17) {
    return {
      id: "log-today",
      key: "nudgeLogToday",
      cta: "quickAdd",
    };
  }

  /* 3. This week compared with last week */

  const thisWeek = sumExpenses(
    transactions,
    addDays(today, -6),
    today
  );

  const lastWeek = sumExpenses(
    transactions,
    addDays(today, -13),
    addDays(today, -7)
  );

  if (lastWeek > 0 && thisWeek > lastWeek * 1.2) {
    return {
      id: "spending-up",
      key: "nudgeSpendingUp",
      params: {
        percent: Math.round((thisWeek / lastWeek - 1) * 100),
      },
      cta: "reports",
    };
  }

  if (lastWeek > 0 && thisWeek < lastWeek * 0.8 && thisWeek > 0) {
    return {
      id: "spending-down",
      key: "nudgeSpendingDown",
      params: {
        percent: Math.round((1 - thisWeek / lastWeek) * 100),
      },
    };
  }

  /* 4. One category dominates this week */

  if (thisWeek > 0) {
    const byCategory = new Map<string, number>();

    transactions
      .filter(
        (item) =>
          item.type === "Expense" &&
          item.category &&
          item.date.slice(0, 10) >= addDays(today, -6) &&
          item.date.slice(0, 10) <= today
      )
      .forEach((item) => {
        const category = item.category as string;

        byCategory.set(
          category,
          (byCategory.get(category) ?? 0) + item.amount
        );
      });

    let topCategory = "";
    let topAmount = 0;

    byCategory.forEach((amount, category) => {
      if (amount > topAmount) {
        topAmount = amount;
        topCategory = category;
      }
    });

    const share = topAmount / thisWeek;

    // Only worth mentioning when there is more than one
    // category and one of them clearly leads.
    if (byCategory.size > 1 && share >= 0.4) {
      return {
        id: "top-category",
        key: "nudgeTopCategory",
        params: {
          percent: Math.round(share * 100),
          category: labelFor(topCategory),
        },
        cta: "reports",
      };
    }
  }

  /* 5. Savings rate this month */

  const month = today.slice(0, 7);

  const income = transactions
    .filter(
      (item) =>
        item.type === "Income" &&
        item.date.slice(0, 7) === month
    )
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter(
      (item) =>
        item.type === "Expense" &&
        item.date.slice(0, 7) === month
    )
    .reduce((sum, item) => sum + item.amount, 0);

  if (income > 0) {
    const rate = (income - expense) / income;

    if (rate < 0.1) {
      return {
        id: "low-savings",
        key: "nudgeLowSavings",
        cta: "goals",
      };
    }

    if (rate >= 0.2) {
      return {
        id: "good-savings",
        key: "nudgeGoodSavings",
      };
    }
  }

  /* 6. A different habit tip each day */

  return {
    id: "tip",
    key: TIP_KEYS[dayOfYear(now) % TIP_KEYS.length],
  };
}
