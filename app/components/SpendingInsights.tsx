"use client";

import {
  useEffect,
  useState,
} from "react";

import { getTransactions } from "../data/transactions";

import { formatCurrency } from "@/app/utils/currency";



export default function SpendingInsights() {


  const [, forceCurrencyUpdate] =
    useState(0);



  useEffect(()=>{


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return()=>{

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };


  },[]);




  const transactions =
    getTransactions();




  const expenses =
    transactions.filter(
      t=>t.type==="Expense"
    );



  const income =
    transactions.filter(
      t=>t.type==="Income"
    );




  const totalIncome =
    income.reduce(
      (sum,t)=>sum+t.amount,
      0
    );



  const totalExpense =
    expenses.reduce(
      (sum,t)=>sum+t.amount,
      0
    );





  const savingRate =
    totalIncome===0
    ?
    0
    :
    (
      (
        totalIncome-totalExpense
      )
      /
      totalIncome
    )
    *
    100;





  // Expense Category

  const expenseCategory:
    Record<string,number> = {};



  expenses.forEach(t=>{


    const category =
      t.category || "Other";


    expenseCategory[category] =
      (
        expenseCategory[category] || 0
      )
      +
      t.amount;


  });




  const topExpense =
    Object.entries(expenseCategory)
    .sort(
      (a,b)=>b[1]-a[1]
    )[0];





  // Income Source


  const incomeSource:
    Record<string,number> = {};



  income.forEach(t=>{


    const source =
      t.source || "Other";


    incomeSource[source] =
      (
        incomeSource[source] || 0
      )
      +
      t.amount;


  });




  const topIncome =
    Object.entries(incomeSource)
    .sort(
      (a,b)=>b[1]-a[1]
    )[0];






  // Highest Expense


  const highestExpense =
    [...expenses]
    .sort(
      (a,b)=>b.amount-a.amount
    )[0];






return (

<div
className="
rounded-3xl
bg-[var(--card)]
border border-[var(--border)]
p-8
shadow-xl
"
>



<div className="mb-8">


<p
className="
text-sm
font-semibold
uppercase
tracking-widest
text-[var(--muted)]
"
>
AI Financial Insights
</p>



<h2
className="
mt-2
text-3xl
font-bold
text-[var(--foreground)]
"
>
Today's Summary
</h2>



</div>





<div className="space-y-5">





<InsightCard

icon="💸"

title="Largest Expense"

value={
topExpense
?
`${topExpense[0]} • ${formatCurrency(topExpense[1])}`
:
"No expense"
}

/>





<InsightCard

icon="💰"

title="Main Income"

value={
topIncome
?
`${topIncome[0]} • ${formatCurrency(topIncome[1])}`
:
"No income"
}

/>





<InsightCard

icon="🎯"

title="Saving Rate"

value={`${savingRate.toFixed(1)}%`}

/>





<InsightCard

icon="⚠️"

title="Highest Spending"

value={
highestExpense
?
formatCurrency(highestExpense.amount)
:
"-"
}

/>




</div>



</div>

);

}






function InsightCard({

icon,

title,

value,

}:{

icon:string;

title:string;

value:string;

}){


return (

<div
className="
flex
items-center
justify-between
rounded-2xl
border border-[var(--border)]
p-5
transition
hover:border-[var(--primary)]
hover:shadow-md
"
>



<div
className="
flex
items-center
gap-4
"
>



<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-[var(--background)]
text-2xl
"
>

{icon}

</div>




<div>


<p
className="
text-sm
text-[var(--muted)]
"
>
{title}
</p>



<h3
className="
mt-1
font-semibold
text-[var(--foreground)]
"
>
{value}
</h3>



</div>


</div>



</div>

);

}