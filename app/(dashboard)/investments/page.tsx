import Sidebar from "../../components/Sidebar";

export default function InvestmentsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold">
          My Investments
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage all your investments in one place.
        </p>
      </main>
    </div>
  );
}