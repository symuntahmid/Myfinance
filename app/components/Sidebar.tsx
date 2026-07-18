import NavItem from "./NavItem";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Settings,
} from "lucide-react";
export default function Sidebar() {
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
        <NavItem href="/dashboard" active>
  Dashboard
</NavItem>

<NavItem href="/money">
  My Money
</NavItem>

<NavItem href="/investments">
  My Investments
</NavItem>

<NavItem href="/reports">
  Reports
</NavItem>

<NavItem href="/settings">
  Settings
</NavItem>
      </nav>
    </aside>
  );
}