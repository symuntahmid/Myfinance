"use client";

import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function FloatingActionButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        left-1/2
        -translate-x-1/2

        bottom-20
        md:bottom-8

        z-[900]

        flex
        h-16
        w-16
        items-center
        justify-center

        rounded-full

        bg-gradient-to-br
        from-[var(--primary)]
        via-[var(--primary)]
        to-[var(--forest)]

        text-white

        shadow-[0_18px_45px_rgba(79,70,229,.45)]

        transition-all
        duration-300

        hover:scale-110
        active:scale-95
      "
      aria-label="Add Transaction"
    >
      <Plus size={30} strokeWidth={2.5} />
    </button>
  );
}