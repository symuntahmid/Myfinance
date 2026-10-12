import { addPortfolioSnapshot } from "./portfolioHistory";

export type InvestmentType =
  | "Stocks"
  | "Crypto"
  | "Gold"
  | "Real Estate"
  | "Mutual Fund"
  | "ETF"
  | "Bonds"
  | "Savings"
  | "Fixed Deposit (FDR)"
  | "Business"
  | "Retirement"
  | "Other";


export type Investment = {
  id: string;

  name: string;

  type: InvestmentType;

  investedAmount: number;

  currentValue: number;

  purchaseDate: string;

  notes?: string;
};


const STORAGE_KEY =
  "myfinance-investments";


/* =====================================================
   STORAGE
===================================================== */

export function getInvestments(): Investment[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }


  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {
    return [];
  }


  try {

    const parsed =
      JSON.parse(saved);


    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }


    return parsed.filter(
      (investment): investment is Investment =>
        Boolean(investment) &&
        typeof investment.id === "string" &&
        typeof investment.name === "string" &&
        typeof investment.type === "string" &&
        Number.isFinite(
          Number(investment.investedAmount)
        ) &&
        Number.isFinite(
          Number(investment.currentValue)
        ) &&
        typeof investment.purchaseDate === "string"
    );

  } catch {

    console.error(
      "Failed to parse investments from storage."
    );

    return [];

  }

}


/* =====================================================
   PORTFOLIO VALUE
===================================================== */

function calculatePortfolioValue(
  investments: Investment[]
): number {

  return investments.reduce(
    (sum, investment) =>
      sum +
      Math.max(
        0,
        Number(investment.currentValue) || 0
      ),
    0
  );

}


/* =====================================================
   SAVE INVESTMENTS
===================================================== */

export function saveInvestments(
  investments: Investment[]
): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const cleanedInvestments =
    investments.filter(
      (investment) =>
        Boolean(investment) &&
        typeof investment.id === "string" &&
        typeof investment.name === "string" &&
        Number.isFinite(
          Number(investment.investedAmount)
        ) &&
        Number.isFinite(
          Number(investment.currentValue)
        )
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      cleanedInvestments
    )
  );


  /*
   * Record the REAL current portfolio value.
   *
   * No demo values.
   * No artificial growth.
   * No random values.
   */

  const currentPortfolioValue =
    calculatePortfolioValue(
      cleanedInvestments
    );


  addPortfolioSnapshot(
    currentPortfolioValue
  );


  window.dispatchEvent(
    new Event(
      "investmentsUpdated"
    )
  );

}


/* =====================================================
   ADD INVESTMENT
===================================================== */

export function addInvestment(
  investment: Investment
): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const investments =
    getInvestments();


  investments.unshift(
    investment
  );


  saveInvestments(
    investments
  );


  /* =================================================
     DAILY JOURNEY

     Task 3:
     Make one better money decision
  ================================================= */

  import("./dailyJourney")
    .then(({ completeTask }) => {

      const completed =
        completeTask(3);


      if (completed) {

        import("./player")
          .then(({ addXP }) => {

            addXP(20);

            window.dispatchEvent(
              new Event(
                "dailyJourneyUpdated"
              )
            );

          });

      }

    })
    .catch(() => {

      /*
       * Daily Journey is optional.
       * Investment saving should never fail
       * because the journey module fails.
       */

    });

}


/* =====================================================
   UPDATE INVESTMENT
===================================================== */

export function updateInvestment(
  updatedInvestment: Investment
): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const investments =
    getInvestments();


  const updated =
    investments.map(
      (investment) =>
        investment.id ===
        updatedInvestment.id
          ? updatedInvestment
          : investment
    );


  saveInvestments(
    updated
  );

}


/* =====================================================
   DELETE INVESTMENT
===================================================== */

export function deleteInvestment(
  id: string
): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const investments =
    getInvestments();


  const updated =
    investments.filter(
      (investment) =>
        investment.id !== id
    );


  saveInvestments(
    updated
  );

}


/* =====================================================
   CLEAR ALL INVESTMENTS
===================================================== */

export function clearInvestments(): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  /*
   * Saving an empty portfolio records a real
   * portfolio value of 0 for today.
   */

  saveInvestments([]);

}


/* =====================================================
   PORTFOLIO SUMMARY
===================================================== */

export function getPortfolioSummary() {

  const investments =
    getInvestments();


  const invested =
    investments.reduce(
      (sum, investment) =>
        sum +
        (
          Number(
            investment.investedAmount
          ) || 0
        ),
      0
    );


  const current =
    investments.reduce(
      (sum, investment) =>
        sum +
        (
          Number(
            investment.currentValue
          ) || 0
        ),
      0
    );


  const profit =
    current -
    invested;


  const returnPercentage =
    invested === 0
      ? 0
      : (
          profit /
          invested
        ) *
        100;


  return {

    invested,

    current,

    profit,

    returnPercentage,

    totalAssets:
      investments.length,

  };

}


/* =====================================================
   ASSET ALLOCATION
===================================================== */

export function getAllocation() {

  const investments =
    getInvestments();


  const allocation:
    Record<string, number> = {};


  investments.forEach(
    (investment) => {

      const value =
        Number(
          investment.currentValue
        ) || 0;


      allocation[
        investment.type
      ] =
        (
          allocation[
            investment.type
          ] || 0
        ) +
        value;

    }
  );


  return allocation;

}