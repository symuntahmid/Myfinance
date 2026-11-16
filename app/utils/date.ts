/* Calendar days in the person's own time zone.
   (toISOString() gives the UTC day, which is "yesterday" in
   Bangladesh between midnight and 6 am.) */

const pad = (n: number) => String(n).padStart(2, "0");

export function todayLocal(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/* The calendar day (yyyy-mm-dd) an entry belongs to. Plain dates are
   used as written; older entries stamped with a time are read in the
   person's own time zone. */
export function dayOf(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  const d = new Date(date);

  return Number.isNaN(d.getTime()) ? "" : todayLocal(d);
}

export function monthOfDate(date: string): string {
  return dayOf(date).slice(0, 7);
}
