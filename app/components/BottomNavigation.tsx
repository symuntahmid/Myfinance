"use client";


import {
  useEffect,
  useState,
} from "react";


import Link from "next/link";

import { createPortal } from "react-dom";


import { usePathname } from "next/navigation";


import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Ellipsis,
  User,
  Target,
  Landmark,
  ClipboardList,
  Receipt,
  Scale,
  Waypoints,
  Zap,
  Settings,
  X,
} from "lucide-react";


import { t } from "@/app/data/i18n";




export default function BottomNavigation() {



  const pathname =
    usePathname();



  const [, refresh] =
    useState(0);

  const [moreOpen, setMoreOpen] =
    useState(false);





  /*
    Refresh navigation labels
    when language changes
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







  const moreItems = [
    { href: "/profile", name: t("profile"), icon: User },
    { href: "/goals", name: t("goalsTitle"), icon: Target },
    { href: "/accounts", name: t("accountsTitle"), icon: Landmark },
    { href: "/plan", name: t("planTitle"), icon: ClipboardList },
    { href: "/bills", name: t("billsTitle"), icon: Receipt },
    { href: "/cash-flow", name: t("cfTitle"), icon: Waypoints },
    { href: "/net-worth", name: t("netWorthTitle"), icon: Scale },
    { href: "/sms-setup", name: t("smsAutoTitle"), icon: Zap },
    { href: "/settings", name: t("settings"), icon: Settings },
  ];

  const items = [


    {
      key: "dashboard",
      name: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },



    {
      key: "myMoney",
      name: t("myMoney"),
      href: "/money",
      icon: Wallet,
    },



    {
      key: "investments",
      name: t("investments"),
      href: "/investments",
      icon: LineChart,
    },



    {
      key: "reports",
      name: t("reports"),
      href: "/reports",
      icon: FileText,
    },



    {
      key: "more",
      name: t("more"),
      href: "/profile",
      icon: Ellipsis,
    },


  ];







  return (


    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-40
        border-t
        border-[var(--border)]
        bg-[var(--card)]
        backdrop-blur-xl
        shadow-[0_-10px-30px_rgba(0,0,0,.08)]
        lg:hidden
      "
      style={{
        paddingBottom:
          "env(safe-area-inset-bottom)",
      }}
    >





      <div
        className="
          grid
          grid-cols-5
          h-20
        "
      >





        {items.map((item) => {


          const Icon =
            item.icon;



          const active =
            pathname === item.href ||
            pathname.startsWith(
              item.href + "/"
            );



          const iconClass =
            active
              ? "bg-[var(--primary)]/15 text-[var(--primary)]"
              : "text-[var(--muted)]";



          const textClass =
            active
              ? "text-[var(--primary)]"
              : "text-[var(--muted)]";






          if (item.key === "more") {
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center justify-center gap-1 transition-all duration-200"
              >
                <div
                  className={`rounded-2xl p-2 transition-all duration-200 ${
                    moreOpen || active
                      ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`text-[11px] font-medium ${textClass}`}
                >
                  {item.name}
                </span>
              </button>
            );
          }

          return (


            <Link
              key={item.key}
              href={item.href}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                transition-all
                duration-200
              "
            >




              <div
                className={`
                  rounded-2xl
                  p-2
                  transition-all
                  duration-200
                  ${iconClass}
                `}
              >

                <Icon size={22}/>

              </div>







              <span
                className={`
                  text-[11px]
                  font-medium
                  ${textClass}
                `}
              >

                {item.name}

              </span>




            </Link>


          );


        })}



      </div>



    
      {moreOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              aria-label="close"
              onClick={() => setMoreOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-[32px] bg-[var(--card)] p-5 pb-8 shadow-2xl"
              style={{
                paddingBottom:
                  "calc(env(safe-area-inset-bottom) + 1.5rem)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {t("more")}
                </p>

                <button
                  type="button"
                  aria-label="close"
                  onClick={() => setMoreOpen(false)}
                  className="rounded-full p-2 text-[var(--muted)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {moreItems.map((entry) => {
                  const EntryIcon = entry.icon;

                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-black/5 p-3 text-center"
                    >
                      <EntryIcon
                        size={22}
                        className="text-[var(--primary)]"
                      />

                      <span className="text-[11px] font-medium leading-tight text-[var(--foreground)]">
                        {entry.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}

    </nav>


  );


}