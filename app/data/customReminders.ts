/* ==========================================
   CUSTOM REMINDERS

   Anything the user wants to be reminded about:
   a bill, a loan instalment, a DPS deposit,
   a family event...

   repeat: "once"    - one date only
           "monthly" - same day every month
           "yearly"  - same date every year
========================================== */

export const CUSTOM_REMINDERS_KEY = "myfinance-custom-reminders";

export type ReminderRepeat = "once" | "monthly" | "yearly";

export type CustomReminder = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd (first / only date)
  repeat: ReminderRepeat;
};

export type DueReminder = CustomReminder & {
  daysLeft: number; // 0 = today
};

function toUtc(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function key(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function lastDay(y: number, monthIndex: number): number {
  return new Date(y, monthIndex + 1, 0).getDate();
}

// Next date (today or later) this reminder falls on, or null.
export function nextOccurrence(
  reminder: CustomReminder,
  today: string
): string | null {
  const [y, m, d] = reminder.date.split("-").map(Number);
  const [ty, tm] = today.split("-").map(Number);

  if (!y || !m || !d) return null;

  if (reminder.repeat === "once") {
    return reminder.date >= today ? reminder.date : null;
  }

  if (reminder.repeat === "monthly") {
    for (let i = 0; i < 2; i++) {
      const idx = tm - 1 + i;
      const yy = ty + Math.floor(idx / 12);
      const mm = idx % 12;
      const candidate = key(yy, mm + 1, Math.min(d, lastDay(yy, mm)));

      if (candidate >= today && candidate >= reminder.date) {
        return candidate;
      }
    }

    return null;
  }

  for (let i = 0; i < 2; i++) {
    const yy = ty + i;
    const candidate = key(yy, m, Math.min(d, lastDay(yy, m - 1)));

    if (candidate >= today && candidate >= reminder.date) {
      return candidate;
    }
  }

  return null;
}

export function getDueReminders(
  reminders: CustomReminder[],
  today: string,
  withinDays = 3
): DueReminder[] {
  const due: DueReminder[] = [];

  reminders.forEach((reminder) => {
    const next = nextOccurrence(reminder, today);

    if (!next) return;

    const daysLeft = Math.round(
      (toUtc(next) - toUtc(today)) / 86_400_000
    );

    if (daysLeft <= withinDays) {
      due.push({ ...reminder, daysLeft });
    }
  });

  return due.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function getCustomReminders(): CustomReminder[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      localStorage.getItem(CUSTOM_REMINDERS_KEY) || "[]"
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: CustomReminder[]) {
  localStorage.setItem(CUSTOM_REMINDERS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("remindersUpdated"));
}

export function addCustomReminder(input: Omit<CustomReminder, "id">) {
  save([
    ...getCustomReminders(),
    { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
  ]);
}

export function deleteCustomReminder(id: string) {
  save(getCustomReminders().filter((item) => item.id !== id));
}
