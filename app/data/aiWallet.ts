export type AIWallet = {
  credits: number;
  adsWatchedTotal: number;
  insightsUnlocked: number;
};

const STORAGE_KEY = "myfinance-ai-wallet";

const INSIGHT_COST = 10;
const AD_REWARD = 5;

/* ==========================================
   DEFAULT WALLET
========================================== */

const DEFAULT_WALLET: AIWallet = {
  credits: 0,
  adsWatchedTotal: 0,
  insightsUnlocked: 0,
};

/* ==========================================
   GET WALLET
========================================== */

export function getAIWallet(): AIWallet {
  if (typeof window === "undefined") {
    return DEFAULT_WALLET;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_WALLET)
    );

    return DEFAULT_WALLET;
  }

  try {
    const wallet = JSON.parse(saved) as AIWallet;

    return {
      ...DEFAULT_WALLET,
      ...wallet,
    };
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_WALLET)
    );

    return DEFAULT_WALLET;
  }
}

/* ==========================================
   SAVE WALLET
========================================== */

function saveAIWallet(wallet: AIWallet) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(wallet)
  );

  window.dispatchEvent(
    new Event("aiWalletUpdated")
  );
}

/* ==========================================
   ADD AD REWARD
========================================== */

export function rewardAIAd(): boolean {
  const wallet = getAIWallet();

  wallet.credits += AD_REWARD;
  wallet.adsWatchedTotal += 1;

  saveAIWallet(wallet);

  return true;
}

/* ==========================================
   CHECK INSIGHT ACCESS
========================================== */

export function canUnlockAIInsight(): boolean {
  const wallet = getAIWallet();

  return wallet.credits >= INSIGHT_COST;
}

/* ==========================================
   SPEND INSIGHT CREDITS
========================================== */

export function unlockAIInsight(): boolean {
  const wallet = getAIWallet();

  if (wallet.credits < INSIGHT_COST) {
    return false;
  }

  wallet.credits -= INSIGHT_COST;
  wallet.insightsUnlocked += 1;

  saveAIWallet(wallet);

  return true;
}

/* ==========================================
   WALLET INFO
========================================== */

export function getAIWalletInfo() {
  const wallet = getAIWallet();

  return {
    credits: wallet.credits,

    adsWatchedTotal:
      wallet.adsWatchedTotal,

    insightsUnlocked:
      wallet.insightsUnlocked,

    insightCost: INSIGHT_COST,

    adReward: AD_REWARD,

    creditsNeeded:
      Math.max(
        INSIGHT_COST - wallet.credits,
        0
      ),
  };
}

/* ==========================================
   DEVELOPMENT RESET
========================================== */

export function resetAIWallet() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new Event("aiWalletUpdated")
  );
}