import Link from "next/link";
import { Plus } from "lucide-react";

type QuickActionProps = {
  title: string;
  href: string;
};

export default function QuickAction({
  title,
  href,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
        <Plus size={20} />
      </div>

      <span className="font-semibold text-slate-800">
        {title}
      </span>
    </Link>
  );
}