"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getTransactions,
} from "@/app/data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";



export default function ExpenseBreakdown() {


  const [categories,setCategories] =
    useState<
      {
        name:string;
        amount:number;
        percent:number;
      }[]
    >([]);



  const [,forceCurrencyUpdate] =
    useState(0);




  useEffect(()=>{


    function refresh(){


      const transactions =
        getTransactions();




      const expenses =
        transactions.filter(
          t=>t.type==="Expense"
        );




      const grouped:
        Record<string,number> = {};



      expenses.forEach((transaction)=>{


        const category =
          transaction.category?.trim()
          ||
          "Other";



        grouped[category] =
          (
            grouped[category] || 0
          )
          +
          transaction.amount;


      });






      const total =
        Object.values(grouped)
        .reduce(
          (sum,value)=>
            sum+value,
          0
        );





      const result =
        Object.entries(grouped)
        .map(
          ([name,amount])=>({

            name,

            amount,

            percent:
              total===0
              ?
              0
              :
              (
                amount / total
              )
              *
              100,

          })
        )
        .sort(
          (a,b)=>b.amount-a.amount
        );



      setCategories(result);


    }





    const currencyListener = () => {

      forceCurrencyUpdate(
        value=>value+1
      );

    };




    refresh();




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







return (

<div
className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-8
shadow-xl
"
>



<div
className="
mb-8
"
>


<h2
className="
text-2xl
font-bold
text-[var(--foreground)]
"
>
Expense Breakdown
</h2>



<p
className="
mt-2
text-[var(--muted)]
"
>
Where your money goes.
</p>



</div>







{
categories.length===0

?

<div
className="
py-10
text-center
text-[var(--muted)]
"
>
No expenses yet.
</div>


:


<div
className="
space-y-6
"
>


{
categories.map((item)=>(


<div
key={item.name}
>



<div
className="
mb-2
flex
justify-between
"
>


<div>


<p
className="
font-semibold
text-[var(--foreground)]
"
>
{item.name}
</p>



<p
className="
text-sm
text-[var(--muted)]
"
>
{formatCurrency(item.amount)}
</p>



</div>





<p
className="
font-bold
text-cyan-600
"
>
{item.percent.toFixed(1)}%
</p>



</div>







<div
className="
h-3
overflow-hidden
rounded-full
bg-[var(--background)]
"
>


<div

className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-500
to-blue-600
transition-all
duration-700
"

style={{
width:`${item.percent}%`,
}}

/>


</div>





</div>


))

}



</div>


}



</div>

);

}