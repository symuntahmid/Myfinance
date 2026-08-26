"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  type UserProfile,
} from "@/app/data/profile";

import {
  getLevel,
} from "@/app/data/player";

import {
  getJourneyProgress,
} from "@/app/data/dailyJourney";


export default function WelcomeBanner() {


  const [profile,setProfile] =
    useState<UserProfile>(
      getProfile()
    );


  const [level,setLevel] =
    useState(
      getLevel()
    );


  const [journey,setJourney] =
    useState(
      getJourneyProgress()
    );



  useEffect(()=>{


    const refresh = () => {


      setProfile(
        getProfile()
      );


      setLevel(
        getLevel()
      );


      setJourney(
        getJourneyProgress()
      );


    };



    refresh();



    window.addEventListener(
      "profileUpdated",
      refresh
    );


    window.addEventListener(
      "player-updated",
      refresh
    );


    window.addEventListener(
      "dailyJourneyUpdated",
      refresh
    );



    return()=>{


      window.removeEventListener(
        "profileUpdated",
        refresh
      );


      window.removeEventListener(
        "player-updated",
        refresh
      );


      window.removeEventListener(
        "dailyJourneyUpdated",
        refresh
      );


    };


  },[]);




  const journeyCompleted =
    journey.total > 0 &&
    journey.completed >= journey.total;



  let message =
    "Complete today's Daily Journey and earn +45 XP.";



  if(journeyCompleted){

    message =
      "🎉 Congratulations! You completed today's Daily Journey. Come back tomorrow for a new challenge.";

  }
  else if(
    level.nextLevelXP - level.currentXP <= 20
  ){

    message =
      `Only ${
        level.nextLevelXP -
        level.currentXP
      } XP until Level ${level.level + 1}!`;

  }



  const displayName =
    profile.displayName ||
    `${profile.firstName} ${profile.lastName}`.trim() ||
    profile.username ||
    "User";



  return (

<div className="mb-6 md:mb-8">


  {/* Greeting */}

  <h2
  className="
  font-display
  max-w-full
  truncate
  text-3xl
  font-medium
  tracking-tight
  text-[var(--foreground)]
  sm:text-4xl
  "
>
  Welcome back, {displayName} 👋
</h2>





  {/* Journey Message */}

  <div

    className={`
    mt-3
    max-w-2xl
    rounded-2xl
    border
    px-4
    py-3
    text-sm
    leading-relaxed
    transition-all

    ${
      journeyCompleted

      ?

      `
      border-emerald-400/40
      bg-emerald-500/10
      text-emerald-600
      dark:text-emerald-400
      shadow-sm
      `

      :

      `
      border-[var(--border)]
      bg-[var(--card)]
      text-[var(--muted)]
      shadow-sm
      `

    }

    `}

  >


    <div className="
    flex
    items-start
    gap-3
    ">


      {journeyCompleted && (

        <span
          className="
          mt-0.5
          text-lg
          "
        >
          🎉
        </span>

      )}



      <p className="
      font-medium
      "
      >

        {journeyCompleted

        ?

        "Congratulations! You completed today's Daily Journey. Come back tomorrow for a new challenge."

        :

        message

        }

      </p>



    </div>


  </div>



</div>

);

}