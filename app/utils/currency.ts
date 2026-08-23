import { getSettings } from "@/app/data/settings";

import { currencies } from "@/app/data/currencies";


export function getCurrency() {

  const settings = getSettings();

  return settings.currency || "USD";

}



export function getCurrencySymbol() {

  const code = getCurrency();


  const currency =
    currencies.find(
      (item) =>
        item.code === code
    );


  return currency?.symbol || "$";

}



export function formatCurrency(
  amount: number
) {

  const symbol = getCurrencySymbol();


  return `${symbol}${amount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;

}