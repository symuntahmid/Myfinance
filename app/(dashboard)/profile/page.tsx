"use client";


import {
  useEffect,
  useState,
} from "react";


import Link from "next/link";


import ProfileCard from "@/app/components/ProfileCard";
import ProfileMoneyProgressCard from "@/app/components/profile/ProfileMoneyProgressCard";
import ProfileSavingCard from "@/app/components/profile/ProfileSavingCard";
import BadgesCard from "@/app/components/profile/BadgesCard";
import GlobalComparisonCard from "@/app/components/profile/GlobalComparisonCard";


import { t } from "@/app/data/i18n";





export default function ProfilePage() {



  const [, refresh] =
    useState(0);





  /*
    Re-render page
    after language change
  */

  useEffect(() => {



    const handleLanguageUpdate = () => {


      refresh(
        value => value + 1
      );


    };





    window.addEventListener(
      "languageUpdated",
      handleLanguageUpdate
    );





    return () => {


      window.removeEventListener(
        "languageUpdated",
        handleLanguageUpdate
      );


    };



  }, []);









  return (


    <div
      className="
        space-y-6
        pb-10
      "
    >







      {/* HEADER */}


      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >





        <div>



          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-[var(--foreground)]
            "
          >

            {t("myProfile")}

          </h1>






          <p
            className="
              mt-1
              text-sm
              text-[var(--muted)]
            "
          >

            {t("profileDescription")}

          </p>





        </div>









        <Link
          href="/profile/edit"
          className="
            mt-2
            shrink-0
            text-sm
            font-semibold
            text-[var(--primary)]
            transition
            hover:opacity-80
          "
        >

          {t("editProfile")}

        </Link>





      </div>












      {/* PROFILE + LEVEL */}


      <ProfileCard />












      {/* MONEY STREAK */}


      <ProfileMoneyProgressCard />












      {/* SAVING + BADGES */}


      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >


        <ProfileSavingCard />


        <BadgesCard />


      </div>












      {/* GLOBAL COMPARISON */}


      <GlobalComparisonCard />












      {/* DEVELOPER MODE */}


      <div
        className="
          pt-2
        "
      >




        <Link
          href="/profile/developer"
          className="
            text-xs
            font-medium
            text-[var(--muted)]
            transition
            hover:text-[var(--foreground)]
          "
        >

          {t("developerMode")}

        </Link>




      </div>







    </div>


  );


}