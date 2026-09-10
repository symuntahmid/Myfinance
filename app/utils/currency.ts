import { getSettings } from "@/app/data/settings";
import { currencies } from "@/app/data/currencies";



export function getCurrency() {

  const settings =
    getSettings();


  return (
    settings.currency
    ||
    "USD"
  );

}





export function getCurrencyData() {

  const code =
    getCurrency();


  return (
    currencies.find(
      currency =>
        currency.code === code
    )
    ||
    currencies.find(
      currency =>
        currency.code === "USD"
    )
  );

}





export function getCurrencySymbol() {

  return (
    getCurrencyData()?.symbol
    ||
    "$"
  );

}





export function formatCurrency(
  amount:number
) {


  const symbol =
    getCurrencySymbol();



  const formatted =
    Math.abs(amount).toLocaleString(
      "en-US",
      {
        minimumFractionDigits:0,
        maximumFractionDigits:2,
      }
    );



  if(amount < 0){

    return `-${symbol}${formatted}`;

  }



  return `${symbol}${formatted}`;


}