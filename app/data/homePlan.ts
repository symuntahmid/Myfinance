/* ==========================================
   HOME ROADMAP: rent to own

   Plain maths, kept apart from the screen.
   Rough estimates only.
========================================== */

export type HomeAnswer = "own" | "rent" | "family";

export type HomePlan = {
  answer: HomeAnswer | null;
  rent: string;
  hike: string;
  price: string;
  buyYears: string;
  propInflation: string;
  down: string;
  reg: string;
  ret: string;
  income: string;
  loanRate: string;
  tenor: string;
  goalId: string | null;
};

export const HOME_KEY = "myfinance-home-plan";

export const DEFAULT_PLAN: HomePlan = {
  answer: null,
  rent: "",
  hike: "6",
  price: "6000000",
  buyYears: "5",
  propInflation: "6",
  down: "20",
  reg: "10",
  ret: "8",
  income: "",
  loanRate: "11",
  tenor: "20",
  goalId: null,
};

export const DTI = 0.35;

export function getHomePlan(): HomePlan {
  if (typeof window === "undefined") return DEFAULT_PLAN;

  try {
    return {
      ...DEFAULT_PLAN,
      ...JSON.parse(localStorage.getItem(HOME_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_PLAN;
  }
}

export function saveHomePlan(plan: HomePlan) {
  localStorage.setItem(HOME_KEY, JSON.stringify(plan));
  window.dispatchEvent(new Event("homePlanUpdated"));
}

export const num = (value: string) => {
  const n = Number(value);

  return Number.isFinite(n) && n > 0 ? n : 0;
};

/* Rent paid over n years when it rises by `hike` % every year. */
export function rentPaid(rent: number, hike: number, years: number) {
  let total = 0;

  for (let y = 0; y < years; y++) {
    total += rent * 12 * Math.pow(1 + hike / 100, y);
  }

  return total;
}

/* What a monthly amount grows into at `rate` % a year. */
export function futureValue(monthly: number, rate: number, years: number) {
  const r = rate / 100 / 12;
  const months = years * 12;

  if (r === 0) return monthly * months;

  return (monthly * (Math.pow(1 + r, months) - 1)) / r;
}

/* Same for the rent that rises each year: invest every month's rent. */
export function rentInvested(
  rent: number,
  hike: number,
  rate: number,
  years: number
) {
  const r = rate / 100 / 12;
  let balance = 0;

  for (let m = 0; m < years * 12; m++) {
    const monthlyRent = rent * Math.pow(1 + hike / 100, Math.floor(m / 12));

    balance = balance * (1 + r) + monthlyRent;
  }

  return balance;
}

export function futurePrice(price: number, inflation: number, years: number) {
  return price * Math.pow(1 + inflation / 100, years);
}

/* Cash needed on closing day: down payment plus registration and tax. */
export function cashNeeded(
  price: number,
  inflation: number,
  years: number,
  down: number,
  reg: number
) {
  return futurePrice(price, inflation, years) * ((down + reg) / 100);
}

/* Monthly saving that reaches `target` in `years` at `rate` %. */
export function monthlyNeeded(target: number, rate: number, years: number) {
  const months = years * 12;
  const r = rate / 100 / 12;

  if (months <= 0) return 0;
  if (r === 0) return target / months;

  return (target * r) / (Math.pow(1 + r, months) - 1);
}

/* Largest loan whose monthly payment stays at `emi`. */
export function maxLoan(emi: number, rate: number, years: number) {
  const r = rate / 100 / 12;
  const m = years * 12;

  if (m <= 0) return 0;
  if (r === 0) return emi * m;

  return (emi * (Math.pow(1 + r, m) - 1)) / (r * Math.pow(1 + r, m));
}
