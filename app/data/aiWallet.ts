export type AIWallet = {
  credits: number;
  adsWatchedTotal: number;
};


const STORAGE_KEY = "myfinance-ai-wallet";


const INSIGHT_COST = 10;
const AD_REWARD = 5;

const ADS_REQUIRED_FOR_UNLOCK = 2;



/*
  SESSION ONLY

  This resets when browser/app reloads.
  Never saved in localStorage.
*/
let sessionUnlocked = false;



const DEFAULT_WALLET: AIWallet = {

  credits: 0,

  adsWatchedTotal: 0,

};





/* ==========================================
   GET WALLET
========================================== */

export function getAIWallet(): AIWallet {


  if(typeof window === "undefined"){

    return DEFAULT_WALLET;

  }



  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );



  if(!saved){


    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(DEFAULT_WALLET)

    );


    return {
      ...DEFAULT_WALLET
    };

  }



  try {


    const wallet =
      JSON.parse(saved);



    return {

      credits:
        Number(wallet.credits) || 0,


      adsWatchedTotal:
        Number(wallet.adsWatchedTotal) || 0,

    };


  } catch {


    return {
      ...DEFAULT_WALLET
    };

  }

}







/* ==========================================
   SAVE WALLET
========================================== */

function saveAIWallet(
  wallet: AIWallet
){

  if(typeof window === "undefined"){

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
   WATCH REWARD AD
========================================== */


export function rewardAIAd(): boolean {


  const wallet =
    getAIWallet();



  wallet.credits += AD_REWARD;


  wallet.adsWatchedTotal += 1;



  saveAIWallet(wallet);



  return true;

}







/* ==========================================
   ADS STATUS
========================================== */


export function getAdsCompletedForUnlock(){


  const wallet =
    getAIWallet();



  return (

    wallet.adsWatchedTotal %

    ADS_REQUIRED_FOR_UNLOCK

  );

}






export function getAdsRemainingForUnlock(){


  return Math.max(

    ADS_REQUIRED_FOR_UNLOCK -

    getAdsCompletedForUnlock(),

    0

  );

}








/* ==========================================
   ENERGY CHECK
========================================== */


export function canUnlockAIInsight(){


  const wallet =
    getAIWallet();



  return (

    wallet.credits >= INSIGHT_COST

  );

}








/* ==========================================
   UNLOCK INSIGHTS
========================================== */


export function unlockAIInsights(): boolean {


  const wallet =
    getAIWallet();



  /*
    MUST HAVE 10 ENERGY
  */

  if(
    wallet.credits < INSIGHT_COST
  ){

    return false;

  }



  wallet.credits -= INSIGHT_COST;



  /*
    ONLY CURRENT SESSION
  */

  sessionUnlocked = true;



  saveAIWallet(wallet);



  return true;

}








/* ==========================================
   SESSION CHECK
========================================== */


export function hasUnlockedInsights(){


  return sessionUnlocked;

}







/* ==========================================
   WALLET INFO
========================================== */


export function getAIWalletInfo(){


  const wallet =
    getAIWallet();



  return {


    credits:
      wallet.credits,


    adsWatchedTotal:
      wallet.adsWatchedTotal,


    sessionUnlocked,


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

        INSIGHT_COST -

        wallet.credits,

        0

      ),

  };

}








/* ==========================================
   RESET
========================================== */


export function resetAIWallet(){


  if(typeof window === "undefined"){

    return;

  }



  localStorage.removeItem(

    STORAGE_KEY

  );



  sessionUnlocked = false;



  window.dispatchEvent(

    new Event(
      "aiWalletUpdated"
    )

  );

}