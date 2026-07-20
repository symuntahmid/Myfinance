type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatCard({
  title,
  value,
  icon
}: StatCardProps) {
  return (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-800">
          {value}
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[var(--primary)]">
        {icon}
      </div>
    </div>
  </div>
);
}