export type AppSettings = {

  country: string;
  language: string;
  currency: string;

  remindersEnabled: boolean;

  darkMode: boolean;

  passcodeEnabled: boolean;
  passcodeHash: string | null;

};


const STORAGE_KEY = "myfinance-settings";


const DEFAULT_SETTINGS: AppSettings = {

  country: "Bangladesh",
  language: "English",
  currency: "USD",

  remindersEnabled: true,

  darkMode: false,

  passcodeEnabled: false,
  passcodeHash: null,

};


/* ==========================================
   GET SETTINGS
========================================== */

export function getSettings(): AppSettings {

  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }


  const saved =
    localStorage.getItem(STORAGE_KEY);


  if (!saved) {
    return DEFAULT_SETTINGS;
  }


  try {

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
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

  if (typeof window === "undefined") {
    return;
  }


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );


  window.dispatchEvent(
    new Event("settingsUpdated")
  );

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