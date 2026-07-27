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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white lg:hidden">

      <div className="grid grid-cols-6">

        {items.map((item) => {

          const Icon = item.icon;

          const active =
            pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 transition-all duration-200 ${
  active
    ? "text-teal-600"
    : "text-slate-500 hover:text-slate-700"
}`}
            >
              <div
  className={`rounded-2xl p-2 transition-all ${
    active
      ? "bg-teal-100"
      : ""
  }`}
>
  <Icon size={22} />
</div>

              <span className="mt-1 text-[11px] font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>

    </nav>
  );
}