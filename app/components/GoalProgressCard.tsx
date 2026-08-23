"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getGoals,
  Goal,
} from "@/app/data/goals";


export default function GoalProgressCard() {


  const [goals,setGoals] =
    useState<Goal[]>([]);



  useEffect(()=>{


    function refreshGoals(){

      setGoals(
        getGoals()
      );

    }



    refreshGoals();



    window.addEventListener(
      "goalsUpdated",
      refreshGoals
    );



    return () =>
      window.removeEventListener(
        "goalsUpdated",
        refreshGoals
      );


  },[]);





  const totalSaved =
    goals.reduce(
      (sum,goal)=>
        sum + goal.savedAmount,
      0
    );



  const totalTarget =
    goals.reduce(
      (sum,goal)=>
        sum + goal.targetAmount,
      0
    );



  const progress =
    totalTarget === 0
      ? 0
      : (totalSaved / totalTarget) * 100;





  return (

    <Link href="/goals">

      <div
        className="
        cursor-pointer
        rounded-3xl
        bg-[var(--card)]
        border
        border-[var(--border)]
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-xl
        "
      >



        <div className="
        flex
        items-center
        justify-between
        ">



          <div>


            <p className="
            text-sm
            font-medium
            text-[var(--muted)]
            ">
              Financial Goals
            </p>



            <h2 className="
            mt-2
            text-2xl
            font-bold
            text-[var(--foreground)]
            ">

              {
                goals.length === 0
                ? "No Goals Yet"
                : `${goals.length} Goal${
                    goals.length > 1
                    ? "s"
                    : ""
                  }`
              }

            </h2>




            <p className="
            mt-2
            text-sm
            text-[var(--muted)]
            ">

              {
                goals.length === 0
                ? "Create your first savings goal."
                : `$${totalSaved.toLocaleString()} saved of $${totalTarget.toLocaleString()}`
              }

            </p>


          </div>





          <div className="
          rounded-2xl
          bg-[var(--primary)]/10
          p-4
          ">

            <Target
              className="
              h-8
              w-8
              text-[var(--primary)]
              "
            />

          </div>



        </div>






        <div className="mt-6">



          <div className="
          mb-2
          flex
          justify-between
          text-sm
          ">


            <span className="
            text-[var(--muted)]
            ">
              Overall Progress
            </span>



            <span className="
            font-semibold
            text-[var(--primary)]
            ">

              {progress.toFixed(0)}%

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
              from-cyan-500
              to-blue-600
              transition-all
              duration-700
              "

              style={{
                width:`${Math.min(progress,100)}%`,
              }}

            />


          </div>



        </div>



      </div>


    </Link>

  );

}