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
  Landmark,
  Receipt,
  ClipboardList,
  Target,
  Moon,
  Users,
  Hourglass,
  Sparkles,
  Flag,
  Waypoints,
  Scale,
  Lightbulb,
  Zap,
} from "lucide-react";


import { usePathname } from "next/navigation";


import { t } from "@/app/data/i18n";



export default function Sidebar() {


  const pathname =
    usePathname();



const [, setRefresh] =
  useState(0);


  /*
    Update sidebar text
    after changing language
  */

  useEffect(() => {


    const handleLanguageUpdate = () => {

setRefresh(
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





  const groups = [
    {
      title: t("aheadTitle"),
      items: [
        { href: "/plan", name: t("planTitle"), icon: ClipboardList },
        { href: "/goals", name: t("goalsTitle"), icon: Target },
        { href: "/occasions", name: t("occMenu"), icon: Moon },
        { href: "/somiti", name: t("somMenu"), icon: Users },
        { href: "/time-machine", name: t("tmMenu"), icon: Hourglass },
        { href: "/freedom", name: t("fpTitle"), icon: Flag },
      ],
    },
    {
      title: t("moreGroupMoney"),
      items: [
        { href: "/accounts", name: t("accountsTitle"), icon: Landmark },
        { href: "/bills", name: t("billsTitle"), icon: Receipt },
        { href: "/net-worth", name: t("netWorthTitle"), icon: Scale },
        { href: "/cash-flow", name: t("cfTitle"), icon: Waypoints },
      ],
    },
    {
      title: t("moreGroupInsights"),
      items: [
        { href: "/coach", name: t("coachMenu"), icon: Sparkles },
        { href: "/insights", name: t("insTitle"), icon: Lightbulb },
      ],
    },
    {
      title: t("moreGroupYou"),
      items: [
        { href: "/profile", name: t("profile"), icon: User },
        { href: "/sms-setup", name: t("smsAutoTitle"), icon: Zap },
        { href: "/settings", name: t("settings"), icon: Settings },
      ],
    },
  ];

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
        overflow-hidden
      "
    >



      <div className="mb-8">


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






      <nav className="-mr-3 flex-1 space-y-5 overflow-y-auto pr-3">

        <div className="space-y-1">
          <NavItem href="/dashboard" active={pathname === "/dashboard"} icon={<LayoutDashboard size={20} />}>
            {t("dashboard")}
          </NavItem>
          <NavItem href="/money" active={pathname === "/money"} icon={<Wallet size={20} />}>
            {t("myMoney")}
          </NavItem>
          <NavItem href="/investments" active={pathname === "/investments"} icon={<LineChart size={20} />}>
            {t("investments")}
          </NavItem>
          <NavItem href="/reports" active={pathname === "/reports"} icon={<FileText size={20} />}>
            {t("reports")}
          </NavItem>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-1 px-4 text-xs font-semibold text-[var(--muted)]">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    icon={<Icon size={20} />}
                  >
                    {item.name}
                  </NavItem>
                );
              })}
            </div>
          </div>
        ))}

      </nav>



    </aside>

  );

}