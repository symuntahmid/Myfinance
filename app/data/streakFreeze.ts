/* ==========================================
   STREAK FREEZE

   A streak freeze protects the streak when the
   user misses a day.

   Rules
   - Everyone starts with 1 freeze.
   - A freeze is used automatically, only when
     needed: when the user comes back after
     missing days and has enough freezes to cover
     every missed day.
   - A frozen day keeps the streak alive but does
     not add +1 to it.
   - Every 7-day streak earns 1 new freeze.
   - You can hold at most 2 freezes.
========================================== */

export const FREEZE_STORAGE_KEY = "myfinance-streak-freeze";

export const MAX_FREEZES = 2;
export const DAYS_PER_FREEZE = 7;

export type FreezeUsed = {
  date: string;   // the day the freeze was used (today)
  days: number;   // how many missed days were covered
  streak: number; // the streak that was saved
};

export type FreezeData = {
  freezes: number;
  frozenDays: string[];
  lastAwardedAt: number;
  lastUsed?: FreezeUsed;
};

export const DEFAULT_FREEZE_DATA: FreezeData = {
  freezes: 1,
  frozenDays: [],
  lastAwardedAt: 0,
};


/* ==========================================
   DATE HELPERS (yyyy-mm-dd, timezone safe)
========================================== */

function toUtcMs(key: string): number {
  const [year, month, day] = key.split("-").map(Number);

  return Date.UTC(year, month - 1, day);
}

function fromUtcMs(ms: number): string {
  const date = new Date(ms);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function todayKey(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function addDays(key: string, days: number): string {
  return fromUtcMs(toUtcMs(key) + days * 86_400_000);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / 86_400_000);
}


/* ==========================================
   STREAK COUNT
   Counts back from `today`. Completed days add
   +1, frozen days keep the chain going.
========================================== */

export function computeStreak(
  completedDays: string[],
  frozenDays: string[],
  today: string
): number {
  const completed = new Set(completedDays);
  const frozen = new Set(frozenDays);

  let streak = 0;
  let day = today;

  for (let guard = 0; guard < 5000; guard++) {
    if (completed.has(day)) {
      streak++;
    } else if (!frozen.has(day)) {
      break;
    }

    day = addDays(day, -1);
  }

  return streak;
}


/* ==========================================
   RESOLVE A NEW COMPLETED DAY
   `completedBefore` must NOT include `today`.
========================================== */

export function resolveStreak(input: {
  completedBefore: string[];
  today: string;
  data: FreezeData;
}): { streak: number; data: FreezeData } {
  const { completedBefore, today } = input;

  let freezes = input.data.freezes;
  let lastAwardedAt = input.data.lastAwardedAt;
  let lastUsed = input.data.lastUsed;
  const frozenDays = [...input.data.frozenDays];

  /* ---- cover missed days with freezes ---- */

  const previous = completedBefore
    .filter((day) => day < today)
    .sort()
    .pop();

  if (previous) {
    const missed = daysBetween(previous, today) - 1;

    if (missed >= 1 && missed <= freezes) {
      for (let i = 1; i <= missed; i++) {
        frozenDays.push(addDays(previous, i));
      }

      freezes -= missed;

      // The streak we just saved (before today is added).
      const saved = computeStreak(
        completedBefore,
        frozenDays,
        addDays(today, -1)
      );

      lastUsed = { date: today, days: missed, streak: saved };
    }
  }

  const streak = computeStreak(
    [...completedBefore, today],
    frozenDays,
    today
  );

  /* ---- earn a new freeze every 7 days ---- */

  if (streak < lastAwardedAt) {
    // The streak was broken, so milestones can be earned again.
    lastAwardedAt = 0;
  }

  if (
    streak >= DAYS_PER_FREEZE &&
    streak % DAYS_PER_FREEZE === 0 &&
    streak > lastAwardedAt
  ) {
    freezes = Math.min(MAX_FREEZES, freezes + 1);
    lastAwardedAt = streak;
  }

  return {
    streak,
    data: { freezes, frozenDays, lastAwardedAt, lastUsed },
  };
}


/* ==========================================
   STORAGE
========================================== */

export function getFreezeData(): FreezeData {
  if (typeof window === "undefined") {
    return { ...DEFAULT_FREEZE_DATA };
  }

  try {
    const saved = localStorage.getItem(FREEZE_STORAGE_KEY);

    if (!saved) return { ...DEFAULT_FREEZE_DATA };

    const parsed = JSON.parse(saved) as Partial<FreezeData>;

    return {
      freezes:
        typeof parsed.freezes === "number"
          ? Math.min(MAX_FREEZES, Math.max(0, parsed.freezes))
          : DEFAULT_FREEZE_DATA.freezes,
      frozenDays: Array.isArray(parsed.frozenDays)
        ? parsed.frozenDays
        : [],
      lastAwardedAt:
        typeof parsed.lastAwardedAt === "number"
          ? parsed.lastAwardedAt
          : 0,
      lastUsed: parsed.lastUsed,
    };
  } catch {
    return { ...DEFAULT_FREEZE_DATA };
  }
}

export function saveFreezeData(data: FreezeData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(FREEZE_STORAGE_KEY, JSON.stringify(data));
}
