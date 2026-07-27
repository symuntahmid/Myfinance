export type Player = {
  name: string;

  xp: number;

  wealthScore: number;

  streak: number;

  achievements: number;

  netWorth: number;

  monthlyCashFlow: number;

  savingRate: number;

  investments: number;
};

const STORAGE_KEY = "myfinance-player";

const DEFAULT_PLAYER: Player = {
  name: "Symun",

  xp: 0,

  wealthScore: 0,

  streak: 1,

  achievements: 0,

  netWorth: 0,

  monthlyCashFlow: 0,

  savingRate: 0,

  investments: 0,
};

export function getPlayer(): Player {
  if (typeof window === "undefined") {
    return DEFAULT_PLAYER;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_PLAYER)
    );

    return DEFAULT_PLAYER;
  }

  const parsed = JSON.parse(saved);

return {
  ...DEFAULT_PLAYER,
  ...parsed,
};
}

export function savePlayer(player: Player) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(player)
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}

export function addXP(amount: number) {
  const player = getPlayer();

  player.xp += amount;

  savePlayer(player);
}

export function getLevel() {
  const player = getPlayer();

  const level = Math.floor(player.xp / 100) + 1;

  const currentXP = player.xp % 100;

  return {
    level,
    currentXP,
    nextLevelXP: 100,
    percent: currentXP,
  };
}

export function getFinancialHealth() {
  const player = getPlayer();

  let score = 0;

  // Saving Rate (25)
  score += Math.min(player.savingRate, 25);

  // Positive Cash Flow (20)
  if (player.monthlyCashFlow > 0) score += 20;

  // Investments (20)
  score += Math.min(player.investments / 1000, 20);

  // Net Worth (20)
  score += Math.min(player.netWorth / 5000, 20);

  // Learning (15)
  score += Math.min(player.xp / 10, 15);

  return Math.round(Math.min(score, 100));
}