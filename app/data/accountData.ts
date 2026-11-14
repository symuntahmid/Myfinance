"use client";

import { getSettings, saveSettings } from "./settings";

const STORAGE_KEYS = {
  transactions: "myfinance-transactions",
  investments: "myfinance-investments",
  budgets: "myfinance-budgets",
  player: "myfinance-player",
  settings: "myfinance-settings",
  portfolioHistory: "myfinance-portfolio-history",
  goals: "myfinance-goals",
  achievements: "myfinance-achievements",
  dailyJourney: "myfinance-daily-journey",
  dailyStreak: "myfinance-daily-streak",
  streakHistory: "myfinance-streak-history",
  streakFreeze: "myfinance-streak-freeze",
  customReminders: "myfinance-custom-reminders",
  accounts: "myfinance-accounts",
  plan: "myfinance-plan",
  planCategories: "myfinance-plan-categories",
  bills: "myfinance-bills",
  debts: "myfinance-debts",
  netWorthHistory: "myfinance-networth-history",
  lifeGoals: "myfinance-life-goals",
  freedom: "myfinance-freedom",
};

/* ==========================================
   HELPERS
========================================== */

function getStoredArray(key: string) {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(key);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStoredObject(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = localStorage.getItem(key);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

/* ==========================================
   EXPORT
========================================== */

export function exportMyFinanceData() {
  if (typeof window === "undefined") {
    return;
  }

  // Version 2: a copy of everything the app keeps on this phone
  // (every "myfinance-" entry), so nothing is forgotten.
  const keys: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (key && key.startsWith("myfinance-")) {
      keys[key] = localStorage.getItem(key) ?? "";
    }
  }

  const backup = {
    app: "myfinance",
    version: 2,
    exportedAt: new Date().toISOString(),
    keys,
  };

  const blob = new Blob(
    [
      JSON.stringify(
        backup,
        null,
        2
      ),
    ],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `myfinance-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* ==========================================
   IMPORT
========================================== */

export async function importMyFinanceData(
  file: File
) {
  if (typeof window === "undefined") {
    return;
  }

  const text =
    await file.text();

  let backup: any;

  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error(
      "Invalid JSON backup file."
    );
  }

  /* ------------------------------------------
     BASIC VALIDATION
  ------------------------------------------ */

  if (
    !backup ||
    typeof backup !== "object"
  ) {
    throw new Error(
      "Invalid MyFinance backup."
    );
  }

  if (backup.version === 2 && backup.keys && typeof backup.keys === "object") {
    const entries = Object.entries(backup.keys as Record<string, unknown>).filter(
      ([key, value]) => key.startsWith("myfinance-") && typeof value === "string"
    );

    if (entries.length === 0) {
      throw new Error("The backup is empty.");
    }

    // Replace the current data with the backup.
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const key = localStorage.key(i);

      if (key && key.startsWith("myfinance-")) {
        localStorage.removeItem(key);
      }
    }

    entries.forEach(([key, value]) =>
      localStorage.setItem(key, value as string)
    );

    // Reload so every screen reads the restored data.
    setTimeout(() => window.location.reload(), 300);

    return;
  }

  if (
    backup.version !== 1
  ) {
    throw new Error(
      "Unsupported MyFinance backup version."
    );
  }

  /* ------------------------------------------
     VALIDATE MAIN DATA
  ------------------------------------------ */

  const arrayKeys = [
    "transactions",
    "investments",
    "budgets",
    "portfolioHistory",
    "goals",
    "achievements",
    "dailyJourney",
  ];

  for (const key of arrayKeys) {
    if (
      backup[key] !== undefined &&
      !Array.isArray(backup[key])
    ) {
      throw new Error(
        `Invalid ${key} data.`
      );
    }
  }

  if (
    backup.settings !== undefined &&
    (
      !backup.settings ||
      typeof backup.settings !== "object"
    )
  ) {
    throw new Error(
      "Invalid settings data."
    );
  }

  /* ------------------------------------------
     RESTORE ARRAYS
  ------------------------------------------ */

  const restoreArray = (
    key: string,
    value: unknown
  ) => {
    if (Array.isArray(value)) {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    }
  };

  restoreArray(
    STORAGE_KEYS.transactions,
    backup.transactions
  );

  restoreArray(
    STORAGE_KEYS.investments,
    backup.investments
  );

  restoreArray(
    STORAGE_KEYS.budgets,
    backup.budgets
  );

  restoreArray(
    STORAGE_KEYS.portfolioHistory,
    backup.portfolioHistory
  );

  restoreArray(
    STORAGE_KEYS.goals,
    backup.goals
  );

  restoreArray(
    STORAGE_KEYS.achievements,
    backup.achievements
  );

  restoreArray(
    STORAGE_KEYS.dailyJourney,
    backup.dailyJourney
  );

  /* ------------------------------------------
     RESTORE PLAYER
  ------------------------------------------ */

  if (
    backup.player &&
    typeof backup.player === "object"
  ) {
    localStorage.setItem(
      STORAGE_KEYS.player,
      JSON.stringify(
        backup.player
      )
    );
  }

  /* ------------------------------------------
     RESTORE SETTINGS
  ------------------------------------------ */

  if (
    backup.settings &&
    typeof backup.settings === "object"
  ) {
    saveSettings(
      backup.settings
    );
  }

  /* ------------------------------------------
     REFRESH APPLICATION
  ------------------------------------------ */

  window.dispatchEvent(
    new Event("transactionsUpdated")
  );

  window.dispatchEvent(
    new Event("investmentsUpdated")
  );

  window.dispatchEvent(
    new Event("budgetsUpdated")
  );

  window.dispatchEvent(
    new Event("settingsUpdated")
  );

  window.dispatchEvent(
    new Event("player-updated")
  );

  window.dispatchEvent(
    new Event("countryUpdated")
  );

  window.dispatchEvent(
    new Event("languageUpdated")
  );

  window.dispatchEvent(
    new Event("currencyUpdated")
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );

  /*
   * Give React components time to
   * receive the restored localStorage data.
   */

  await new Promise(
    (resolve) =>
      setTimeout(resolve, 100)
  );

  return true;
}

/* ==========================================
   DELETE ALL ACCOUNT DATA
========================================== */

export function deleteAllAccountData() {
  if (typeof window === "undefined") {
    return;
  }

  Object.values(
    STORAGE_KEYS
  ).forEach((key) => {
    localStorage.removeItem(key);
  });

  window.dispatchEvent(
    new Event("transactionsUpdated")
  );

  window.dispatchEvent(
    new Event("investmentsUpdated")
  );

  window.dispatchEvent(
    new Event("budgetsUpdated")
  );

  window.dispatchEvent(
    new Event("settingsUpdated")
  );

  window.dispatchEvent(
    new Event("player-updated")
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );
}