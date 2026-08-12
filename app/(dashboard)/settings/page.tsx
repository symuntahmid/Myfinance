"use client";

import { useState } from "react";
import {
  User,
  Sparkles,
  Target,
  Globe2,
  Languages,
  Coins,
  Bell,
  Moon,
  Star,
  MessageSquare,
  ShieldCheck,
  FileText,
  ChevronRight,
  Download,
  Upload,
  LockKeyhole,
  LogOut,
  Trash2,
  Settings2,
} from "lucide-react";

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

function SettingRow({
  icon,
  title,
  subtitle,
  onClick,
  right,
  danger = false,
}: SettingRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition ${
        danger
          ? "hover:bg-red-50"
          : "hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
          danger
            ? "bg-red-50 text-red-500 group-hover:bg-red-100"
            : "bg-slate-50 text-slate-600 group-hover:bg-white group-hover:shadow-sm"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            danger
              ? "text-red-600"
              : "text-slate-900"
          }`}
        >
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {right ?? (
        <ChevronRight
          size={18}
          className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
        />
      )}
    </button>
  );
}

function SettingCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-[11px] text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-1">{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-4 border-t border-slate-100" />
  );
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl pb-12">

      {/* HEADER */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Settings2 size={21} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Settings
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Manage your account, money preferences, and privacy.
            </p>
          </div>
        </div>
      </div>

      {/* PREMIUM */}
      <button
        type="button"
        className="group relative mb-7 w-full overflow-hidden rounded-[28px] bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-6 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles
              size={18}
              className="text-yellow-200"
            />

            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/75">
              MyFinance Premium
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Upgrade your financial intelligence
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
            Get deeper CFO insights, advanced reports,
            personalized recommendations, and smarter
            financial planning.
          </p>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition group-hover:px-6">
            Upgrade
            <ChevronRight size={14} />
          </span>
        </div>

        {/* Decorative circles */}
        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-[14px] border-white/20">
            <Sparkles
              size={38}
              className="text-white/80"
            />
          </div>
        </div>
      </button>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* ACCOUNT */}
        <SettingCard
          title="Account"
          description="Your MyFinance identity"
          icon={<User size={18} />}
        >
          <SettingRow
            icon={<User size={19} />}
            title="Profile"
            subtitle="Symun · Your Personal CFO"
          />

          <Divider />

          <SettingRow
            icon={<Sparkles size={19} />}
            title="Upgrade"
            subtitle="Unlock premium CFO features"
          />
        </SettingCard>

        {/* MONEY */}
        <SettingCard
          title="Money"
          description="Personalize your financial goals"
          icon={<Coins size={18} />}
        >
          <SettingRow
            icon={<Target size={19} />}
            title="Monthly Saving Target"
            subtitle="$125 per month"
          />
        </SettingCard>

        {/* REGIONAL */}
        <SettingCard
          title="Regional Preferences"
          description="Control how financial information is displayed"
          icon={<Globe2 size={18} />}
        >
          <SettingRow
            icon={<Globe2 size={19} />}
            title="Country"
            subtitle="Bangladesh"
          />

          <Divider />

          <SettingRow
            icon={<Languages size={19} />}
            title="Language"
            subtitle="English"
          />

          <Divider />

          <SettingRow
            icon={<Coins size={19} />}
            title="Currency"
            subtitle="USD ($)"
          />
        </SettingCard>

        {/* PREFERENCES */}
        <SettingCard
          title="Preferences"
          description="Customize your MyFinance experience"
          icon={<Settings2 size={18} />}
        >
          <SettingRow
            icon={<Bell size={19} />}
            title="Reminders"
            subtitle="Manage financial reminders"
          />

          <Divider />

          <SettingRow
            icon={<Moon size={19} />}
            title="Dark Mode"
            subtitle={
              darkMode ? "Enabled" : "Disabled"
            }
            right={
              <span
                className={`relative h-6 w-11 rounded-full transition ${
                  darkMode
                    ? "bg-slate-900"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    darkMode
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </span>
            }
            onClick={() =>
              setDarkMode((value) => !value)
            }
          />
        </SettingCard>

        {/* SECURITY & DATA */}
        <SettingCard
          title="Security & Data"
          description="Protect and manage your financial data"
          icon={<ShieldCheck size={18} />}
        >
          <SettingRow
            icon={<LockKeyhole size={19} />}
            title="Passcode Lock"
            subtitle="Protect MyFinance when you open it"
          />

          <Divider />

          <SettingRow
            icon={<Download size={19} />}
            title="Export Data"
            subtitle="Download a backup of your financial data"
          />

          <Divider />

          <SettingRow
            icon={<Upload size={19} />}
            title="Import Data"
            subtitle="Restore your MyFinance backup"
          />
        </SettingCard>

        {/* SUPPORT */}
        <SettingCard
          title="Support"
          description="Help us make MyFinance better"
          icon={<MessageSquare size={18} />}
        >
          <SettingRow
            icon={<Star size={19} />}
            title="Rate MyFinance"
            subtitle="Tell us what you think"
          />

          <Divider />

          <SettingRow
            icon={<MessageSquare size={19} />}
            title="Send Feedback"
            subtitle="Share an idea or report a problem"
          />
        </SettingCard>

        {/* LEGAL */}
        <SettingCard
          title="Terms & Privacy"
          description="Your privacy and legal information"
          icon={<ShieldCheck size={18} />}
        >
          <SettingRow
            icon={<ShieldCheck size={19} />}
            title="Privacy Policy"
          />

          <Divider />

          <SettingRow
            icon={<FileText size={19} />}
            title="Terms of Use"
          />
        </SettingCard>

        {/* ACCOUNT ACTIONS */}
        <SettingCard
          title="Account"
          description="Manage your MyFinance account"
          icon={<User size={18} />}
        >
          <SettingRow
            icon={<LogOut size={19} />}
            title="Log Out"
            subtitle="Sign out of MyFinance"
          />

          <Divider />

          <SettingRow
            icon={<Trash2 size={19} />}
            title="Delete Account Data"
            subtitle="Permanently remove your financial data"
            danger
            onClick={() => setDeleteOpen(true)}
          />
        </SettingCard>

      </div>

      {/* DELETE CONFIRMATION */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Delete your financial data?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              This will permanently remove your transactions,
              investments, budgets, goals, and financial
              progress. This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  // Connect your actual data deletion logic here.
                }}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <p className="mt-8 text-center text-[11px] text-slate-400">
        MyFinance · Your Personal CFO
      </p>
    </div>
  );
}