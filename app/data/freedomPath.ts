/* ==========================================
   FREEDOM PATH

   Seven steps from "I track my money" to
   "work is a choice". Every step checks itself
   from the person's real data.
========================================== */

import { getTransactions } from "@/app/data/transactions";
import { todayLocal } from "@/app/utils/date";
import { getPlan, monthOf } from "@/app/data/plan";
import { getDebts } from "@/app/data/netWorth";
import { getNetWorthNow } from "@/app/data/overview";
import { buildProgress } from "@/app/data/progress";
import { freedomNumber, getMonthlyCost } from "@/app/data/lifeGoals";

export type StepId =
  | "track"
  | "plan"
  | "starter"
  | "debt"
  | "safety"
  | "invest"
  | "freedom";

export type PathStep = {
  id: StepId;
  done: boolean;
  // 0 to 100, how far along this step is
  progress: number;
  // raw numbers the screen turns into words
  value: number;
  target: number;
};

export type FreedomPath = {
  steps: PathStep[];
  doneCount: number;
  total: number;
  currentId: StepId | null;
};

export const TRACK_TARGET = 10;
export const STARTER_MONTHS = 1;
export const SAFETY_MONTHS = 3;

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);

export function buildFreedomPath(now: Date = new Date()): FreedomPath {
  /* 1. Track: entries in the last 30 days */

  const since = now.getTime() - 30 * 86_400_000;

  const entries = getTransactions().filter((item) => {
    const time = new Date(item.date).getTime();

    return (
      (item.type === "Income" || item.type === "Expense") &&
      !Number.isNaN(time) &&
      time >= since
    );
  }).length;

  /* 2. Plan: money given a job this month */

  const month = monthOf(todayLocal(now));
  const planned = Object.values(getPlan()[month] ?? {}).reduce(
    (sum, value) => sum + (Number(value) > 0 ? Number(value) : 0),
    0
  );

  /* 3 and 5. Safety: months of spending in cash */

  const progress = buildProgress(now);
  const runway = progress.runway ?? 0;

  /* 4. Debt */

  const owed = getDebts().reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  /* 6. Investing */

  const worth = getNetWorthNow();
  const investedTx = getTransactions().some(
    (item) => item.type === "Investment"
  );

  const invested = worth.investments;

  /* 7. Freedom number */

  const target = freedomNumber(getMonthlyCost());
  const freedomPercent =
    target > 0 ? Math.round((Math.max(worth.netWorth, 0) / target) * 100) : 0;

  const steps: PathStep[] = [
    {
      id: "track",
      done: entries >= TRACK_TARGET,
      progress: clamp((entries / TRACK_TARGET) * 100),
      value: entries,
      target: TRACK_TARGET,
    },
    {
      id: "plan",
      done: planned > 0,
      progress: planned > 0 ? 100 : 0,
      value: planned,
      target: 0,
    },
    {
      id: "starter",
      done: runway >= STARTER_MONTHS,
      progress: clamp((runway / STARTER_MONTHS) * 100),
      value: runway,
      target: STARTER_MONTHS,
    },
    {
      id: "debt",
      done: owed <= 0,
      progress: owed <= 0 ? 100 : 0,
      value: owed,
      target: 0,
    },
    {
      id: "safety",
      done: runway >= SAFETY_MONTHS,
      progress: clamp((runway / SAFETY_MONTHS) * 100),
      value: runway,
      target: SAFETY_MONTHS,
    },
    {
      id: "invest",
      done: invested > 0 || investedTx,
      progress: invested > 0 || investedTx ? 100 : 0,
      value: invested,
      target: 0,
    },
    {
      id: "freedom",
      done: target > 0 && freedomPercent >= 100,
      progress: clamp(freedomPercent),
      value: freedomPercent,
      target,
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;

  return {
    steps,
    doneCount,
    total: steps.length,
    currentId: steps.find((step) => !step.done)?.id ?? null,
  };
}
