import StatCard from "../../components/StatCard";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-[var(--muted)]">
        Welcome to MyFinance.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-10">
        <StatCard
          title="Net Worth"
          value="$0"
          icon={<div className="bg-blue-100 text-blue-600 p-2 rounded-full">💰</div>}
        />

        <StatCard
          title="Monthly Income"
          value="$0"
          icon={<div className="bg-green-100 text-green-600 p-2 rounded-full">📈</div>}
        />

        <StatCard
          title="Expenses"
          value="$0"
          icon={<div className="bg-red-100 text-red-600 p-2 rounded-full">📉</div>}
        />

        <StatCard
          title="Investments"
          value="$0"
          icon={<div className="bg-purple-100 text-purple-600 p-2 rounded-full">📊</div>}
        />
      </div>
    </>
  );
}