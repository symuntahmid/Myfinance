"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function NumField({ label, value, onChange }: Props) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
        {label}
      </span>

      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--primary)]"
      />
    </label>
  );
}
