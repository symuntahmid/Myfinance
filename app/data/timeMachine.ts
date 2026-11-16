/* ==========================================
   MONEY TIME MACHINE: the maths

   One pool of monthly saving. Each taka does one job at a
   time, in this order:

     1. Starter cushion   1 month of living cost
     2. Debts             highest interest first
     3. Safety cushion    3 months of living cost
     4. Home              down payment + fees (if planned)
     5. Freedom           25x yearly cost, invested

   While debts are being cleared, their smallest payments are
   paid as usual; once a debt is gone its payment joins the pool.
   Everything is a rough estimate (see RATES below).
========================================== */

import { getNetWorthNow } from "@/app/data/overview";
import { getDebts, type Debt } from "@/app/data/netWorth";
import { buildProgress } from "@/app/data/progress";
import { freedomNumber, getMonthlyCost } from "@/app/data/lifeGoals";
import { cashNeeded, getHomePlan, num } from "@/app/data/homePlan";

export const RATES = {
  save: 6, // % a year, savings / DPS
  invest: 8, // % a year, long-term investing
};

export const MAX_MONTHS = 60 * 12;

export type StageId = "starter" | "debt" | "safety" | "home" | "freedom";

export type Stage = {
  id: StageId;
  // false when this stage does not apply to the person
  present: boolean;
  // months from today; 0 = already done; null = not reachable
  months: number | null;
};

export type Inputs = {
  cash: number;
  invested: number;
  cost: number; // monthly living cost
  debts: Pick<Debt, "amount" | "rate" | "minPay">[];
  homeCash: number | null;
  saving: number; // what the person saves each month now
};

/* Months until `balance` grows (with `monthly` added) to `target`. */
export function monthsToTarget(
  balance: number,
  target: number,
  monthly: number,
  ratePct: number
): number | null {
  if (balance >= target) return 0;

  const r = ratePct / 100 / 12;
  let value = balance;

  for (let month = 1; month <= MAX_MONTHS; month += 1) {
    value = value * (1 + r) + monthly;

    if (value >= target) return month;
  }

  return null;
}

/* Month the last debt is gone. Extra money starts after `quiet` months. */
export function debtFreeMonth(
  debts: Inputs["debts"],
  quiet: number,
  pool: number
): number | null {
  const list = debts
    .filter((debt) => debt.amount > 0)
    .map((debt) => ({
      bal: debt.amount,
      r: (debt.rate ?? 0) / 100 / 12,
      min: debt.minPay ?? 0,
      rate: debt.rate ?? 0,
    }));

  if (list.length === 0) return 0;

  for (let month = 1; month <= MAX_MONTHS; month += 1) {
    list.forEach((debt) => {
      if (debt.bal > 0) debt.bal += debt.bal * debt.r;
    });

    let extra = month > quiet ? pool : 0;

    list.forEach((debt) => {
      if (debt.bal <= 0.005) {
        extra += debt.min; // a cleared debt's payment is freed up
        return;
      }

      const pay = Math.min(debt.min, debt.bal);

      debt.bal -= pay;
    });

    [...list]
      .filter((debt) => debt.bal > 0.005)
      .sort((a, b) => b.rate - a.rate)
      .forEach((debt) => {
        const pay = Math.min(extra, debt.bal);

        debt.bal -= pay;
        extra -= pay;
      });

    if (list.every((debt) => debt.bal <= 0.005)) return month;
  }

  return null;
}

export function buildRoad(input: Inputs, extra: number): Stage[] {
  const pool = Math.max(input.saving + extra, 0);
  const stages: Stage[] = [];

  const hasCost = input.cost > 0;
  const hasDebt = input.debts.some((debt) => debt.amount > 0);

  let t: number | null = 0;
  let balance = input.cash;

  /* 1. Starter */
  const starterTarget = input.cost;
  const starter = hasCost
    ? monthsToTarget(balance, starterTarget, pool, RATES.save)
    : null;

  stages.push({ id: "starter", present: hasCost, months: starter });

  t = hasCost ? starter : 0;
  balance = Math.max(balance, starterTarget);

  /* 2. Debts */
  const debtMonths =
    t === null ? null : debtFreeMonth(input.debts, t, pool);

  stages.push({ id: "debt", present: hasDebt, months: hasDebt ? debtMonths : 0 });

  if (hasDebt) t = debtMonths === null ? null : Math.max(debtMonths, t ?? 0);

  const minsFreed = input.debts.reduce(
    (sum, debt) => sum + (debt.minPay ?? 0),
    0
  );

  const poolAfterDebt = pool + (hasDebt ? minsFreed : 0);

  /* 3. Safety */
  let safety: number | null = null;

  if (hasCost && t !== null) {
    const more = monthsToTarget(balance, input.cost * 3, poolAfterDebt, RATES.save);

    safety = more === null ? null : t + more;
  }

  stages.push({ id: "safety", present: hasCost, months: safety });

  t = hasCost ? safety : t;

  /* 4. Home */
  let home: number | null = null;

  if (input.homeCash && input.homeCash > 0 && t !== null) {
    const more = monthsToTarget(0, input.homeCash, poolAfterDebt, RATES.save);

    home = more === null ? null : t + more;
  }

  stages.push({
    id: "home",
    present: Boolean(input.homeCash && input.homeCash > 0),
    months: home,
  });

  if (input.homeCash && input.homeCash > 0) t = home;

  /* 5. Freedom */
  let freedom: number | null = null;

  if (hasCost && t !== null) {
    const grown =
      input.invested * Math.pow(1 + RATES.invest / 100 / 12, t);

    const more = monthsToTarget(
      grown,
      freedomNumber(input.cost),
      poolAfterDebt,
      RATES.invest
    );

    freedom = more === null ? null : t + more;
  }

  stages.push({ id: "freedom", present: hasCost, months: freedom });

  return stages;
}

/* ---------- reading the person's own numbers ---------- */

export function averageSaving(): number {
  const progress = buildProgress();

  const done = progress.months.slice(0, -1).slice(-3);

  if (done.length === 0) return 0;

  const average = done.reduce((sum, row) => sum + row.kept, 0) / done.length;

  return Math.max(Math.round(average / 100) * 100, 0);
}

export function gatherInputs(saving: number, costOverride?: number): Inputs {
  const worth = getNetWorthNow();
  const progress = buildProgress();
  const plan = getHomePlan();

  const cost =
    costOverride && costOverride > 0
      ? costOverride
      : getMonthlyCost() || Math.round(progress.avgSpend ?? 0);

  const homeCash =
    plan.answer === "rent" && num(plan.price) > 0
      ? cashNeeded(
          num(plan.price),
          num(plan.propInflation),
          num(plan.buyYears),
          num(plan.down),
          num(plan.reg)
        )
      : null;

  return {
    cash: Math.max(worth.accounts, 0),
    invested: Math.max(worth.investments, 0),
    cost,
    debts: getDebts(),
    homeCash,
    saving,
  };
}

export function addMonths(months: number, now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() + months, 1);
}
