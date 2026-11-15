"use client";

/* A labelled number box on the paper. */
export function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold opacity-70">
        {label}
      </span>

      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        className="w-full rounded-xl border-2 border-[var(--ink)]/15 bg-white/70 px-3 py-2 text-base font-semibold outline-none focus:border-[var(--pen)]"
      />
    </label>
  );
}

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-3xl border-2 border-[var(--ink)]/10 bg-white/50 p-4">
      <div>
        <h2 className="font-hand text-2xl text-[var(--pen)]">{title}</h2>
        {hint && <p className="text-xs opacity-70">{hint}</p>}
      </div>

      {children}
    </section>
  );
}

export function Pill({
  children,
  onClick,
  tone = "pen",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "pen" | "plain";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full px-5 py-3 text-base font-bold transition active:scale-[0.98] ${
        tone === "pen"
          ? "bg-[var(--pen)] text-white"
          : "border-2 border-[var(--ink)]/20 bg-white/70"
      }`}
    >
      {children}
    </button>
  );
}
