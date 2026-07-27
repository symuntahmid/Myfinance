import Sidebar from "../components/Sidebar";
import BottomNavigation from "@/app/components/BottomNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-8 pb-24 lg:pb-8">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}