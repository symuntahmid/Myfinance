import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-[var(--muted)]">
          Welcome to MyFinance.
        </p>
      </main>
    </div>
  );
}