"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Trophy,
  Lock,
} from "lucide-react";

import { badges } from "@/app/data/badges";
import { getPlayer } from "@/app/data/player";


function BadgesCard() {

  const player = getPlayer();


  const unlockedBadges = badges.filter((badge) => {

    if (badge.category === "Points") {
      return player.xp >= badge.target;
    }

    return false;

  });



  const visibleBadges =
    unlockedBadges.slice(0, 3);



  return (

    <section
      className="
      rounded-3xl
      border border-[var(--border)]
      bg-[var(--card)]
      p-5
      shadow-sm
      "
    >


      <div className="flex items-center justify-between">


        <h2 className="
          text-sm
          font-semibold
          text-[var(--foreground)]
        ">
          Your Badges
        </h2>



        <Link
          href="/profile/badges"
          className="
          flex
          items-center
          gap-1
          text-xs
          font-medium
          text-[var(--muted)]
          transition
          hover:text-[var(--foreground)]
          "
        >

          Show more

          <ArrowUpRight size={13}/>

        </Link>


      </div>





      <div className="mt-5 grid grid-cols-3 gap-3">


        {visibleBadges.length > 0 ? (

          visibleBadges.map((badge)=>(

            <div
              key={badge.id}
              className="text-center"
            >

              <div
                className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[var(--background)]
                text-4xl
                shadow-sm
                "
              >
                {badge.icon}
              </div>



              <p className="
                mt-2
                text-xs
                font-semibold
                text-[var(--foreground)]
              ">
                {badge.name}
              </p>



              <p className="
                mt-1
                text-[10px]
                text-purple-400
              ">
                {badge.requirement}
              </p>


            </div>

          ))

        ) : (


          <div className="
            col-span-3
            flex
            flex-col
            items-center
            justify-center
            py-5
            text-center
          ">


            <div
              className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[var(--background)]
              text-slate-400
              "
            >

              <Lock size={25}/>

            </div>



            <p className="
              mt-3
              text-sm
              font-semibold
              text-[var(--foreground)]
            ">
              No badges unlocked yet
            </p>



            <p className="
              mt-1
              max-w-xs
              text-xs
              text-[var(--muted)]
            ">
              Keep learning and improving your money habits
              to unlock your first badge.
            </p>


          </div>


        )}


      </div>






      <div
        className="
        mt-5
        flex
        items-center
        gap-4
        rounded-2xl
        bg-gradient-to-r
        from-yellow-50
        to-orange-50
        p-4
        dark:from-yellow-950/30
        dark:to-orange-950/30
        "
      >


        <div
          className="
          flex
          h-16
          w-16
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-white
          text-yellow-500
          shadow-sm
          dark:bg-slate-800
          "
        >

          <Trophy size={32}/>

        </div>



        <div className="min-w-0 flex-1">


          <div className="
            flex
            items-center
            justify-between
            gap-3
          ">


            <h3 className="
              text-sm
              font-bold
              text-[var(--foreground)]
            ">
              Badge Progress
            </h3>



            <span className="
              text-xs
              font-semibold
              text-[var(--muted)]
            ">
              {unlockedBadges.length}/{badges.length}
            </span>


          </div>




          <p className="
            mt-1
            text-sm
            font-semibold
            text-[var(--foreground)]
          ">

            {unlockedBadges.length === 0
              ? "Your journey starts here."
              : `${unlockedBadges.length} badge${
                  unlockedBadges.length === 1 ? "" : "s"
                } unlocked`
            }

          </p>



          <p className="
            mt-1
            text-[10px]
            text-[var(--muted)]
          ">
            Continue your financial journey to unlock more.
          </p>



        </div>


      </div>


    </section>

  );

}


export { BadgesCard };

export default BadgesCard;