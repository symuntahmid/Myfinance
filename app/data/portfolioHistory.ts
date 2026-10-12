/* =====================================================
   PORTFOLIO HISTORY
   Stores only real portfolio snapshots.

   IMPORTANT:
   - No fake/demo values
   - No generated historical data
   - One snapshot per calendar day
   - Existing day's value is updated
   - History is kept in chronological order
===================================================== */

export type PortfolioSnapshot = {
  id: string;
  date: string;
  value: number;
};


const STORAGE_KEY =
  "myfinance-portfolio-history";


/* =====================================================
   ID HELPER
===================================================== */

function generateId(): string {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }


  return `portfolio-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

}


/* =====================================================
   DATE HELPER
===================================================== */

function getTodayKey(): string {

  const now =
    new Date();


  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

}


/* =====================================================
   READ HISTORY
===================================================== */

export function getPortfolioHistory(): PortfolioSnapshot[] {

  if (
    typeof window === "undefined"
  ) {

    return [];

  }


  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    return [];

  }


  try {

    const parsed =
      JSON.parse(saved);


    if (
      !Array.isArray(parsed)
    ) {

      return [];

    }


    return parsed
      .filter((item): item is PortfolioSnapshot => {

        if (!item) {
          return false;
        }


        const date =
          new Date(item.date);


        const value =
          Number(item.value);


        return (
          typeof item.date === "string" &&
          !Number.isNaN(date.getTime()) &&
          Number.isFinite(value) &&
          value >= 0
        );

      })
      .map((item) => ({

        id:
          String(item.id),

        date:
          item.date,

        value:
          Number(item.value),

      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

  } catch (error) {

    console.error(
      "Failed to read portfolio history:",
      error
    );


    return [];

  }

}


/* =====================================================
   SAVE HISTORY
===================================================== */

export function savePortfolioHistory(
  history: PortfolioSnapshot[]
): void {

  if (
    typeof window === "undefined"
  ) {

    return;

  }


  const cleanedHistory =
    history
      .filter((item) => {

        if (!item) {
          return false;
        }


        const date =
          new Date(item.date);


        const value =
          Number(item.value);


        return (
          !Number.isNaN(date.getTime()) &&
          Number.isFinite(value) &&
          value >= 0
        );

      })
      .map((item) => ({

        id:
          String(item.id),

        date:
          item.date,

        value:
          Number(item.value),

      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(cleanedHistory)
  );


  window.dispatchEvent(
    new Event(
      "portfolioHistoryUpdated"
    )
  );

}


/* =====================================================
   ADD / UPDATE TODAY'S SNAPSHOT

   This should be called whenever the real portfolio
   value changes.

   Example:
   addPortfolioSnapshot(7000);
===================================================== */

export function addPortfolioSnapshot(
  value: number
): void {

  if (
    typeof window === "undefined"
  ) {

    return;

  }


  const numericValue =
    Number(value);


  if (
    !Number.isFinite(numericValue) ||
    numericValue < 0
  ) {

    return;

  }


  const history =
    getPortfolioHistory();


  const today =
    getTodayKey();


  const existingIndex =
    history.findIndex(
      (snapshot) =>
        snapshot.date.startsWith(
          today
        )
    );


  if (
    existingIndex !== -1
  ) {

    history[existingIndex] = {

      ...history[existingIndex],

      value:
        numericValue,

    };

  } else {

    history.push({

      id:
        generateId(),

      date:
        new Date().toISOString(),

      value:
        numericValue,

    });

  }


  savePortfolioHistory(
    history
  );

}


/* =====================================================
   REMOVE ONE SNAPSHOT
===================================================== */

export function deletePortfolioSnapshot(
  id: string
): void {

  const history =
    getPortfolioHistory();


  const updated =
    history.filter(
      (snapshot) =>
        snapshot.id !== id
    );


  savePortfolioHistory(
    updated
  );

}


/* =====================================================
   CLEAR ALL HISTORY
===================================================== */

export function clearPortfolioHistory(): void {

  if (
    typeof window === "undefined"
  ) {

    return;

  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  window.dispatchEvent(
    new Event(
      "portfolioHistoryUpdated"
    )
  );

}