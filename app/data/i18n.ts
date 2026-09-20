import {
  getSettings,
} from "./settings";


import {
  translations,
  TranslationKey,
} from "./translations";



export function t(
  key: TranslationKey
) {


  const settings =
    getSettings();



  const language =
    settings.language || "en";



  const currentTranslation =
    translations[language];



  if (
    currentTranslation &&
    currentTranslation[key]
  ) {

    return currentTranslation[key];

  }



  // fallback to English

  return translations.en[key];

}