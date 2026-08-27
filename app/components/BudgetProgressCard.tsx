"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  formatCurrency,
} from "@/app/utils/currency";



type Props = {
  budget: number;
  spent: number;
};



export default function BudgetProgressCard({
  budget,
  spent,
}: Props) {


  const [,forceCurrencyUpdate] =
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





  const remaining =
    budget - spent;



  const percentage =
    budget === 0
      ? 0
      : Math.min(
          (spent / budget) * 100,
          100
        );



  return (

    <Link href="/budget">

      <div
        className="
        cursor-pointer
        rounded-3xl
        bg-[var(--card)]
        border
        border-[var(--border)]
        p-8
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        "
      >


        <div className="
        flex
        items-center
        justify-between
        ">


          <h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
  Monthly Budget
</h2>



          <span
            className="
            rounded-full
            bg-[var(--primary)]/10
            px-3
            py-1
            text-sm
font-medium
tracking-tight
text-[var(--primary)]
            "
          >
            {percentage.toFixed(0)}% Used
          </span>


        </div>





        <div className="mt-6">


          <div
className="
mb-3
flex
justify-between
text-sm
font-normal
tracking-tight
text-[var(--muted)]
"
>


            <span>
              Spent
            </span>


            <span>
              {formatCurrency(spent)}
              {" / "}
              {formatCurrency(budget)}
            </span>


          </div>




          <div className="
          h-3
          overflow-hidden
          rounded-full
          bg-[var(--border)]
          ">


            <div

              className="
              h-full
              rounded-full
              bg-[var(--primary)]
              transition-all
              duration-700
              "

              style={{
                width:`${percentage}%`,
              }}

            />


          </div>


        </div>





        <div className="
        mt-8
        grid
        grid-cols-3
        gap-6
        text-center
        ">


          <div>

  <p
    className="
    text-sm
    font-normal
    tracking-tight
    text-[var(--muted)]
    "
  >
    Budget
  </p>


  <p
    className="
    mt-2
    text-2xl
    font-display
    font-medium
    tracking-[-0.03em]
    text-[var(--foreground)]
    "
  >
    {formatCurrency(budget)}
  </p>

</div>





<div>

  <p
    className="
    text-sm
    font-normal
    tracking-tight
    text-[var(--muted)]
    "
  >
    Spent
  </p>


  <p
    className="
    mt-2
    text-2xl
    font-display
    font-medium
    tracking-[-0.03em]
    text-red-500
    "
  >
    {formatCurrency(spent)}
  </p>

</div>





<div>

  <p
    className="
    text-sm
    font-normal
    tracking-tight
    text-[var(--muted)]
    "
  >
    Remaining
  </p>



  <p
    className={`
    mt-2
    text-2xl
    font-display
    font-medium
    tracking-[-0.03em]
    ${
      remaining >= 0
      ? "text-green-600"
      : "text-red-600"
    }
    `}
  >
    {formatCurrency(remaining)}
  </p>

</div>


        </div>



      </div>


    </Link>

  );

}