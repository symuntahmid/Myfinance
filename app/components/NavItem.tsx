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


  const linkStyle = active
    ? "bg-[var(--primary)] text-white shadow-sm"
    : "text-[var(--foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary-dark)]";



  return (

    <Link
      href={href}
      className={`
        flex
        items-center
        gap-3
        w-full
        rounded-xl
        px-4
        py-3
        font-semibold
        transition
        ${linkStyle}
      `}
    >

      {icon}

      <span>
        {children}
      </span>


    </Link>

  );

}