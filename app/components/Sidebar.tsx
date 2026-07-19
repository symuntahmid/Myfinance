"use client";
import NavItem from "./NavItem";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-72 h-screen bg-white border-r border-[var(--border)] px-6 py-8 shadow-sm">
      <div className="mb-12">
  <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary-dark)]">
    MyFinance
  </h1>

  <p className="mt-2 text-sm text-[var(--muted)]">
    Your Personal Wealth Hub
  </p>
</div>

      <nav className="space-y-2">
       <NavItem
  href="/dashboard"
  active={pathname === "/dashboard"}
  icon={<LayoutDashboard size={20} />}
>
  Dashboard
</NavItem>

<NavItem
  href="/money"
  active={pathname === "/money"}
  icon={<Wallet size={20} />}
>
  MyMoney 
</NavItem>

<NavItem
  href="/investments"
  active={pathname === "/investments"}
  icon={<LineChart size={20} />}
>
  My Investments
</NavItem>

<NavItem
  href="/reports"
  active={pathname === "/reports"}
  icon={<FileText size={20} />}
>
  Reports
</NavItem>

<NavItem
  href="/settings"
  active={pathname === "/settings"}
  icon={<Settings size={20} />}
>
  Settings
</NavItem>
      </nav>
    </aside>
  );
}