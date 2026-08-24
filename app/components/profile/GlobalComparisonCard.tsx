"use client";

import WorldMap from "react-svg-worldmap";
import { formatCurrency } from "@/app/utils/currency";
import { useEffect, useState } from "react";

const comparisonData = [
  { country: "bd" as const, value: 58 },
  { country: "in" as const, value: 72 },
  { country: "us" as const, value: 84 },
  { country: "gb" as const, value: 78 },
  { country: "de" as const, value: 75 },
  { country: "jp" as const, value: 81 },
  { country: "au" as const, value: 69 },
  { country: "ca" as const, value: 77 },
];


export default function GlobalComparisonCard() {

  const [, forceCurrencyUpdate] =
    useState(0);


  useEffect(() => {

    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return () => {

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };


  }, []);



  return (

    <section
      className="
      overflow-hidden
      rounded-3xl
      border border-[var(--border)]
      bg-[var(--card)]
      shadow-sm
      "
    >


      {/* Header */}

      <div className="
        flex
        items-start
        justify-between
        p-6
        pb-2
      ">

        <div>

          <p className="
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-[var(--muted)]
          ">
            🌍 Global Comparison
          </p>


          <h2 className="
            mt-1
            text-xl
            font-bold
            text-[var(--foreground)]
          ">
            See how your spending aligns worldwide
          </h2>


        </div>



        <button
          className="
          rounded-full
          bg-[var(--background)]
          px-3
          py-2
          text-sm
          text-[var(--muted)]
          transition
          hover:opacity-80
          "
        >
          ☰
        </button>


      </div>





      {/* Map */}

      <div className="px-5 pt-3">


        <div
          className="
          overflow-hidden
          rounded-2xl
          bg-[var(--background)]
          p-3
          "
        >

          <div className="flex justify-center">


            <WorldMap
              color="#06b6d4"
              title="Global spending comparison"
              valueSuffix="%"
              size="lg"
              data={comparisonData}
            />


          </div>


        </div>


      </div>





      {/* Comparison */}

      <div className="
        space-y-3
        px-6
        pb-6
        pt-4
      ">


        {[
  {
    icon:"🛍️",
    name:"Shopping",
    value:120,
    change:"-15%",
    good:true,
  },
  {
    icon:"🍔",
    name:"Food",
    value:560,
    change:"+15%",
    good:false,
  },
].map((item)=>(

          <div
            key={item.name}
            className="
            flex
            items-center
            justify-between
            "
          >

            <div className="flex items-center gap-2">

              <span className="text-base">
                {item.icon}
              </span>


              <span className="
                text-sm
                font-medium
                text-[var(--foreground)]
              ">
                {item.name}
              </span>


            </div>



            <div className="flex items-center gap-2">

              <span className="
                text-sm
                font-semibold
                text-[var(--foreground)]
              ">
                {formatCurrency(item.value)}
              </span>


              <span
                className={`
                rounded-full
                px-2
                py-1
                text-xs
                font-semibold
                ${
                  item.good
                  ?
                  "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                  :
                  "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                }
                `}
              >
                {item.change}
              </span>


            </div>


          </div>

        ))}





        {/* Overall */}

        <div
          className="
          mt-4
          rounded-2xl
          bg-[var(--background)]
          p-4
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">


            <div>

              <p className="
                text-xs
                text-[var(--muted)]
              ">
                Overall spending
              </p>


              <p className="
                mt-1
                text-lg
                font-bold
                text-[var(--foreground)]
              ">
                Better than 64%
              </p>


            </div>



            <div className="
              rounded-full
              bg-green-100
              px-3
              py-2
              text-xs
              font-bold
              text-green-600
              dark:bg-green-950/40
              dark:text-green-400
            ">
              GOOD
            </div>


          </div>



          <p className="
            mt-2
            text-xs
            leading-5
            text-[var(--muted)]
          ">
            Compared with the current demo global benchmark.
          </p>


        </div>





        {/* Button */}

        <button
          className="
          mt-1
          w-full
          rounded-2xl
          bg-[var(--foreground)]
          py-3
          text-sm
          font-semibold
          text-[var(--card)]
          transition
          hover:opacity-90
          "
        >
          View Global Comparison →
        </button>


      </div>


    </section>

  );

}