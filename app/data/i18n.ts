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


  const language =
    settings.language === "bn"
      ? "bn"
      : "en";


  return (
    translations[language][key]
    ??
    translations.en[key]
  );

}