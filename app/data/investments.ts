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

const STORAGE_KEY = "myfinance-investments";

/* ==========================================
   STORAGE
========================================== */

export function getInvestments(): Investment[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function saveInvestments(
  investments: Investment[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(investments)
  );

  // Save today's portfolio value
  const currentValue = investments.reduce(
    (sum, investment) =>
      sum + investment.currentValue,
    0
  );

  addPortfolioSnapshot(currentValue);

  window.dispatchEvent(
    new Event("investmentsUpdated")
  );
}

/* ==========================================
   CRUD
========================================== */

export function addInvestment(
  investment: Investment
) {
  const investments = getInvestments();

  investments.unshift(investment);

  saveInvestments(investments);
}

export function updateInvestment(
  updatedInvestment: Investment
) {
  const investments = getInvestments().map(
    (investment) =>
      investment.id === updatedInvestment.id
        ? updatedInvestment
        : investment
  );

  saveInvestments(investments);
}

export function deleteInvestment(
  id: string
) {
  const investments = getInvestments().filter(
    (investment) => investment.id !== id
  );

  saveInvestments(investments);
}

export function clearInvestments() {
  saveInvestments([]);
}

/* ==========================================
   PORTFOLIO SUMMARY
========================================== */

export function getPortfolioSummary() {
  const investments = getInvestments();

  const invested = investments.reduce(
    (sum, investment) =>
      sum + investment.investedAmount,
    0
  );

  const current = investments.reduce(
    (sum, investment) =>
      sum + investment.currentValue,
    0
  );

  const profit = current - invested;

  const returnPercentage =
    invested === 0
      ? 0
      : (profit / invested) * 100;

  return {
    invested,
    current,
    profit,
    returnPercentage,
    totalAssets: investments.length,
  };
}

/* ==========================================
   ASSET ALLOCATION
========================================== */

export function getAllocation() {
  const investments = getInvestments();

  const allocation: Record<string, number> = {};

  investments.forEach((investment) => {
    allocation[investment.type] =
      (allocation[investment.type] || 0) +
      investment.currentValue;
  });

  return allocation;
}