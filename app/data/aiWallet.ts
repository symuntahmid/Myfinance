export type AIWallet = {
  credits: number;
  adsWatchedTotal: number;
  insightsUnlocked: number;
};


const STORAGE_KEY = "myfinance-ai-wallet";


const INSIGHT_COST = 10;
const AD_REWARD = 5;

const ADS_REQUIRED_FOR_UNLOCK = 2;

const ADDITIONAL_INSIGHTS_UNLOCK_COUNT = 3;



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



  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );



  if (!saved) {


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_WALLET)
    );


    return DEFAULT_WALLET;

  }




  try {


    const wallet =
      JSON.parse(saved) as AIWallet;



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

function saveAIWallet(
  wallet: AIWallet
) {


  if (typeof window === "undefined") {

    return;

  }



  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(wallet)

  );



  window.dispatchEvent(

    new Event(
      "aiWalletUpdated"
    )

  );

}





/* ==========================================
   REWARD AD
========================================== */

/*
  1 Reward Ad = +5 Energy

  2 Reward Ads = +10 Energy
*/

export function rewardAIAd(): boolean {


  const wallet =
    getAIWallet();



  wallet.credits += AD_REWARD;


  wallet.adsWatchedTotal += 1;



  saveAIWallet(wallet);



  return true;

}





/* ==========================================
   ADS PROGRESS
========================================== */


export function getAdsCompletedForUnlock(): number {


  const wallet =
    getAIWallet();



  return (

    wallet.adsWatchedTotal %

    ADS_REQUIRED_FOR_UNLOCK

  );

}





export function getAdsRemainingForUnlock(): number {


  const completed =
    getAdsCompletedForUnlock();



  return Math.max(

    ADS_REQUIRED_FOR_UNLOCK - completed,

    0

  );

}





/* ==========================================
   ENERGY CHECK
========================================== */


export function canUnlockAIInsight(): boolean {


  const wallet =
    getAIWallet();



  return (

    wallet.credits >= INSIGHT_COST

  );

}





/* ==========================================
   UNLOCK 3 MORE INSIGHTS
========================================== */


export function unlockAIInsights(): boolean {


  const wallet =
    getAIWallet();



  if (

    wallet.credits < INSIGHT_COST

  ) {

    return false;

  }




  wallet.credits -= INSIGHT_COST;



  wallet.insightsUnlocked =
    ADDITIONAL_INSIGHTS_UNLOCK_COUNT;



  saveAIWallet(wallet);



  return true;

}





/* ==========================================
   CHECK IF EXTRA INSIGHTS UNLOCKED
========================================== */


export function hasUnlockedInsights(): boolean {


  const wallet =
    getAIWallet();



  return (

    wallet.insightsUnlocked >=
    ADDITIONAL_INSIGHTS_UNLOCK_COUNT

  );

}





/* ==========================================
   WALLET INFO
========================================== */


export function getAIWalletInfo() {


  const wallet =
    getAIWallet();



  return {


    credits:

      wallet.credits,



    adsWatchedTotal:

      wallet.adsWatchedTotal,



    insightsUnlocked:

      wallet.insightsUnlocked,



    insightCost:

      INSIGHT_COST,



    adReward:

      AD_REWARD,



    adsRequired:

      ADS_REQUIRED_FOR_UNLOCK,



    adsCompleted:

      getAdsCompletedForUnlock(),



    adsRemaining:

      getAdsRemainingForUnlock(),



    creditsNeeded:

      Math.max(

        INSIGHT_COST - wallet.credits,

        0

      ),


  };

}





/* ==========================================
   RESET
========================================== */


export function resetAIWallet() {


  if (typeof window === "undefined") {

    return;

  }



  localStorage.removeItem(

    STORAGE_KEY

  );



  window.dispatchEvent(

    new Event(
      "aiWalletUpdated"
    )

  );

}