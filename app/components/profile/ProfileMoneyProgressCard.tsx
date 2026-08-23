"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

import { getPlayer } from "@/app/data/player";

export default function ProfileMoneyProgressCard() {
  const [mounted, setMounted] = useState(false);

  const [player, setPlayer] =
    useState<ReturnType<typeof getPlayer> | null>(null);


  useEffect(() => {

    setMounted(true);

    const refresh = () => {
      setPlayer(getPlayer());
    };


    refresh();


    window.addEventListener(
      "player-updated",
      refresh
    );


    return () => {
      window.removeEventListener(
        "player-updated",
        refresh
      );
    };

  }, []);



  if (!mounted || !player) {
    return (
      <section className="h-64 animate-pulse rounded-[28px] bg-slate-100" />
    );
  }



  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];


  const completedDays =
    Math.min(
      Math.max(player.streak, 0),
      7
    );



  return (

    <section
      className="
      relative overflow-hidden
      rounded-[30px]
      bg-gradient-to-r
      from-orange-500
      via-orange-400
      to-amber-400
      p-6
      text-white
      shadow-xl
      "
    >


      {/* Glow */}

      <div
        className="
        absolute
        -right-20
        -top-20
        h-56
        w-56
        rounded-full
        bg-white/10
        blur-3xl
        "
      />


      <div className="relative z-10">


        <div className="flex items-start">


          <div>


            <div className="flex items-center gap-3">


              <Flame
                size={34}
                className="text-yellow-200"
              />


              <div>

                <p className="text-4xl font-black tracking-tight">
                  {player.streak} Days
                </p>


                <p className="mt-1 text-lg font-semibold">
                  Money Streak
                </p>

              </div>


            </div>



            <p className="mt-3 text-sm text-white/85">
              Keep your financial momentum alive. 🔥
            </p>


          </div>


        </div>





        <div className="mt-7 flex max-w-xl items-start justify-between">


          {days.map((day,index)=>{

            const completed =
              index < completedDays;


            return (

              <div
                key={day}
                className="flex flex-col items-center gap-2"
              >

                <div
                  className={`
                  flex h-11 w-11
                  items-center justify-center
                  rounded-full
                  border-2
                  ${
                    completed
                    ?
                    "border-white bg-white text-emerald-500 shadow-lg"
                    :
                    "border-white/50 bg-white/10 text-white/50"
                  }
                  `}
                >

                  {completed ? "✓" : ""}

                </div>


                <span className="text-xs font-medium text-white/90">
                  {day}
                </span>


              </div>

            );

          })}


        </div>


      </div>


    </section>

  );
}