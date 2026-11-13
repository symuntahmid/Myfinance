/* ==========================================
   OVERVIEW NUMBERS

   Small helpers the Dashboard shares, so every card
   shows the same figures.
========================================== */

import { getAccounts, getBalances } from "./accounts";
import { getGoals } from "./goals";
import { getPortfolioSummary } from "./investments";
import { computeNetWorth, getDebts, type NetWorth } from "./netWorth";

export function getNetWorthNow(): NetWorth {
  const balances = getBalances();

  const accounts = getAccounts().reduce(
    (sum, item) => sum + (balances[item.id] ?? 0),
    0
  );

  const goals = getGoals().reduce(
    (sum, item) => sum + (Number(item.savedAmount) || 0),
    0
  );

  return computeNetWorth({
    accounts,
    goals,
    investments: getPortfolioSummary().current,
    debts: getDebts(),
  });
}
