"use client";

import { useEffect, useState } from "react";
import {
  Coins,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import { getMonthlyReport } from "@/app/data/transactions";


export default function ProfileSavingCard() {

  const [mounted, setMounted] =
    useState(false);

  const [report, setReport] =
    useState<ReturnType<typeof getMonthlyReport> | null>(
      null
    );


  useEffect(() => {

    setMounted(true);


    const refresh = () => {
      setReport(getMonthlyReport());
    };


    refresh();


    window.addEventListener(
      "transactionsUpdated",
      refresh
    );


    return () => {

      window.removeEventListener(
        "transactionsUpdated",
        refresh
      );

    };

  }, []);



  if (!mounted || !report) {

    return (
      <section className="
        h-64
        animate-pulse
        rounded-[28px]
        bg-[var(--card)]
      " />
    );

  }



  const saving =
    Math.max(report.netCashFlow, 0);


  const target = 125;


  const progress =
    target > 0
      ? Math.min((saving / target) * 100, 100)
      : 0;



  const formatMoney = (value:number) =>
    `$${value.toLocaleString(undefined,{
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    })}`;



  return (

    <section
      className="
      relative overflow-hidden
      rounded-[30px]
      bg-gradient-to-br
      from-emerald-400
      via-teal-400
      to-cyan-400
      p-7
      text-white
      shadow-xl
      "
    >


      <div
        className="
        absolute
        -right-10
        -top-10
        h-40
        w-40
        rounded-full
        bg-white/10
        blur-3xl
        "
      />



      <div className="relative z-10">


        <div>


          <div className="flex items-center gap-3">

            <Coins size={28}/>


            <p className="text-lg font-bold">
              This Month's Saving
            </p>


          </div>



          <p className="
            mt-4
            text-5xl
            font-black
            tracking-tight
          ">
            {formatMoney(saving)}
          </p>



          <div
            className="
            mt-3
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-white/20
            px-3
            py-1.5
            text-xs
            font-semibold
            "
          >

            <TrendingUp size={14}/>

            12% vs last month

          </div>


        </div>





        <div
          className="
          mt-6
          rounded-2xl
          bg-white/90
          p-4
          text-slate-700
          dark:bg-slate-900/90
          dark:text-slate-200
          "
        >


          <div className="flex items-center justify-between">


            <div
              className="
              h-3
              flex-1
              overflow-hidden
              rounded-full
              bg-slate-200
              dark:bg-slate-700
              "
            >

              <div
                className="
                h-full
                rounded-full
                bg-emerald-500
                transition-all
                duration-700
                "
                style={{
                  width:`${progress}%`,
                }}
              />

            </div>



            <span
              className="
              ml-4
              text-sm
              font-bold
              "
            >
              {progress.toFixed(0)}%
            </span>


          </div>




          <div
            className="
            mt-3
            flex
            items-center
            gap-2
            text-xs
            text-slate-500
            dark:text-slate-400
            "
          >

            <CalendarDays size={14}/>

            This month's savings progress

          </div>


        </div>



      </div>


    </section>

  );

}