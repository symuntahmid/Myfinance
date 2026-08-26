"use client";

import {
  getPlayer,
  getLevel,
} from "@/app/data/player";

import {
  getJourneyProgress,
} from "@/app/data/dailyJourney";

export default function WelcomeBanner() {

  const player = getPlayer();
  const level = getLevel();

  const journey =
    getJourneyProgress();


  const journeyCompleted =
    journey.total > 0 &&
    journey.completed >= journey.total;



  let message =
    "Complete today's Daily Journey and earn +45 XP.";


  if (journeyCompleted) {

    message =
      "🎉 Congratulations! You completed today's Daily Journey. Come back tomorrow for a new challenge.";

  }
  else if (
    level.nextLevelXP - level.currentXP <= 20
  ) {

    message =
      `Only ${
        level.nextLevelXP - level.currentXP
      } XP until Level ${level.level + 1}!`;

  }



  return (

    <div className="mb-8">

      <h2 className="text-2xl font-bold">
        Welcome back, {player.name} 👋
      </h2>


      <div
        className={`
        mt-2
        rounded-xl
        px-4
        py-3
        text-sm
        ${
          journeyCompleted
          ?
          "border border-green-400 bg-green-50 text-green-700"
          :
          "text-slate-500"
        }
        `}
      >

        {message}

      </div>


    </div>

  );

}