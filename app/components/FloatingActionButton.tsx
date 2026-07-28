"use client";

import { useState } from "react";
import {
  Plus,
  Wallet,
  Receipt,
  TrendingUp,
} from "lucide-react";

import AddIncomeModal from "@/app/components/AddIncomeModal";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  const ActionButton = ({
    icon: Icon,
    label,
    color,
    onClick,
  }: {
    icon: any;
    label: string;
    color: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-2xl transition hover:scale-105"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full ${color} text-white`}
      >
        <Icon size={20} />
      </div>

      <span className="whitespace-nowrap font-semibold text-slate-700">
        {label}
      </span>
    </button>
  );

  return (
    <>
      {open && (
  <div
    onClick={() => setOpen(false)}
    className="fixed inset-0 z-40 bg-black/10"
  />
)}

<div className="fixed right-5 bottom-24 md:bottom-8 md:right-8 z-[9999]">

        {/* Floating Menu */}

        <div
          className={`absolute bottom-20 right-0 flex flex-col items-end gap-4 transition-all duration-300 ${
            open
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 translate-y-6"
          }`}
        >
          <ActionButton
            icon={Wallet}
            label="Add Income"
            color="bg-green-500"
            onClick={() => {
              setOpen(false);
              setIncomeOpen(true);
            }}
          />

          <ActionButton
            icon={Receipt}
            label="Add Expense"
            color="bg-red-500"
          />

          <ActionButton
            icon={TrendingUp}
            label="Add Investment"
            color="bg-cyan-500"
          />
        </div>

        {/* Main FAB */}

        <button
          onClick={() => setOpen(!open)}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 ${
            open ? "rotate-45" : ""
          }`}
        >
          <Plus size={30} />
        </button>
      </div>

      <AddIncomeModal
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
      />
    </>
  );
}