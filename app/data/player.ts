export type Player = {
  xp: number;
  wealthScore: number;
  streak: number;
};

const STORAGE_KEY = "myfinance-player";

const DEFAULT_PLAYER: Player = {
  xp: 0,
  wealthScore: 0,
  streak: 1,
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

  return JSON.parse(saved);
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