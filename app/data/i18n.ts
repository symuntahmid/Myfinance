import {
  getSettings,
} from "./settings";


import {
  translations,
  TranslationKey,
} from "./translations";



export function t(
  key: TranslationKey
): string {


  const settings =
    getSettings();



  const selectedLanguage =
    settings.language || "English";



  const languageCode =
    Object.keys(translations).find(
      (code) => {

        const language =
          getLanguageName(code);

        return language === selectedLanguage;

      }
    ) || "en";



  return (
    translations[
      languageCode
    ][key]
    ??
    translations.en[key]
  );

}



/*
  Convert language code
  to saved language name

  Example:

  bn -> Bangla
  es -> Spanish
*/

function getLanguageName(
  code: string
) {

  const names: Record<
    string,
    string
  > = {

    en: "English",
    bn: "Bangla",
    hi: "Hindi",
    ar: "Arabic",
    es: "Spanish",
    pt: "Portuguese",
    fr: "French",
    de: "German",
    id: "Indonesian",
    vi: "Vietnamese",
    ko: "Korean",
    ja: "Japanese",

  };


  return names[code];

}