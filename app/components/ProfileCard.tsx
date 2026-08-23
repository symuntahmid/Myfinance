"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Rocket,
  User,
} from "lucide-react";

import {
  getPlayer,
  getLevel,
} from "@/app/data/player";

import {
  getProfile,
} from "@/app/data/profile";

import {
  useEffect,
  useState,
} from "react";


type Props = {
  compact?: boolean;
};



export default function ProfileCard({
  compact = false,
}: Props) {


  const [mounted,setMounted] =
    useState(false);


  const [avatarError,setAvatarError] =
    useState(false);



  const [player,setPlayer] =
    useState<
      ReturnType<typeof getPlayer> | null
    >(null);



  const [level,setLevel] =
    useState<
      ReturnType<typeof getLevel> | null
    >(null);



  const [profile,setProfile] =
    useState(
      getProfile()
    );



  useEffect(()=>{


    setMounted(true);



    const refreshPlayer = () => {

      setPlayer(
        getPlayer()
      );

      setLevel(
        getLevel()
      );

      setProfile(
        getProfile()
      );

    };



    refreshPlayer();



    window.addEventListener(
      "player-updated",
      refreshPlayer
    );


    window.addEventListener(
      "profileUpdated",
      refreshPlayer
    );



    return ()=>{


      window.removeEventListener(
        "player-updated",
        refreshPlayer
      );


      window.removeEventListener(
        "profileUpdated",
        refreshPlayer
      );


    };


  },[]);





  if(
    !mounted ||
    !player ||
    !level
  ){

    return (

      <section
        className="
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-sm
        "
      >

        <div className="
        mx-auto
        h-24
        w-24
        animate-pulse
        rounded-full
        bg-[var(--border)]
        " />


        <div className="
        mx-auto
        mt-5
        h-7
        w-32
        animate-pulse
        rounded-lg
        bg-[var(--border)]
        " />


        <div className="
        mx-auto
        mt-2
        h-4
        w-40
        animate-pulse
        rounded
        bg-[var(--border)]
        " />


        <div className="
        mx-auto
        mt-6
        h-8
        w-64
        animate-pulse
        rounded-full
        bg-[var(--border)]
        " />


        <div className="
        mt-8
        h-4
        animate-pulse
        rounded-full
        bg-[var(--border)]
        " />


        <div className="
        mt-3
        h-3
        animate-pulse
        rounded-full
        bg-[var(--border)]
        " />


      </section>

    );

  }




  const progress =
    Math.min(
      Math.max(level.percent,0),
      100
    );




  return (

    <section

      className={`
      relative
      overflow-hidden
      rounded-[30px]
      border
      border-[var(--border)]
      bg-gradient-to-br
      from-[var(--card)]
      via-[var(--background)]
      to-cyan-50
      shadow-sm
      ${
        compact
        ? "p-5"
        : "p-6 md:p-8"
      }
      `}

    >


      {!compact && (

        <>

          <div className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-cyan-200/30
          blur-3xl
          " />


          <div className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-48
          w-48
          rounded-full
          bg-teal-200/30
          blur-3xl
          " />

        </>

      )}






      <div
        className={`
        relative
        ${
          compact
          ? "flex items-center gap-4"
          : "flex flex-col items-center text-center"
        }
        `}
      >


        <div
          className={`
          relative
          shrink-0
          ${
            compact
            ? "h-16 w-16"
            : "h-28 w-28"
          }
          `}
        >


          <div
            className="
            relative
            h-full
            w-full
            overflow-hidden
            rounded-full
            border-4
            border-[var(--card)]
            bg-gradient-to-br
            from-cyan-100
            to-teal-100
            shadow-lg
            "
          >


            {!avatarError ? (

              <Image

                src="/images/quokka/quokka-profile.png"

                alt="Premium quokka profile"

                fill

                sizes={
                  compact
                  ? "64px"
                  : "112px"
                }

                className="object-cover"

                onError={()=>
                  setAvatarError(true)
                }

              />

            ) : (

              <div className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-teal-500
              to-cyan-500
              text-white
              ">

                <User
                  size={
                    compact
                    ? 28
                    : 42
                  }
                />

              </div>

            )}


          </div>




          <span

            className={`
            absolute
            bottom-1
            right-1
            rounded-full
            border-2
            border-[var(--card)]
            bg-emerald-500

            ${
              compact
              ? "h-4 w-4"
              : "h-5 w-5"
            }

            `}

          />



        </div>






        <div

          className={
            compact
            ? "min-w-0 flex-1"
            : "mt-5"
          }

        >



          <div
            className={`
            flex
            items-center
            ${
              compact
              ? "justify-start"
              : "justify-center"
            }
            gap-2
            `}
          >


            <h2

              className={`
              font-bold
              tracking-tight
              text-[var(--foreground)]
              ${
                compact
                ? "text-lg"
                : "text-3xl"
              }
              `}

            >

              {
                profile.displayName ||
                `${profile.firstName} ${profile.lastName}`.trim() ||
                player.name
              }


            </h2>



            <CheckCircle2

              size={
                compact
                ? 17
                : 21
              }

              className="
              fill-cyan-500
              text-white
              "

            />


          </div>





          {profile.username && (

            <p

              className={`
              text-[var(--muted)]
              ${
                compact
                ? "mt-0.5 text-[11px]"
                : "mt-1 text-xs"
              }
              `}

            >

              @{profile.username}

            </p>

          )}






          {!compact && (

            <div

              className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--card)]/80
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--foreground)]
              shadow-sm
              "

            >

              <span>
                Smarter money. Bigger dreams.
              </span>


              <Rocket
                size={15}
                className="text-cyan-500"
              />


            </div>

          )}


        </div>


      </div>






      <div

        className={`
        relative
        ${
          compact
          ? "mt-5"
          : "mt-7"
        }
        `}

      >


        <div className="
        mb-3
        flex
        items-center
        justify-between
        gap-3
        ">


          <div className="
          flex
          items-center
          gap-2
          ">

            <span className="text-lg">
              ⭐
            </span>


            <span className="
            font-bold
            text-[var(--foreground)]
            ">
              Level {level.level}
            </span>


          </div>



          <span className="
          rounded-full
          bg-[var(--primary)]/10
          px-3
          py-1.5
          text-xs
          font-bold
          text-[var(--primary)]
          ">

            {level.currentXP.toLocaleString()}
            {" / "}
            {level.nextLevelXP.toLocaleString()}
            {" XP"}

          </span>


        </div>




        <div className="
        h-3
        overflow-hidden
        rounded-full
        bg-[var(--border)]
        ">


          <div

            className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-violet-500
            via-cyan-500
            to-teal-400
            transition-all
            duration-700
            "

            style={{
              width:`${progress}%`,
            }}

          />


        </div>




        {!compact && (

          <div className="
          mt-2
          flex
          items-center
          justify-between
          text-[11px]
          text-[var(--muted)]
          ">

            <span>
              Financial journey
            </span>


            <span>
              {Math.round(progress)}% complete
            </span>


          </div>

        )}


      </div>


    </section>

  );

}