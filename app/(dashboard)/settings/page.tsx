"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
  Download,
  Upload,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

import {
  getSettings,
  updateSettings,
} from "@/app/data/settings";

import {
  exportMyFinanceData,
  importMyFinanceData,
  deleteAllAccountData,
} from "@/app/data/accountData";

/* ==========================================
   TYPES
========================================== */

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/* ==========================================
   ROW
========================================== */

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
      className={`flex w-full items-center gap-4 px-4 py-4 text-left transition ${
        danger
          ? "hover:bg-red-50 active:bg-red-100"
          : "hover:bg-slate-50 active:bg-slate-100"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-50 text-red-500"
            : "bg-slate-50 text-slate-600"
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
          <p className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {right ?? (
        <ChevronRight
          size={18}
          className="shrink-0 text-slate-300"
        />
      )}
    </button>
  );
}

/* ==========================================
   GROUP
========================================== */

function SettingGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

/* ==========================================
   DIVIDER
========================================== */

function Divider() {
  return (
    <div className="ml-[72px] border-t border-slate-100" />
  );
}

/* ==========================================
   MODAL
========================================== */

function Modal({
  open,
  onClose,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}

/* ==========================================
   SETTINGS PAGE
========================================== */

export default function Settings() {
  const [settings, setSettings] =
    useState(getSettings());

  const [savingTargetOpen, setSavingTargetOpen] =
    useState(false);

  const [regionalOpen, setRegionalOpen] =
    useState(false);

  const [remindersOpen, setRemindersOpen] =
    useState(false);

  const [passcodeOpen, setPasscodeOpen] =
    useState(false);

  const [feedbackOpen, setFeedbackOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [savingTarget, setSavingTarget] =
    useState(
      String(settings.monthlySavingTarget)
    );

  const [country, setCountry] =
    useState(settings.country);

  const [language, setLanguage] =
    useState(settings.language);

  const [currency, setCurrency] =
    useState(settings.currency);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* ========================================
     REFRESH SETTINGS
  ======================================== */

  useEffect(() => {
    const refresh = () => {
      setSettings(getSettings());
    };

    window.addEventListener(
      "settingsUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "settingsUpdated",
        refresh
      );
    };
  }, []);

  /* ========================================
     DARK MODE
  ======================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );
  }, [settings.darkMode]);

  /* ========================================
     UPDATE
  ======================================== */

  function changeSetting(
    updates: Partial<typeof settings>
  ) {
    updateSettings(updates);
    setSettings(getSettings());
  }

  /* ========================================
     IMPORT
  ======================================== */

  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      await importMyFinanceData(file);

      setSettings(getSettings());

      alert(
        "Your MyFinance data was imported successfully."
      );
    } catch {
      alert(
        "This backup file is invalid or could not be imported."
      );
    }

    event.target.value = "";
  }

  /* ========================================
     DELETE
  ======================================== */

  function handleDelete() {
    deleteAllAccountData();

    setDeleteOpen(false);

    setSettings(getSettings());

    alert(
      "Your MyFinance account data has been deleted."
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and MyFinance preferences.
        </p>
      </div>


      {/* PREMIUM */}

      <button
        type="button"
        className="group relative mb-7 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-5 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/15 blur-2xl" />

        <div className="relative max-w-[75%]">

          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={18}
              className="text-yellow-200"
            />

            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              MyFinance Premium
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            Access Premium Features
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-white/80">
            Unlock smarter CFO insights, advanced reports,
            and personalized financial guidance.
          </p>

          <span className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-xs font-bold text-slate-900 shadow-sm transition group-hover:px-6">
            Upgrade
          </span>

        </div>
      </button>


      {/* ACCOUNT */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Account
        </p>

        <SettingGroup>

          <SettingRow
            icon={<User size={19} />}
            title="Profile"
            subtitle="Your financial identity"
            onClick={() => {
              window.location.href =
                "/profile";
            }}
          />

          <Divider />

          <SettingRow
            icon={<Sparkles size={19} />}
            title="Upgrade"
            subtitle="Unlock premium CFO features"
            onClick={() => {
              alert(
                "Premium upgrade will be available soon."
              );
            }}
          />

          <Divider />

          <SettingRow
            icon={<Target size={19} />}
            title="Monthly Saving Target"
            subtitle={`$${settings.monthlySavingTarget.toLocaleString()} per month`}
            onClick={() =>
              setSavingTargetOpen(true)
            }
          />

        </SettingGroup>
      </section>


      {/* REGIONAL */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Regional Preferences
        </p>

        <SettingGroup>

          <SettingRow
            icon={<Globe2 size={19} />}
            title="Country"
            subtitle={settings.country}
            onClick={() =>
              setRegionalOpen(true)
            }
          />

          <Divider />

          <SettingRow
            icon={<Languages size={19} />}
            title="Language"
            subtitle={settings.language}
            onClick={() =>
              setRegionalOpen(true)
            }
          />

          <Divider />

          <SettingRow
            icon={<Coins size={19} />}
            title="Currency"
            subtitle={settings.currency}
            onClick={() =>
              setRegionalOpen(true)
            }
          />

        </SettingGroup>
      </section>


      {/* PREFERENCES */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Preferences
        </p>

        <SettingGroup>

          <SettingRow
            icon={<Bell size={19} />}
            title="Reminders"
            subtitle={
              settings.remindersEnabled
                ? "Enabled"
                : "Disabled"
            }
            onClick={() =>
              setRemindersOpen(true)
            }
          />

          <Divider />

          <SettingRow
            icon={<Moon size={19} />}
            title="Dark Mode"
            subtitle={
              settings.darkMode
                ? "Enabled"
                : "Disabled"
            }
            right={
              <span
                className={`relative h-6 w-11 rounded-full transition ${
                  settings.darkMode
                    ? "bg-slate-900"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    settings.darkMode
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </span>
            }
            onClick={() =>
              changeSetting({
                darkMode:
                  !settings.darkMode,
              })
            }
          />

        </SettingGroup>
      </section>


      {/* DATA */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Your Data
        </p>

        <SettingGroup>

          <SettingRow
            icon={<Download size={19} />}
            title="Export Data"
            subtitle="Download a MyFinance backup"
            onClick={exportMyFinanceData}
          />

          <Divider />

          <SettingRow
            icon={<Upload size={19} />}
            title="Import Data"
            subtitle="Restore a previous backup"
            onClick={() =>
              fileInputRef.current?.click()
            }
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />

          <Divider />

          <SettingRow
            icon={<Lock size={19} />}
            title="Passcode Lock"
            subtitle={
              settings.passcodeEnabled
                ? "Enabled"
                : "Not enabled"
            }
            onClick={() =>
              setPasscodeOpen(true)
            }
          />

          <Divider />

          <SettingRow
            icon={<Trash2 size={19} />}
            title="Delete Account Data"
            subtitle="Permanently remove your MyFinance data"
            danger
            onClick={() =>
              setDeleteOpen(true)
            }
          />

        </SettingGroup>
      </section>


      {/* SUPPORT */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Support
        </p>

        <SettingGroup>

          <SettingRow
            icon={<Star size={19} />}
            title="Rate MyFinance"
            subtitle="Tell us what you think"
            onClick={() =>
              alert(
                "Thanks for supporting MyFinance!"
              )
            }
          />

          <Divider />

          <SettingRow
            icon={<MessageSquare size={19} />}
            title="Send Feedback"
            subtitle="Help us improve MyFinance"
            onClick={() =>
              setFeedbackOpen(true)
            }
          />

        </SettingGroup>
      </section>


      {/* LEGAL */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400">
          Terms & Privacy
        </p>

        <SettingGroup>

          <SettingRow
            icon={<ShieldCheck size={19} />}
            title="Privacy Policy"
            onClick={() =>
              alert(
                "Privacy Policy page coming soon."
              )
            }
          />

          <Divider />

          <SettingRow
            icon={<FileText size={19} />}
            title="Terms of Use"
            onClick={() =>
              alert(
                "Terms of Use page coming soon."
              )
            }
          />

        </SettingGroup>
      </section>


      {/* LOGOUT */}

      <section>
        <SettingGroup>

          <SettingRow
            icon={<LogOut size={19} />}
            title="Log Out"
            subtitle="Sign out of MyFinance"
            onClick={() => {
              alert(
                "You have been logged out."
              );
            }}
          />

        </SettingGroup>
      </section>


      {/* FOOTER */}

      <p className="mt-8 text-center text-[11px] text-slate-400">
        MyFinance · Your Personal CFO
      </p>


      {/* ======================================
          SAVING TARGET MODAL
      ====================================== */}

      <Modal
        open={savingTargetOpen}
        onClose={() =>
          setSavingTargetOpen(false)
        }
      >
        <h2 className="text-xl font-bold text-slate-900">
          Monthly Saving Target
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          How much do you want to save each month?
        </p>

        <input
          value={savingTarget}
          onChange={(event) =>
            setSavingTarget(
              event.target.value
            )
          }
          type="number"
          min="0"
          className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
        />

        <button
          type="button"
          onClick={() => {
            const value =
              Number(savingTarget);

            if (
              !Number.isFinite(value) ||
              value < 0
            ) {
              return;
            }

            changeSetting({
              monthlySavingTarget:
                value,
            });

            setSavingTargetOpen(false);
          }}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Save Target
        </button>
      </Modal>


      {/* ======================================
          REGIONAL MODAL
      ====================================== */}

      <Modal
        open={regionalOpen}
        onClose={() =>
          setRegionalOpen(false)
        }
      >
        <h2 className="text-xl font-bold text-slate-900">
          Regional Preferences
        </h2>

        <div className="mt-6 space-y-4">

          <label className="block">
            <span className="text-xs font-semibold text-slate-500">
              Country
            </span>

            <select
              value={country}
              onChange={(event) =>
                setCountry(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option>Bangladesh</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Japan</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-500">
              Language
            </span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option>English</option>
              <option>বাংলা</option>
              <option>日本語</option>
              <option>Deutsch</option>
            </select>
          </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-500">
              Currency
            </span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="USD">
                USD ($)
              </option>

              <option value="BDT">
                BDT (৳)
              </option>

              <option value="EUR">
                EUR (€)
              </option>

              <option value="GBP">
                GBP (£)
              </option>

              <option value="JPY">
                JPY (¥)
              </option>

              <option value="CAD">
                CAD ($)
              </option>
            </select>
          </label>

        </div>

        <button
          type="button"
          onClick={() => {
            changeSetting({
              country,
              language,
              currency,
            });

            setRegionalOpen(false);
          }}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >
          Save Preferences
        </button>
      </Modal>


      {/* ======================================
          REMINDERS MODAL
      ====================================== */}

      <Modal
        open={remindersOpen}
        onClose={() =>
          setRemindersOpen(false)
        }
      >
        <h2 className="text-xl font-bold text-slate-900">
          Reminders
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Keep your financial habits on track.
        </p>

        <button
          type="button"
          onClick={() =>
            changeSetting({
              remindersEnabled:
                !settings.remindersEnabled,
            })
          }
          className="mt-6 flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4"
        >
          <span className="text-sm font-semibold text-slate-900">
            Financial reminders
          </span>

          <span
            className={`relative h-6 w-11 rounded-full ${
              settings.remindersEnabled
                ? "bg-emerald-500"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                settings.remindersEnabled
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </span>
        </button>
      </Modal>


      {/* ======================================
          PASSCODE MODAL
      ====================================== */}

      <Modal
        open={passcodeOpen}
        onClose={() =>
          setPasscodeOpen(false)
        }
      >
        <h2 className="text-xl font-bold text-slate-900">
          Passcode Lock
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Passcode protection will be connected to
          the authentication layer next.
        </p>

        <button
          type="button"
          onClick={() => {
            setPasscodeOpen(false);

            alert(
              "Passcode setup will be enabled when authentication is connected."
            );
          }}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >
          Continue
        </button>
      </Modal>


      {/* ======================================
          FEEDBACK MODAL
      ====================================== */}

      <Modal
        open={feedbackOpen}
        onClose={() =>
          setFeedbackOpen(false)
        }
      >
        <h2 className="text-xl font-bold text-slate-900">
          Send Feedback
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us how we can make MyFinance better.
        </p>

        <textarea
          rows={5}
          placeholder="Write your feedback..."
          className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
        />

        <button
          type="button"
          onClick={() => {
            setFeedbackOpen(false);

            alert(
              "Thank you for your feedback!"
            );
          }}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >
          Send Feedback
        </button>
      </Modal>


      {/* ======================================
          DELETE MODAL
      ====================================== */}

      <Modal
        open={deleteOpen}
        onClose={() =>
          setDeleteOpen(false)
        }
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={24} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Delete Account Data?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          This will permanently delete your transactions,
          investments, budgets, player progress, and settings.
          This action cannot be undone.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() =>
              setDeleteOpen(false)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Delete Data
          </button>

        </div>
      </Modal>

    </div>
  );
}