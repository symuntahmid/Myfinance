type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
      <p className="text-sm text-[var(--muted)]">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-800">
        {value}
      </h2>
    </div>
  );
}