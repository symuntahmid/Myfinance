"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { badges } from "@/app/data/badges";


export default function BadgesPage() {

  const categories = [
    "Points",
    "Saving",
    "Investment",
    "Psychology",
    "Premium",
  ];


  return (

    <div className="mx-auto max-w-4xl pb-10">


      {/* HEADER */}

      <div className="mb-8 flex items-start gap-3">

        <Link
          href="/profile"
          className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-600
          shadow-sm
          transition
          hover:bg-slate-50
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-300
          dark:hover:bg-slate-800
          "
        >
          <ArrowLeft size={18}/>
        </Link>


        <div>

          <h1
            className="
            text-3xl
            font-bold
            tracking-tight
            text-slate-950
            dark:text-white
            "
          >
            Badges
          </h1>


          <p
            className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
            "
          >
            Your financial achievements, habits, and milestones.
          </p>


        </div>

      </div>





      {/* SUMMARY */}


      <div className="mb-8 grid gap-4 sm:grid-cols-3">


        <div
          className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          "
        >

          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Total Badges
          </p>


          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {badges.length}
          </p>


        </div>




        <div
          className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          "
        >

          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Unlocked
          </p>


          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            0
          </p>


        </div>




        <div
          className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          "
        >

          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Premium
          </p>


          <p className="mt-2 text-2xl font-bold text-violet-600 dark:text-violet-400">
            {
              badges.filter(
                badge=>badge.premium
              ).length
            }
          </p>


        </div>


      </div>





      {/* CATEGORY BUTTONS */}


      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">


        {
          categories.map(category=>(

            <button
              key={category}
              type="button"
              className="
              shrink-0
              rounded-full
              border border-slate-200
              bg-white
              px-4
              py-2
              text-xs
              font-semibold
              text-slate-600
              transition
              hover:border-cyan-200
              hover:bg-cyan-50
              hover:text-cyan-700
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-cyan-950/30
              "
            >
              {category}
            </button>

          ))
        }


      </div>





      {/* BADGES */}


      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


        {
          badges.map((badge)=>(


            <div
              key={badge.id}
              className={`
              relative
              overflow-hidden
              rounded-3xl
              border
              p-5
              shadow-sm
              transition

              ${
                badge.premium
                ?
                `
                border-violet-200
                bg-gradient-to-br
                from-white
                via-violet-50/40
                to-fuchsia-50/40

                dark:border-violet-800
                dark:from-slate-900
                dark:via-violet-950/30
                dark:to-fuchsia-950/30
                `
                :
                `
                border-slate-200
                bg-white

                dark:border-slate-700
                dark:bg-slate-900
                `
              }
              `}
            >



              {
                badge.premium && (

                  <div
                    className="
                    absolute
                    right-4
                    top-4
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-violet-100
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-violet-700

                    dark:bg-violet-950/50
                    dark:text-violet-300
                    "
                  >

                    <Sparkles size={11}/>

                    PREMIUM

                  </div>

                )
              }




              {/* ICON */}

              <div
                className={`
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                text-3xl

                ${
                  badge.premium
                  ?
                  "bg-violet-100 dark:bg-violet-950/50"
                  :
                  "bg-slate-100 dark:bg-slate-800"
                }
                `}
              >
                {badge.icon}
              </div>





              <h2
                className="
                mt-5
                text-base
                font-bold
                text-slate-950
                dark:text-white
                "
              >
                {badge.name}
              </h2>




              <p
                className="
                mt-1
                text-xs
                leading-relaxed
                text-slate-500
                dark:text-slate-400
                "
              >
                {badge.description}
              </p>





              {/* REQUIREMENT */}


              <div
                className="
                mt-5
                rounded-2xl
                bg-slate-50
                p-3

                dark:bg-slate-800
                "
              >

                <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
                dark:text-slate-500
                ">
                  Requirement
                </p>


                <p
                  className="
                  mt-1
                  text-xs
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                  "
                >
                  {badge.requirement}
                </p>


              </div>





              {/* STATUS */}


              <div className="mt-4 flex items-center gap-2">


                {
                  badge.premium
                  ?

                  <>

                    <Lock
                      size={15}
                      className="text-violet-500"
                    />

                    <span className="
                    text-xs
                    font-semibold
                    text-violet-600
                    dark:text-violet-400
                    ">
                      Premium badge
                    </span>

                  </>

                  :

                  <>

                    <CheckCircle2
                      size={15}
                      className="text-slate-300 dark:text-slate-600"
                    />

                    <span className="
                    text-xs
                    font-semibold
                    text-slate-400
                    dark:text-slate-500
                    ">
                      Locked
                    </span>

                  </>

                }


              </div>



            </div>


          ))
        }


      </div>


    </div>

  );

}