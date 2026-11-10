"use client";


import {
  useEffect,
  useState,
} from "react";


import Link from "next/link";


import { usePathname } from "next/navigation";


import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Ellipsis,
} from "lucide-react";


import { t } from "@/app/data/i18n";




export default function BottomNavigation() {



  const pathname =
    usePathname();



  const [, refresh] =
    useState(0);





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



    </nav>


  );


}