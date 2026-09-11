"use client";


import {
  useEffect,
  useState,
} from "react";


import NavItem from "./NavItem";


import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Settings,
  User,
} from "lucide-react";


import { usePathname } from "next/navigation";


import { t } from "@/app/data/i18n";



export default function Sidebar() {


  const pathname =
    usePathname();



  const [, refresh] =
    useState(0);



  /*
    Update sidebar text
    after changing language
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

    <aside
      className="
        hidden
        lg:flex
        lg:w-72
        lg:h-screen
        lg:flex-col
        bg-[var(--card)]
        border-r
        border-[var(--border)]
        px-6
        py-8
        shadow-sm
      "
    >



      <div className="mb-12">


        <h1
          className="
            text-3xl
            font-extrabold
            tracking-tight
            text-[var(--primary-dark)]
          "
        >
          MyFinance
        </h1>



        <p
          className="
            mt-2
            text-sm
            text-[var(--muted)]
          "
        >
          {t("wealthHub")}
        </p>


      </div>






      <nav className="space-y-2">



        <NavItem
          href="/dashboard"
          active={
            pathname === "/dashboard"
          }
          icon={
            <LayoutDashboard size={20} />
          }
        >
          {t("dashboard")}
        </NavItem>





        <NavItem
          href="/profile"
          active={
            pathname === "/profile"
          }
          icon={
            <User size={20} />
          }
        >
          {t("profile")}
        </NavItem>





        <NavItem
          href="/money"
          active={
            pathname === "/money"
          }
          icon={
            <Wallet size={20} />
          }
        >
          {t("myMoney")}
        </NavItem>





        <NavItem
          href="/investments"
          active={
            pathname === "/investments"
          }
          icon={
            <LineChart size={20} />
          }
        >
          {t("investments")}
        </NavItem>





        <NavItem
          href="/reports"
          active={
            pathname === "/reports"
          }
          icon={
            <FileText size={20} />
          }
        >
          {t("reports")}
        </NavItem>





        <NavItem
          href="/settings"
          active={
            pathname === "/settings"
          }
          icon={
            <Settings size={20} />
          }
        >
          {t("settings")}
        </NavItem>



      </nav>



    </aside>

  );

}