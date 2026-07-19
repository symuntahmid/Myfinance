import Sidebar from "../../components/Sidebar";

export default function MoneyPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold">My Money</h1>

        <p className="mt-2 text-[var(--muted)]">
          Track your income, expenses, and cash flow.
        </p>
      </main>
    </div>
  );
}