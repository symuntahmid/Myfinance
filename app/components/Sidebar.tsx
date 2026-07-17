export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-[var(--border)] p-6">
      <h1 className="text-2xl font-bold text-[var(--primary)]">
        MyFinance
      </h1>

      <nav className="mt-10 space-y-3">
        <button className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-teal-50">
          Dashboard
        </button>

        <button className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-teal-50">
          My Money
        </button>

        <button className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-teal-50">
          My Investments
        </button>

        <button className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-teal-50">
          Reports
        </button>

        <button className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-teal-50">
          Settings
        </button>
      </nav>
    </aside>
  );
}