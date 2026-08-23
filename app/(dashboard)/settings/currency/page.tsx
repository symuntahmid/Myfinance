"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Search,
} from "lucide-react";

import {
  currencies,
} from "@/app/data/currencies";

import {
  getSettings,
  updateSettings,
} from "@/app/data/settings";


export default function CurrencyPage() {

  const [search, setSearch] =
    useState("");


  const [selected, setSelected] =
    useState(() => {

      const settings =
        getSettings();

      return settings.currency || "USD";

    });




  const filteredCurrencies =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return currencies;
      }


      return currencies.filter(
        (currency) =>
          currency.name
            .toLowerCase()
            .includes(query) ||
          currency.code
            .toLowerCase()
            .includes(query) ||
          currency.symbol
            .toLowerCase()
            .includes(query)
      );

    }, [search]);





  const handleSelect = (
    currency: (typeof currencies)[number]
  ) => {

    setSelected(
      currency.code
    );


    updateSettings({
      currency:
        currency.code,
    });


    window.dispatchEvent(
      new Event("currencyUpdated")
    );

  };





  return (

    <div className="
      mx-auto max-w-3xl pb-10
    ">


      {/* HEADER */}

      <div className="
        mb-7 flex items-center gap-3
      ">


        <Link
          href="/settings"
          className="
            flex h-10 w-10 items-center
            justify-center rounded-xl
            border border-[var(--border)]
            bg-[var(--card)]
            text-[var(--muted)]
            shadow-sm transition
            hover:bg-black/5
            dark:hover:bg-white/5
          "
        >
          <ArrowLeft size={18}/>
        </Link>



        <div>

          <h1 className="
            text-3xl font-bold tracking-tight
            text-[var(--foreground)]
          ">
            Currency
          </h1>


          <p className="
            mt-1 text-sm
            text-[var(--muted)]
          ">
            Choose the currency you want to use in MyFinance.
          </p>

        </div>


      </div>





      {/* SEARCH */}

      <div className="mb-5">

        <div className="relative">


          <Search
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-[var(--muted)]
            "
          />


          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search currency..."
            className="
              w-full rounded-2xl
              border border-[var(--border)]
              bg-[var(--card)]
              py-3.5 pl-11 pr-4
              text-sm
              text-[var(--foreground)]
              outline-none transition
              placeholder:text-[var(--muted)]
              focus:border-cyan-400
              focus:ring-4 focus:ring-cyan-50
            "
          />


        </div>

      </div>





      {/* COUNT */}

      <div className="
        mb-3 px-2 text-xs
        text-[var(--muted)]
      ">
        {filteredCurrencies.length}{" "}
        {
          filteredCurrencies.length === 1
            ? "currency"
            : "currencies"
        }
      </div>







      {/* CURRENCY LIST */}

      <div className="
        overflow-hidden rounded-3xl
        border border-[var(--border)]
        bg-[var(--card)]
        shadow-sm
      ">


        {
          filteredCurrencies.map(
            (currency,index)=>{

              const isSelected =
                selected === currency.code;



              return (

                <div
                  key={currency.code}
                >


                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(currency)
                    }
                    className={`
                      flex w-full items-center
                      gap-4 px-5 py-4
                      text-left transition
                      ${
                        isSelected
                          ? "bg-cyan-500/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }
                    `}
                  >


                    {/* FLAG */}

                    <span className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      text-2xl
                    ">
                      {currency.flag}
                    </span>





                    {/* NAME */}

                    <div className="
                      min-w-0 flex-1
                    ">

                      <p className="
                        text-sm font-semibold
                        text-[var(--foreground)]
                      ">
                        {currency.name}
                      </p>


                      <p className="
                        mt-0.5 text-xs
                        text-[var(--muted)]
                      ">
                        {currency.code} · {currency.symbol}
                      </p>


                    </div>






                    {/* SELECTED */}

                    {
                      isSelected && (

                        <span className="
                          flex h-7 w-7 shrink-0
                          items-center justify-center
                          rounded-full
                          bg-cyan-500
                          text-white
                        ">
                          <Check size={16}/>
                        </span>

                      )
                    }



                  </button>





                  {
                    index <
                    filteredCurrencies.length - 1 && (

                      <div className="
                        ml-[68px]
                        border-t
                        border-[var(--border)]
                      "/>

                    )
                  }



                </div>

              );

            }
          )
        }






        {/* NO RESULTS */}

        {
          filteredCurrencies.length === 0 && (

            <div className="
              px-6 py-12 text-center
            ">


              <p className="
                text-sm font-semibold
                text-[var(--foreground)]
              ">
                No currencies found
              </p>


              <p className="
                mt-1 text-xs
                text-[var(--muted)]
              ">
                Try searching for another currency.
              </p>


            </div>

          )
        }


      </div>


    </div>

  );

}