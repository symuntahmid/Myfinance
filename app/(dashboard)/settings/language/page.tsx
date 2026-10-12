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
  languages,
} from "@/app/data/languages";

import {
  updateSettings,
} from "@/app/data/settings";

import {
  useLanguage,
  type Language,
} from "@/app/context/LanguageContext";


export default function LanguagePage() {

  const {
    language: selected,
    setLanguage,
  } = useLanguage();


  const [search, setSearch] =
    useState("");


  /* =====================================================
     FILTER LANGUAGES
  ===================================================== */

  const filteredLanguages =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return languages;
      }


      return languages.filter(
        (language) =>
          language.name
            .toLowerCase()
            .includes(query) ||
          language.nativeName
            .toLowerCase()
            .includes(query)
      );

    }, [search]);


  /* =====================================================
     SELECT LANGUAGE
  ===================================================== */

  const handleSelect = (
    selectedLanguage:
      (typeof languages)[number]
  ) => {

    /*
     * The current translation system
     * supports only English and Bangla.
     */

    if (
      selectedLanguage.code !== "en" &&
      selectedLanguage.code !== "bn"
    ) {
      return;
    }


    const nextLanguage =
      selectedLanguage.code as Language;


    /*
     * IMPORTANT:
     *
     * Update LanguageContext first.
     * This makes every component using
     * useLanguage() / t() re-render.
     */

    setLanguage(nextLanguage);


    /*
     * Keep settings storage synchronized.
     */

    updateSettings({
      language: nextLanguage,
    });


    /*
     * Notify components that still
     * listen for languageUpdated.
     */

    window.dispatchEvent(
      new Event("languageUpdated")
    );

  };


  return (

    <div className="
      mx-auto
      max-w-3xl
      pb-10
    ">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        mb-7
        flex
        items-center
        gap-3
      ">


        <Link
          href="/settings"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--card)]
            text-[var(--muted)]
            shadow-sm
            transition
            hover:bg-black/5
            dark:hover:bg-white/5
          "
        >

          <ArrowLeft size={18} />

        </Link>


        <div>

          <h1 className="
            text-3xl
            font-bold
            tracking-tight
            text-[var(--foreground)]
          ">
            Language
          </h1>


          <p className="
            mt-1
            text-sm
            text-[var(--muted)]
          ">
            Choose your preferred language for MyFinance.
          </p>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-5">

        <div className="relative">


          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
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
            placeholder="Search language..."
            className="
              w-full
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card)]
              py-3.5
              pl-11
              pr-4
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


      {/* =================================================
          COUNT
      ================================================= */}

      <div className="
        mb-3
        px-2
        text-xs
        text-[var(--muted)]
      ">

        {filteredLanguages.length}{" "}

        {
          filteredLanguages.length === 1
            ? "language"
            : "languages"
        }

      </div>


      {/* =================================================
          LANGUAGE LIST
      ================================================= */}

      <div className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        shadow-sm
      ">


        {
          filteredLanguages.map(
            (language, index) => {

              const isSelected =
                selected === language.code;


              return (

                <div
                  key={language.code}
                >


                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(language)
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      gap-4
                      px-5
                      py-4
                      text-left
                      transition

                      ${
                        isSelected
                          ? "bg-cyan-500/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }
                    `}
                  >


                    {/* FLAG */}

                    <span className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      text-2xl
                    ">
                      {language.flag}
                    </span>


                    {/* NAME */}

                    <div className="
                      flex-1
                    ">


                      <p className="
                        text-sm
                        font-semibold
                        text-[var(--foreground)]
                      ">
                        {language.name}
                      </p>


                      <p className="
                        mt-0.5
                        text-xs
                        text-[var(--muted)]
                      ">
                        {language.nativeName}
                      </p>


                    </div>


                    {/* CHECK */}

                    {
                      isSelected && (

                        <span className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-cyan-500
                          text-white
                        ">

                          <Check size={16} />

                        </span>

                      )
                    }


                  </button>


                  {
                    index <
                      filteredLanguages.length - 1 && (

                      <div className="
                        ml-[68px]
                        border-t
                        border-[var(--border)]
                      " />

                    )
                  }


                </div>

              );

            }
          )
        }


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {
          filteredLanguages.length === 0 && (

            <div className="
              px-6
              py-12
              text-center
            ">


              <p className="
                text-sm
                font-semibold
                text-[var(--foreground)]
              ">
                No languages found
              </p>


              <p className="
                mt-1
                text-xs
                text-[var(--muted)]
              ">
                Try searching for another language.
              </p>


            </div>

          )
        }


      </div>


    </div>

  );

}