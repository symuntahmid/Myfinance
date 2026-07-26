export type Player = {
  name: string;
  rank: string;
  xp: number;
  level: number;
  streak: number;
  achievements: number;
  wealthScore: number;
};

const STORAGE_KEY = "myfinance-player";

const DEFAULT_PLAYER: Player = {
  name: "Symun",
  rank: "Financial Explorer",
  xp: 840,
  level: 8,
  streak: 18,
  achievements: 12,
  wealthScore: 8420,
};



export function getPlayer(): Player {
  if (typeof window === "undefined") {
    return DEFAULT_PLAYER;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_PLAYER)
    );

    return DEFAULT_PLAYER;
  }

  const savedPlayer = JSON.parse(data);

  return {
    ...DEFAULT_PLAYER,
    ...savedPlayer,
  };
}

export function savePlayer(player: Player) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(player)
  );
}

export function addXP(amount: number) {
  const player = getPlayer();

  player.xp += amount;

  while (player.xp >= player.level * 100) {
    player.xp -= player.level * 100;

    player.level++;

    player.rank = getRank(player.level);
  }

  savePlayer(player);
}

function getRank(level: number): string {
  if (level >= 50) return "Financial Legend";

  if (level >= 40) return "Wealth Architect";

  if (level >= 30) return "Financial Strategist";

  if (level >= 20) return "Wealth Builder";

  if (level >= 10) return "Investor";

  return "Financial Explorer";
}