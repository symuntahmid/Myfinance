export type AppSettings = {
  country: string;

  // language code
  // en = English
  // bn = Bangla
  language: "en" | "bn";

  currency: string;

  remindersEnabled: boolean;

  darkMode: boolean;

  passcodeEnabled: boolean;

  passcodeHash: string | null;
};


const STORAGE_KEY =
  "myfinance-settings";


const DEFAULT_SETTINGS: AppSettings = {

  country:
    "Bangladesh",

  language:
    "en",

  currency:
    "USD",

  remindersEnabled:
    true,

  darkMode:
    false,

  passcodeEnabled:
    false,

  passcodeHash:
    null,

};


/* ==========================================
   GET SETTINGS
========================================== */

export function getSettings(): AppSettings {

  if (
    typeof window === "undefined"
  ) {
    return DEFAULT_SETTINGS;
  }


  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {
    return DEFAULT_SETTINGS;
  }


  try {

    const parsed =
      JSON.parse(saved);


    return {

      ...DEFAULT_SETTINGS,

      ...parsed,

      language:
        parsed.language === "bn"
          ? "bn"
          : "en",

    };

  } catch {

    console.error(
      "Failed to load MyFinance settings."
    );

    return DEFAULT_SETTINGS;
  }
}


/* ==========================================
   SAVE SETTINGS
========================================== */

export function saveSettings(
  settings: AppSettings
) {

  if (
    typeof window === "undefined"
  ) {
    return;
  }


  const previousSettings =
    getSettings();


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );


  window.dispatchEvent(
    new Event(
      "settingsUpdated"
    )
  );


  /*
   * Notify the application when
   * the language changes.
   */

  if (
    previousSettings.language !==
    settings.language
  ) {

    window.dispatchEvent(
      new Event(
        "languageUpdated"
      )
    );

  }
}


/* ==========================================
   UPDATE SETTINGS
========================================== */

export function updateSettings(
  updates: Partial<AppSettings>
) {

  const current =
    getSettings();


  saveSettings({

    ...current,

    ...updates,

  });
}


/* ==========================================
   RESET SETTINGS
========================================== */

export function resetSettings() {

  saveSettings(
    DEFAULT_SETTINGS
  );
}


/* ==========================================
   STORAGE KEY
========================================== */

export {
  STORAGE_KEY as SETTINGS_STORAGE_KEY
};