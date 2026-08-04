export type PortfolioSnapshot = {
  id: string;
  date: string;
  value: number;
};

const STORAGE_KEY = "myfinance-portfolio-history";

export function getPortfolioHistory(): PortfolioSnapshot[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
  return JSON.parse(saved);
}

return [
  {
    id: crypto.randomUUID(),
    date: "2026-07-28",
    value: 45,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-07-29",
    value: 72,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-07-30",
    value: 95,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-07-31",
    value: 118,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-08-01",
    value: 140,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-08-02",
    value: 165,
  },
  {
    id: crypto.randomUUID(),
    date: "2026-08-03",
    value: 185,
  },
];
}

export function savePortfolioHistory(
  history: PortfolioSnapshot[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );

  window.dispatchEvent(
    new Event("portfolioHistoryUpdated")
  );
}

export function addPortfolioSnapshot(
  value: number
) {
  const history = getPortfolioHistory();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const last = history[history.length - 1];

  if (last && last.date.startsWith(today)) {
    last.value = value;
  } else {
    history.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      value,
    });
  }

  savePortfolioHistory(history);
}

export function clearPortfolioHistory() {
  savePortfolioHistory([]);
}