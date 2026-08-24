"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  getTransactions,
  Transaction,
} from "../data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";



export default function RecentTransactions() {


  const [transactions,setTransactions] =
    useState<Transaction[]>([]);


  const [,forceCurrencyUpdate] =
    useState(0);



  useEffect(()=>{


    function refreshTransactions(){

      setTransactions(
        getTransactions()
      );

    }



    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };



    refreshTransactions();



    window.addEventListener(
      "transactionsUpdated",
      refreshTransactions
    );


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );



    return ()=>{


      window.removeEventListener(
        "transactionsUpdated",
        refreshTransactions
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
      mt-10
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-8
      shadow-sm
      "
    >


      <div className="
      mb-8
      flex
      items-center
      justify-between
      ">


        <h2 className="
        text-2xl
        font-bold
        text-[var(--foreground)]
        ">
          Recent Transactions
        </h2>



        <Link
          href="/money/transactions"
          className="
          text-sm
          font-semibold
          text-[var(--primary)]
          transition
          hover:opacity-80
          "
        >
          View All →
        </Link>


      </div>




      {
        transactions.length === 0

        ?

        <div
          className="
          rounded-2xl
          border-2
          border-dashed
          border-[var(--border)]
          py-14
          text-center
          "
        >

          <p className="
          text-lg
          font-semibold
          text-[var(--foreground)]
          ">
            No transactions yet
          </p>


          <p className="
          mt-2
          text-[var(--muted)]
          ">
            Your latest transactions will appear here.
          </p>


        </div>


        :


        <table className="w-full">


          <thead>

            <tr
              className="
              border-b
              border-[var(--border)]
              "
            >

              <th className="py-3 text-left text-sm font-semibold text-[var(--muted)]">
                Type
              </th>

              <th className="py-3 text-left text-sm font-semibold text-[var(--muted)]">
                Source
              </th>

              <th className="py-3 text-left text-sm font-semibold text-[var(--muted)]">
                Category
              </th>

              <th className="py-3 text-right text-sm font-semibold text-[var(--muted)]">
                Amount
              </th>

            </tr>

          </thead>



          <tbody>


          {
            transactions
            .slice(0,3)
            .map((transaction)=>(


              <tr
                key={transaction.id}
                className="
                border-b
                border-[var(--border)]
                last:border-0
                "
              >


                <td className="py-5">

                  <span
                    className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold

                    ${
                      transaction.type === "Income"
                      ?
                      "bg-green-100 text-green-700"
                      :
                      transaction.type === "Expense"
                      ?
                      "bg-red-100 text-red-700"
                      :
                      "bg-[var(--primary)]/10 text-[var(--primary)]"
                    }
                    `}
                  >

                    {transaction.type}

                  </span>

                </td>



                <td className="
                font-medium
                text-[var(--foreground)]
                ">

                  {transaction.source}

                </td>



                <td className="
                text-[var(--muted)]
                ">

                  {transaction.category || "-"}

                </td>




                <td
                  className={`
                  text-right
                  text-lg
                  font-bold

                  ${
                    transaction.type === "Income"
                    ?
                    "text-green-600"
                    :
                    transaction.type === "Expense"
                    ?
                    "text-red-500"
                    :
                    "text-[var(--primary)]"
                  }
                  `}
                >

                  {
                    transaction.type === "Expense"
                    ?
                    "-"
                    :
                    "+"
                  }

                  {formatCurrency(
                    transaction.amount
                  )}

                </td>



              </tr>


            ))
          }


          </tbody>


        </table>

      }


    </div>

  );

}