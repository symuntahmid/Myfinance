/* A somiti (rotating savings group), kept on the organiser's phone.
   Every month each member pays the same amount, and one member takes
   the whole pot. Members take turns in a fixed order. */

export type Member = { id: string; name: string };

export type Somiti = {
  id: string;
  name: string;
  amount: number; // per member, per month
  members: Member[]; // in turn order
  start: string; // yyyy-mm, the month of the first turn
  paid: Record<string, string[]>; // month -> member ids who paid
  handed: Record<string, boolean>; // month -> pot given to the member
};

const KEY = "myfinance-somiti";
export const EVENT = "somitiUpdated";

export function getSomitis(): Somiti[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");

    return Array.isArray(raw) ? (raw as Somiti[]) : [];
  } catch {
    return [];
  }
}

export function saveSomitis(list: Somiti[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function monthIndex(month: string): number {
  const [y, m] = month.split("-").map(Number);

  return y * 12 + (m - 1);
}

export function monthFromIndex(index: number): string {
  const y = Math.floor(index / 12);

  return `${y}-${String((index % 12) + 1).padStart(2, "0")}`;
}

/* Which round (0, 1, 2 …) a month is, counting from the start. */
export function roundOf(s: Somiti, month: string): number {
  return monthIndex(month) - monthIndex(s.start);
}

/* The member who takes the pot in a month, or null if the group has
   not started yet. After everyone has had a turn, the order repeats. */
export function takerOf(s: Somiti, month: string): Member | null {
  const round = roundOf(s, month);

  if (round < 0 || s.members.length === 0) return null;

  return s.members[round % s.members.length];
}

export function potOf(s: Somiti): number {
  return s.amount * s.members.length;
}

export function paidIds(s: Somiti, month: string): string[] {
  const valid = new Set(s.members.map((m) => m.id));

  return (s.paid[month] ?? []).filter((id) => valid.has(id));
}

export function collected(s: Somiti, month: string): number {
  return paidIds(s, month).length * s.amount;
}

export function unpaid(s: Somiti, month: string): Member[] {
  const done = new Set(paidIds(s, month));

  return s.members.filter((m) => !done.has(m.id));
}

/* The month a member's turn comes next (this month or later). */
export function nextTurnMonth(
  s: Somiti,
  memberId: string,
  fromMonth: string
): string | null {
  const at = s.members.findIndex((m) => m.id === memberId);

  if (at < 0) return null;

  const n = s.members.length;
  const from = Math.max(roundOf(s, fromMonth), 0);

  for (let round = from; round < from + n; round += 1) {
    if (round % n === at) return monthFromIndex(monthIndex(s.start) + round);
  }

  return null;
}

export function togglePaid(s: Somiti, month: string, memberId: string): Somiti {
  const now = new Set(s.paid[month] ?? []);

  if (now.has(memberId)) now.delete(memberId);
  else now.add(memberId);

  return { ...s, paid: { ...s.paid, [month]: [...now] } };
}
