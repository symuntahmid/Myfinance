import Link from "next/link";
type NavItemProps = {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
};

export default function NavItem({
  children,
  href,
  icon,
  active = false,
}: NavItemProps) {
  return (
  <Link
  href={href}
  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 font-semibold transition ${
      active
        ? "bg-[var(--primary)] text-white shadow-sm"
        : "text-slate-700 hover:bg-teal-50 hover:text-[var(--primary-dark)]"
    }`}
  >
    <>
  {icon}
  <span>{children}</span>
</>
  </Link>
);
}