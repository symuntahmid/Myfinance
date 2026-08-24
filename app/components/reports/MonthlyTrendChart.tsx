"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getTransactions,
  Transaction,
} from "../../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";

type MonthData = {
  key: string;
  label: string;
  income: number;
  expense: number;
  investment: number;
  cashFlow: number;
};



function getLastSixMonths(): MonthData[] {

  const transactions =
    getTransactions();

  const now = new Date();

  const months: MonthData[] = [];


  for (let i = 5; i >= 0; i--) {

    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );


    const year =
      date.getFullYear();

    const month =
      date.getMonth();



    const monthTransactions =
      transactions.filter(
        (transaction)=>{

          const transactionDate =
            new Date(transaction.date);


          return (
            transactionDate.getFullYear()
            === year
            &&
            transactionDate.getMonth()
            === month
          );

        }
      );



    let income = 0;
    let expense = 0;
    let investment = 0;



    monthTransactions.forEach(
      (transaction: Transaction)=>{

        if(transaction.type==="Income"){
          income += transaction.amount;
        }


        if(transaction.type==="Expense"){
          expense += transaction.amount;
        }


        if(transaction.type==="Investment"){
          investment += transaction.amount;
        }

      }
    );



    months.push({

      key:`${year}-${month}`,

      label:
        date.toLocaleDateString(
          undefined,
          {
            month:"short",
          }
        ),

      income,

      expense,

      investment,

      cashFlow:
        income -
        expense -
        investment,

    });

  }


  return months;

}




function formatMoney(amount:number){

  return formatCurrency(amount);

}




export default function MonthlyTrendChart(){


const [
  transactionsVersion,
  setTransactionsVersion
] = useState(0);

const [, forceCurrencyUpdate] =
  useState(0);

useEffect(()=>{

const refresh = () => {

  setTransactionsVersion(
    value => value + 1
  );

};


const currencyListener = () => {

  forceCurrencyUpdate(
    value => value + 1
  );

};



window.addEventListener(
  "transactionsUpdated",
  refresh
);


window.addEventListener(
  "currencyUpdated",
  currencyListener
);



return()=>{

window.removeEventListener(
  "transactionsUpdated",
  refresh
);


window.removeEventListener(
  "currencyUpdated",
  currencyListener
);


};


},[]);




const months =
useMemo(
()=>getLastSixMonths(),
[transactionsVersion]
);




const maxValue =
Math.max(
...months.flatMap(
(month)=>[
month.income,
month.expense,
month.investment,
]
),
1
);




const hasData =
months.some(
(month)=>
month.income>0 ||
month.expense>0 ||
month.investment>0
);




return (

<section className="
rounded-2xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">



<div className="mb-6">


<h2 className="
text-2xl
font-bold
text-[var(--foreground)]
">

Financial Trend

</h2>



<p className="
mt-1
text-sm
text-[var(--muted)]
">

Your financial activity over the last six months.

</p>


</div>





{!hasData ? (


<div className="
rounded-xl
bg-[var(--background)]
p-8
text-center
">


<p className="
font-medium
text-[var(--foreground)]
">

Not enough data yet

</p>


<p className="
mt-1
text-sm
text-[var(--muted)]
">

Add income, expenses, or investments to see your financial trend.

</p>


</div>



) : (



<div className="space-y-6">



<div className="
flex
flex-wrap
gap-5
text-sm
">



<div className="flex items-center gap-2">

<span className="
h-3
w-3
rounded-full
bg-green-500
"/>

<span className="
text-[var(--muted)]
">
Income
</span>

</div>




<div className="flex items-center gap-2">

<span className="
h-3
w-3
rounded-full
bg-red-500
"/>

<span className="
text-[var(--muted)]
">
Expenses
</span>

</div>




<div className="flex items-center gap-2">

<span className="
h-3
w-3
rounded-full
bg-indigo-500
"/>

<span className="
text-[var(--muted)]
">
Investments
</span>

</div>



</div>





<div className="space-y-5">


{months.map((month)=>(


<div key={month.key}>


<div className="
mb-2
flex
items-center
justify-between
">


<span className="
w-10
text-sm
font-semibold
text-[var(--foreground)]
">

{month.label}

</span>



<span
className={`
text-sm
font-semibold
${
month.cashFlow>=0
?
"text-teal-600"
:
"text-red-600"
}
`}
>

{month.cashFlow>=0?"+":""}

{formatMoney(
month.cashFlow
)}

</span>


</div>





<div className="space-y-2">


{/* Income */}

<div className="flex items-center gap-3">


<span className="
w-20
text-xs
text-[var(--muted)]
">
Income
</span>


<div className="
h-3
flex-1
overflow-hidden
rounded-full
bg-[var(--background)]
">

<div
className="
h-full
rounded-full
bg-green-500
transition-all
"
style={{
width:`${
(month.income/maxValue)*100
}%`,
}}
/>

</div>


<span className="
w-16
text-right
text-xs
font-medium
text-[var(--foreground)]
">

{formatMoney(
month.income
)}

</span>


</div>





{/* Expenses */}

<div className="flex items-center gap-3">


<span className="
w-20
text-xs
text-[var(--muted)]
">
Expenses
</span>


<div className="
h-3
flex-1
overflow-hidden
rounded-full
bg-[var(--background)]
">

<div
className="
h-full
rounded-full
bg-red-500
transition-all
"
style={{
width:`${
(month.expense/maxValue)*100
}%`,
}}
/>

</div>


<span className="
w-16
text-right
text-xs
font-medium
text-[var(--foreground)]
">

{formatMoney(
month.expense
)}

</span>


</div>





{/* Investment */}

<div className="flex items-center gap-3">


<span className="
w-20
text-xs
text-[var(--muted)]
">
Invested
</span>


<div className="
h-3
flex-1
overflow-hidden
rounded-full
bg-[var(--background)]
">

<div
className="
h-full
rounded-full
bg-indigo-500
transition-all
"
style={{
width:`${
(month.investment/maxValue)*100
}%`,
}}
/>

</div>


<span className="
w-16
text-right
text-xs
font-medium
text-[var(--foreground)]
">

{formatMoney(
month.investment
)}

</span>


</div>



</div>



</div>


))}


</div>



</div>


)}



</section>

);


}