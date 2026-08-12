import {
  clearTransactions,
} from "./transactions";

import {
  clearInvestments,
} from "./investments";

import {
  clearBudgets,
} from "./budgets";

import {
  resetSettings,
} from "./settings";

const PLAYER_STORAGE_KEY =
  "myfinance-player";

/* ==========================================
   EXPORT
========================================== */

export function exportMyFinanceData() {
  if (typeof window === "undefined") {
    return;
  }

  const backup = {
    version: 1,

    exportedAt:
      new Date().toISOString(),

    transactions: JSON.parse(
      localStorage.getItem(
        "myfinance-transactions"
      ) || "[]"
    ),

    investments: JSON.parse(
      localStorage.getItem(
        "myfinance-investments"
      ) || "[]"
    ),

    budgets: JSON.parse(
      localStorage.getItem(
        "myfinance-budgets"
      ) || "[]"
    ),

    player: JSON.parse(
      localStorage.getItem(
        PLAYER_STORAGE_KEY
      ) || "null"
    ),

    settings: JSON.parse(
      localStorage.getItem(
        "myfinance-settings"
      ) || "null"
    ),
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
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

  link.remove();

  URL.revokeObjectURL(url);
}

/* ==========================================
   IMPORT
========================================== */

export function importMyFinanceData(
  file: File
): Promise<void> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        try {
          const backup = JSON.parse(
            String(reader.result)
          );

          if (
            !backup ||
            backup.version !== 1
          ) {
            throw new Error(
              "Invalid MyFinance backup file."
            );
          }

          if (
            !Array.isArray(
              backup.transactions
            ) ||
            !Array.isArray(
              backup.investments
            ) ||
            !Array.isArray(
              backup.budgets
            )
          ) {
            throw new Error(
              "Backup file is incomplete."
            );
          }

          localStorage.setItem(
            "myfinance-transactions",
            JSON.stringify(
              backup.transactions
            )
          );

          localStorage.setItem(
            "myfinance-investments",
            JSON.stringify(
              backup.investments
            )
          );

          localStorage.setItem(
            "myfinance-budgets",
            JSON.stringify(
              backup.budgets
            )
          );

          if (backup.player) {
            localStorage.setItem(
              PLAYER_STORAGE_KEY,
              JSON.stringify(
                backup.player
              )
            );
          }

          if (backup.settings) {
            localStorage.setItem(
              "myfinance-settings",
              JSON.stringify(
                backup.settings
              )
            );
          }

          window.dispatchEvent(
            new Event(
              "transactionsUpdated"
            )
          );

          window.dispatchEvent(
            new Event(
              "investmentsUpdated"
            )
          );

          window.dispatchEvent(
            new Event(
              "budgetsUpdated"
            )
          );

          window.dispatchEvent(
            new Event(
              "player-updated"
            )
          );

          window.dispatchEvent(
            new Event(
              "settingsUpdated"
            )
          );

          window.dispatchEvent(
            new Event(
              "dailyJourneyUpdated"
            )
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Could not read backup file."
          )
        );
      };

      reader.readAsText(file);
    }
  );
}

/* ==========================================
   DELETE ALL ACCOUNT DATA
========================================== */

export function deleteAllAccountData() {
  if (typeof window === "undefined") {
    return;
  }

  clearTransactions();

  clearInvestments();

  clearBudgets();

  localStorage.removeItem(
    PLAYER_STORAGE_KEY
  );

  resetSettings();

  /*
   * Clear other known MyFinance
   * supporting data.
   */

  localStorage.removeItem(
    "myfinance-achievements"
  );

  localStorage.removeItem(
    "myfinance-daily-journey"
  );

  localStorage.removeItem(
    "myfinance-portfolio-history"
  );

  localStorage.removeItem(
    "myfinance-goals"
  );

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
    new Event("player-updated")
  );

  window.dispatchEvent(
    new Event("settingsUpdated")
  );

  window.dispatchEvent(
    new Event("dailyJourneyUpdated")
  );
}