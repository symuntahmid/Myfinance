"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  LineChart,
  FileText,
  Ellipsis,
} from "lucide-react";

const items = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Academy",
    href: "/academy",
    icon: GraduationCap,
  },
  {
    name: "Money",
    href: "/money",
    icon: Wallet,
  },
  {
    name: "Invest",
    href: "/investments",
    icon: LineChart,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "More",
    href: "/profile",
    icon: Ellipsis,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-40
        border-t
        border-slate-200
        bg-white/95
        backdrop-blur-xl
        shadow-[0_-10px_30px_rgba(0,0,0,.08)]
        lg:hidden
      "
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-6 h-20">

        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
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
                className={`rounded-2xl p-2 transition-all duration-200 ${
                  active
                    ? "bg-teal-100 text-teal-600"
                    : "text-slate-500"
                }`}
              >
                <Icon size={22} />
              </div>

              <span
                className={`text-[11px] font-medium ${
                  active
                    ? "text-teal-600"
                    : "text-slate-500"
                }`}
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