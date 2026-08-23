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
  updateSettings,
} from "@/app/data/settings";

import {
  countries,
} from "@/app/data/countries";


export default function CountryPage() {

  const [search, setSearch] =
    useState("");


  const [selected, setSelected] =
    useState(() => {

      if (typeof window === "undefined") {
        return "BD";
      }

      return (
        localStorage.getItem(
          "myfinance-country"
        ) || "BD"
      );

    });



  const filteredCountries =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return countries;
      }


      return countries.filter(
        (country) =>
          country.name
            .toLowerCase()
            .includes(query)
      );

    }, [search]);




  const handleSelect = (
    code: string
  ) => {

    const selectedCountry =
      countries.find(
        (country) =>
          country.code === code
      );


    if (!selectedCountry) {
      return;
    }


    setSelected(code);


    localStorage.setItem(
      "myfinance-country",
      selectedCountry.code
    );


    updateSettings({
      country:
        selectedCountry.name,
    });


    window.location.href =
      "/settings";

  };



  return (

    <div className="mx-auto max-w-3xl pb-10">


      {/* HEADER */}

      <div className="mb-7 flex items-center gap-3">

        <Link
          href="/settings"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-[var(--border)]
            bg-[var(--card)]
            text-[var(--muted)]
            shadow-sm
            transition
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
            Country
          </h1>


          <p className="
            mt-1 text-sm
            text-[var(--muted)]
          ">
            Choose your country for a more personalized experience.
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
            placeholder="Search country..."
            className="
              w-full rounded-2xl
              border border-[var(--border)]
              bg-[var(--card)]
              py-3.5 pl-11 pr-4
              text-sm
              text-[var(--foreground)]
              outline-none
              transition
              placeholder:text-[var(--muted)]
              focus:border-cyan-400
              focus:ring-4
              focus:ring-cyan-50
            "
          />


        </div>

      </div>




      {/* COUNTRY COUNT */}

      <div className="
        mb-3 px-2 text-xs
        text-[var(--muted)]
      ">
        {filteredCountries.length}{" "}
        {
          filteredCountries.length === 1
            ? "country"
            : "countries"
        }
      </div>





      {/* COUNTRY LIST */}

      <div className="
        overflow-hidden rounded-3xl
        border border-[var(--border)]
        bg-[var(--card)]
        shadow-sm
      ">

        {
          filteredCountries.map(
            (country,index)=>{

              const isSelected =
                selected === country.code;


              return (

                <div
                  key={country.code}
                >


                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(
                        country.code
                      )
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


                    <span className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      text-2xl
                    ">
                      {country.flag}
                    </span>




                    <span className="
                      flex-1 text-sm
                      font-semibold
                      text-[var(--foreground)]
                    ">
                      {country.name}
                    </span>





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
                    filteredCountries.length - 1 && (

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





        {
          filteredCountries.length === 0 && (

            <div className="
              px-6 py-12
              text-center
            ">

              <p className="
                text-sm font-semibold
                text-[var(--foreground)]
              ">
                No countries found
              </p>


              <p className="
                mt-1 text-xs
                text-[var(--muted)]
              ">
                Try searching for another country.
              </p>


            </div>

          )
        }


      </div>


    </div>

  );

}