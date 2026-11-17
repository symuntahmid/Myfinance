/* Net worth day by day, for the little graph on Home.

   Walk back from today's real net worth. Income raises it and
   expenses lower it. Moving money between accounts, goals or
   investments does not change it, so those are left out. The last
   point is always the real number shown on the card. */

import { dayOf, todayLocal } from "@/app/utils/date";

export type SeriesPoint = { date: string; value: number };

type Tx = {
  type: string;
  amount: number;
  date: string;
  relatedGoalId?: string;
  relatedInvestmentId?: string;
};

function addDays(day: string, by: number): string {
  const [y, m, d] = day.split("-").map(Number);

  return todayLocal(new Date(y, m - 1, d + by));
}

export function buildNetWorthSeries(
  worthNow: number,
  txs: Tx[],
  today: string = todayLocal(),
  days = 30
): SeriesPoint[] {
  const change: Record<string, number> = {};
  let first = "";

  txs.forEach((tx) => {
    if (tx.relatedGoalId || tx.relatedInvestmentId) return;
    if (tx.type !== "Income" && tx.type !== "Expense") return;

    const day = dayOf(tx.date);

    if (!day || day > today) return;

    change[day] =
      (change[day] ?? 0) + (tx.type === "Income" ? tx.amount : -tx.amount);

    if (!first || day < first) first = day;
  });

  if (!first) return [];

  // Start at the first entry (the day before it is the opening
  // balance), but never more than `days` back.
  const limit = addDays(today, -(days - 1));
  const start = first > limit ? addDays(first, -1) : limit;

  const points: SeriesPoint[] = [];
  let value = worthNow;

  for (let day = today; day >= start; day = addDays(day, -1)) {
    points.push({ date: day, value });
    value -= change[day] ?? 0;
  }

  return points.reverse();
}
