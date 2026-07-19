import Sidebar from "../../components/Sidebar";

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold">Settings</h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage your account and application preferences.
        </p>
      </main>
    </div>
  );
}