"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type TranslationKey,
} from "@/app/data/translations";

import {
  getSettings,
  updateSettings,
} from "@/app/data/settings";


/* =====================================================
   LANGUAGE TYPES
===================================================== */

export type Language = "en" | "bn";


type LanguageContextType = {
  language: Language;

  setLanguage: (
    language: Language
  ) => void;

  t: (
    key: TranslationKey,
    params?: Record<string, string | number>
  ) => string;
};


/* =====================================================
   CONTEXT
===================================================== */

const LanguageContext =
  createContext<
    LanguageContextType | undefined
  >(undefined);


/* =====================================================
   PROVIDER
===================================================== */

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    language,
    setLanguageState,
  ] = useState<Language>(() => {

    if (
      typeof window === "undefined"
    ) {
      return "en";
    }

    return getSettings().language;

  });


  /* ===================================================
     SYNC WITH SETTINGS
  =================================================== */

  useEffect(() => {

    const syncLanguage = () => {

      const settings =
        getSettings();


      setLanguageState(
        settings.language
      );

    };


    /*
     * Sync when settings change.
     */

    window.addEventListener(
      "settingsUpdated",
      syncLanguage
    );


    /*
     * Sync when language changes.
     */

    window.addEventListener(
      "languageUpdated",
      syncLanguage
    );


    /*
     * Initial synchronization.
     */

    syncLanguage();


    return () => {

      window.removeEventListener(
        "settingsUpdated",
        syncLanguage
      );


      window.removeEventListener(
        "languageUpdated",
        syncLanguage
      );

    };

  }, []);


  /* ===================================================
     CHANGE LANGUAGE
  =================================================== */

  const setLanguage = useCallback(
    (nextLanguage: Language) => {

      /*
       * Update the application's
       * real settings storage.
       */

      updateSettings({
        language: nextLanguage,
      });


      /*
       * Update Context immediately.
       */

      setLanguageState(
        nextLanguage
      );


      /*
       * Notify components that
       * depend on language.
       */

      window.dispatchEvent(
        new Event("languageUpdated")
      );

    },
    []
  );


  /* ===================================================
     TRANSLATION FUNCTION
  =================================================== */

  const t = useCallback(
    (
      key: TranslationKey,
      params?: Record<
        string,
        string | number
      >
    ): string => {

      /*
       * Get translation from
       * selected language.
       */

      let value =
        translations[
          language
        ]?.[key];


      /*
       * Fallback to English
       * if translation is missing.
       */

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {

        value =
          translations.en[key];

      }


      /*
       * Final fallback.
       */

      if (
        value === undefined ||
        value === null
      ) {

        return String(key);

      }


      /*
       * Replace dynamic parameters.
       */

      if (!params) {

        return value;

      }


      return Object.entries(
        params
      ).reduce(
        (
          result,
          [paramKey, paramValue]
        ) => {

          return result.replace(
            new RegExp(
              `\\{${paramKey}\\}`,
              "g"
            ),
            String(paramValue)
          );

        },
        value
      );

    },
    [language]
  );


  /* ===================================================
     CONTEXT VALUE
  =================================================== */

  const contextValue =
    useMemo<LanguageContextType>(
      () => ({

        language,

        setLanguage,

        t,

      }),
      [
        language,
        setLanguage,
        t,
      ]
    );


  return (

    <LanguageContext.Provider
      value={contextValue}
    >

      {children}

    </LanguageContext.Provider>

  );

}


/* =====================================================
   LANGUAGE HOOK
===================================================== */

export function useLanguage() {

  const context =
    useContext(
      LanguageContext
    );


  if (!context) {

    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );

  }


  return context;

}