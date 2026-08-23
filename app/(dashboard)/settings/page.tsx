"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import Link from "next/link";

import { countries } from "@/app/data/countries";
import {
  useTheme,
} from "@/app/context/ThemeContext";

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
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: ReactNode;
  danger?: boolean;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
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
          ? "hover:bg-red-50/50 active:bg-red-100"
          : "hover:bg-black/5 dark:hover:bg-[var(--card)]/5"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-50 text-red-500 dark:bg-red-500/10"
            : "bg-black/5 text-slate-600 dark:text-slate-300 dark:bg-[var(--card)]/10 dark:text-slate-300"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            danger
              ? "text-red-600"
              : "text-[var(--foreground)]"
          }`}
        >
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 dark:text-[var(--muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {right ?? (
        <ChevronRight
          size={18}
          className="shrink-0 text-slate-300 dark:text-slate-600 dark:text-slate-300"
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
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {children}
    </div>
  );
}

/* ==========================================
   DIVIDER
========================================== */

function Divider() {
  return (
    <div className="ml-[72px] border-t border-slate-100 dark:border-slate-600" />
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
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--card)] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 dark:text-slate-500hover:bg-black/5 dark:bg-white/10 hover:text-slate-700"
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


  const {
  theme,
  toggleTheme,
} = useTheme();

  const [passcodeStep, setPasscodeStep] =
  useState<"create" | "confirm">("create");

const [passcodeInput, setPasscodeInput] =
  useState("");

const [passcodeConfirm, setPasscodeConfirm] =
  useState("");

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
}

  async function hashPasscode(
    passcode: string
  ) {
    const data = new TextEncoder().encode(passcode);

    const hashBuffer =
      await crypto.subtle.digest(
        "SHA-256",
        data
      );

    const hashArray =
      Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage your account and MyFinance preferences.
        </p>
      </div>


      {/* PREMIUM */}

      <button
        type="button"
        className="group relative mb-7 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-5 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[var(--card)]/15 blur-2xl" />

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

          <span className="mt-4 inline-flex rounded-full bg-[var(--card)] px-5 py-2 text-xs font-bold text-[var(--foreground)] shadow-sm transition group-hover:px-6">
            Upgrade
          </span>

        </div>
      </button>


      {/* ACCOUNT */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
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
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          Regional Preferences
        </p>

        <SettingGroup>

          <SettingRow
  icon={<Globe2 size={19} />}
  title="Country"
  subtitle={settings.country}
  onClick={() => {
    window.location.href = "/settings/country";
  }}
/>

          <Divider />

          <SettingRow
  icon={<Languages size={19} />}
  title="Language"
  subtitle={settings.language}
  onClick={() => {
    window.location.href =
      "/settings/language";
  }}
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
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
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
    theme === "dark"
      ? "Enabled"
      : "Disabled"
  }
  right={
    <span
      className={`relative h-6 w-11 rounded-full transition ${
        theme === "dark"
          ? "bg-cyan-500"
          : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          theme === "dark"
            ? "left-6"
            : "left-1"
        }`}
      />
    </span>
  }
  onClick={toggleTheme}
/>

        </SettingGroup>
      </section>


      {/* DATA */}

      <section className="mb-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          Your Data
        </p>

        <SettingGroup>

          <SettingRow
  icon={<Download size={19} />}
  title="Export Data"
  subtitle="Download a backup of your MyFinance data"
  onClick={() => {
    exportMyFinanceData();
  }}
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
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
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
        <p className="mb-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
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

      <p className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500">
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
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Monthly Saving Target
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
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
          className="mt-6 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-cyan-500"
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
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Regional Preferences
        </h2>

        <div className="mt-6 space-y-4">

          <SettingRow
  icon={<Coins size={19} />}
  title="Currency"
  subtitle={settings.currency}
  onClick={() => {
    window.location.href =
      "/settings/currency";
  }}
/>
        </div>

        <button
          type="button"
          onClick={() => {
            changeSetting({

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
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Reminders
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
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
          className="mt-6 flex w-full items-center justify-between rounded-2xl bg-black/5 dark:bg-[var(--card)]/5 p-4"
        >
          <span className="text-sm font-semibold text-[var(--foreground)]">
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
              className={`absolute top-1 h-4 w-4 rounded-full bg-[var(--card)] transition ${
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
  onClose={() => {
    setPasscodeOpen(false);
    setPasscodeStep("create");
    setPasscodeInput("");
    setPasscodeConfirm("");
  }}
>
  <h2 className="text-xl font-bold text-[var(--foreground)]">
    Passcode Lock
  </h2>

  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
    Protect your MyFinance account with a passcode.
  </p>

  {!settings.passcodeEnabled ? (
    <>
      <div className="mt-5 rounded-2xl bg-black/5 dark:bg-[var(--card)]/5 p-4">
        <div className="flex items-center gap-3">
          <Lock
            size={20}
            className="text-slate-600 dark:text-slate-300"
          />

          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Set up your passcode
            </p>

            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Use a 4–6 digit passcode.
            </p>
          </div>
        </div>
      </div>

      {passcodeStep === "create" ? (
        <>
          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Create passcode
          </label>

          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={passcodeInput}
            onChange={(event) => {
              const value =
                event.target.value.replace(
                  /\D/g,
                  ""
                );

              setPasscodeInput(value);
            }}
            placeholder="Enter 4–6 digits"
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
          />

          <button
            type="button"
            disabled={
              passcodeInput.length < 4
            }
            onClick={() => {
              setPasscodeStep("confirm");
            }}
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Confirm passcode
          </label>

          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={passcodeConfirm}
            onChange={(event) => {
              const value =
                event.target.value.replace(
                  /\D/g,
                  ""
                );

              setPasscodeConfirm(value);
            }}
            placeholder="Enter passcode again"
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
          />

          {passcodeConfirm.length > 0 &&
            passcodeConfirm !== passcodeInput && (
              <p className="mt-2 text-xs font-medium text-red-500">
                Passcodes do not match.
              </p>
            )}

          <button
            type="button"
            disabled={
              passcodeConfirm.length < 4 ||
              passcodeConfirm !== passcodeInput
            }
            onClick={async () => {
              const hash =
                await hashPasscode(
                  passcodeInput
                );

              updateSettings({
                passcodeEnabled: true,
                passcodeHash: hash,
              });

              setSettings(getSettings());

              setPasscodeOpen(false);
              setPasscodeStep("create");
              setPasscodeInput("");
              setPasscodeConfirm("");
            }}
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enable Passcode Lock
          </button>
        </>
      )}
    </>
  ) : (
    <>
      <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck
            size={21}
            className="text-emerald-600"
          />

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Passcode Lock is enabled
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              Your MyFinance account is protected.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          updateSettings({
            passcodeEnabled: false,
            passcodeHash: null,
          });

          setSettings(getSettings());

          setPasscodeOpen(false);
        }}
        className="mt-6 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
      >
        Disable Passcode Lock
      </button>
    </>
  )}
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
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Send Feedback
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Tell us how we can make MyFinance better.
        </p>

        <textarea
          rows={5}
          placeholder="Write your feedback..."
          className="mt-5 w-full resize-none rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-cyan-500"
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

        <h2 className="mt-5 text-xl font-bold text-[var(--foreground)]">
          Delete Account Data?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
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
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-slate-700"
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