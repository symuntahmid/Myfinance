/* ==========================================
   INVESTING MATHS

   Compound growth and the retirement plan.
   Rough estimates, kept apart from the screen.
========================================== */

import { futureValue, monthlyNeeded } from "@/app/data/homePlan";

export type YearPoint = { year: number; invested: number; value: number };

/* Month by month, so the yearly numbers are exact. */
export function compoundSeries(
  start: number,
  monthly: number,
  ratePct: number,
  years: number
): YearPoint[] {
  const r = ratePct / 100 / 12;
  const points: YearPoint[] = [{ year: 0, invested: start, value: start }];

  let value = start;
  let invested = start;

  for (let m = 1; m <= years * 12; m++) {
    value = value * (1 + r) + monthly;
    invested += monthly;

    if (m % 12 === 0) {
      points.push({ year: m / 12, invested, value });
    }
  }

  return points;
}

/* Rule of 72: years for money to double. */
export function doublingYears(ratePct: number): number | null {
  return ratePct > 0 ? Math.round((72 / ratePct) * 10) / 10 : null;
}

/* What a future amount buys in today's money. */
export function inTodaysMoney(value: number, inflationPct: number, years: number) {
  return value / Math.pow(1 + inflationPct / 100, years);
}

export type RetireInput = {
  age: number;
  retireAge: number;
  lifeAge: number;
  costNow: number; // monthly
  saved: number;
  monthly: number;
  inflation: number;
  returnBefore: number;
  returnAfter: number;
};

export type RetireResult = {
  valid: boolean;
  yearsToGo: number;
  costThen: number; // monthly, in the money of that day
  nest: number; // fund needed on retirement day
  projected: number; // what current saving reaches
  gap: number; // positive = short
  extraMonthly: number; // to close the gap
  readyPct: number;
};

export function retirementPlan(input: RetireInput): RetireResult {
  const yearsToGo = input.retireAge - input.age;
  const retiredYears = input.lifeAge - input.retireAge;

  if (yearsToGo <= 0 || retiredYears <= 0) {
    return {
      valid: false,
      yearsToGo: 0,
      costThen: 0,
      nest: 0,
      projected: 0,
      gap: 0,
      extraMonthly: 0,
      readyPct: 0,
    };
  }

  const costThen = input.costNow * Math.pow(1 + input.inflation / 100, yearsToGo);

  // After retiring, spending rises with inflation while money earns
  // `returnAfter`. Their gap is the real return of the nest egg.
  const real = (1 + input.returnAfter / 100) / (1 + input.inflation / 100) - 1;
  const factor =
    Math.abs(real) < 1e-9
      ? retiredYears
      : (1 - Math.pow(1 + real, -retiredYears)) / real;
  const nest = costThen * 12 * factor;

  const growth = Math.pow(1 + input.returnBefore / 100, yearsToGo);
  const projected =
    input.saved * growth + futureValue(input.monthly, input.returnBefore, yearsToGo);

  const gap = Math.max(nest - projected, 0);

  return {
    valid: true,
    yearsToGo,
    costThen,
    nest,
    projected,
    gap,
    extraMonthly: gap > 0 ? monthlyNeeded(gap, input.returnBefore, yearsToGo) : 0,
    readyPct: nest > 0 ? Math.min(Math.round((projected / nest) * 100), 100) : 0,
  };
}
