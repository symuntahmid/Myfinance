import Sidebar from "../../components/Sidebar";

export default function Reports() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold">Reports</h1>

        <p className="mt-2 text-[var(--muted)]">
          Monthly portfolio reports will appear here.
        </p>
      </main>
    </div>
  );
}