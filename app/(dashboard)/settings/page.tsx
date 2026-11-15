"use client";

import CustomRemindersEditor from "@/app/components/CustomRemindersEditor";
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

import { Zap,
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

import {
  useLanguage,
} from "@/app/context/LanguageContext";
import { getProfile } from "@/app/data/profile";
import { getLevel, getPlayer } from "@/app/data/player";

/* ==========================================
   TYPES
========================================== */

type SettingRowProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  href?: string;
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
  value,
  href,
  onClick,
  right,
  danger = false,
}: SettingRowProps) {
  const body = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-500/10 text-red-500"
            : "bg-[var(--primary)]/10 text-[var(--primary)]"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold ${
            danger ? "text-red-600" : "text-[var(--foreground)]"
          }`}
        >
          {title}
        </span>

        {subtitle && (
          <span className="mt-0.5 block text-xs text-[var(--muted)]">
            {subtitle}
          </span>
        )}
      </span>

      {value && (
        <span className="max-w-[40%] truncate text-sm text-[var(--muted)]">
          {value}
        </span>
      )}

      {right ?? (
        <ChevronRight size={16} className="shrink-0 text-[var(--muted)]/60" />
      )}
    </>
  );

  const cls =
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[var(--background)]";

  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

/* ==========================================
   GROUP
========================================== */

function SettingGroup({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      {title && (
        <h2 className="mb-2 px-1 text-xs font-semibold text-[var(--muted)]">
          {title}
        </h2>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {children}
      </div>
    </section>
  );
}

/* ==========================================
   DIVIDER
========================================== */

function Divider() {
  return <div className="ml-[60px] border-t border-[var(--border)]" />;
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
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-[var(--card)] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]"
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

const { t, language: languageCode } = useLanguage();
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

  const [me, setMe] = useState({ name: "", avatar: "", level: 1 });

  useEffect(() => {
    const refresh = () => {
      const profile = getProfile();

      setSettings(getSettings());
      setMe({
        name:
          profile.displayName ||
          `${profile.firstName} ${profile.lastName}`.trim() ||
          getPlayer().name,
        avatar: profile.avatar || "",
        level: getLevel().level,
      });
    };

    refresh();

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

  const langName: Record<string, string> = { en: "English", bn: "বাংলা" };

  const on = (flag: boolean) => (flag ? t("stOn") : t("stOff"));

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      <h1 className="text-xl font-bold tracking-tight">{t("settings")}</h1>

      {/* WHO YOU ARE */}

      <Link
        href="/profile"
        className="flex items-center gap-4 rounded-3xl bg-[var(--forest)] p-4 text-[var(--on-forest)]"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xl font-bold">
          {me.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            (me.name || "?").slice(0, 1).toUpperCase()
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold">{me.name}</span>

          <span className="block text-xs opacity-75">
            {t("stLevel", { n: me.level.toLocaleString(languageCode === "bn" ? "bn-BD" : "en-US") })}
            {" · "}
            {t("stViewProfile")}
          </span>
        </span>

        <ChevronRight size={18} className="shrink-0 opacity-70" />
      </Link>

      {/* REGION */}

      <SettingGroup title={t("regionalPreferences")}>
        <SettingRow
          icon={<Globe2 size={18} />}
          title={t("country")}
          value={settings.country}
          href="/settings/country"
        />

        <Divider />

        <SettingRow
          icon={<Languages size={18} />}
          title={t("language")}
          value={langName[settings.language] ?? settings.language}
          href="/settings/language"
        />

        <Divider />

        <SettingRow
          icon={<Coins size={18} />}
          title={t("currency")}
          value={settings.currency}
          onClick={() => setRegionalOpen(true)}
        />
      </SettingGroup>

      {/* PREFERENCES */}

      <SettingGroup title={t("preferences")}>
        <SettingRow
          icon={<Bell size={18} />}
          title={t("reminders")}
          value={on(settings.remindersEnabled)}
          onClick={() => setRemindersOpen(true)}
        />

        <Divider />

        <SettingRow
          icon={<Zap size={18} />}
          title={t("smsAutoTitle")}
          subtitle={t("smsAutoSubtitle")}
          href="/sms-setup"
        />

        <Divider />

        <SettingRow
          icon={<Moon size={18} />}
          title={t("darkMode")}
          onClick={toggleTheme}
          right={
            <span
              role="switch"
              aria-checked={theme === "dark"}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                theme === "dark" ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                  theme === "dark" ? "left-6" : "left-1"
                }`}
              />
            </span>
          }
        />
      </SettingGroup>

      {/* SECURITY AND BACKUP */}

      <SettingGroup title={t("stSecurity")}>
        <SettingRow
          icon={<Lock size={18} />}
          title={t("passcodeLock")}
          value={on(settings.passcodeEnabled)}
          onClick={() => setPasscodeOpen(true)}
        />

        <Divider />

        <SettingRow
          icon={<Download size={18} />}
          title={t("exportData")}
          subtitle={t("downloadBackup")}
          onClick={() => exportMyFinanceData()}
        />

        <Divider />

        <SettingRow
          icon={<Upload size={18} />}
          title={t("importData")}
          subtitle={t("restoreBackup")}
          onClick={() => fileInputRef.current?.click()}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </SettingGroup>

      {/* HELP */}

      <SettingGroup title={t("support")}>
        <SettingRow
          icon={<Star size={18} />}
          title={t("rateMyFinance")}
          subtitle={t("tellUsWhatYouThink")}
          onClick={() => alert("Thanks for supporting MyFinance!")}
        />

        <Divider />

        <SettingRow
          icon={<MessageSquare size={18} />}
          title={t("sendFeedback")}
          subtitle={t("helpUsImprove")}
          onClick={() => setFeedbackOpen(true)}
        />

        <Divider />

        <SettingRow
          icon={<ShieldCheck size={18} />}
          title={t("privacyPolicy")}
          onClick={() => alert("Privacy Policy page coming soon.")}
        />

        <Divider />

        <SettingRow
          icon={<FileText size={18} />}
          title={t("termsOfUse")}
          onClick={() => alert("Terms of Use page coming soon.")}
        />
      </SettingGroup>

      {/* ACCOUNT ACTIONS */}

      <SettingGroup>
        <SettingRow
          icon={<LogOut size={18} />}
          title={t("logOut")}
          subtitle={t("signOutOfMyFinance")}
          onClick={() => alert(t("youHaveBeenLoggedOut"))}
        />
      </SettingGroup>

      <SettingGroup title={t("stDanger")}>
        <SettingRow
          icon={<Trash2 size={18} />}
          title={t("deleteAccountData")}
          subtitle={t("permanentlyRemoveData")}
          danger
          onClick={() => setDeleteOpen(true)}
        />
      </SettingGroup>

      <p className="pt-2 text-center text-[11px] text-[var(--muted)]">
        MyFinance · Your Personal CFO
      </p>

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
          {t("regionalPreferences")}
        </h2>

        <div className="mt-6 space-y-4">

          <SettingRow
  icon={<Coins size={19} />}
  title={t("currency")}
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
          className="mt-6 w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white"
        >
          {t("savePreferences")}
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
          {t("reminders")}
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("keepFinancialHabits")}
        </p>

        <button
          type="button"
          onClick={() =>
            changeSetting({
              remindersEnabled:
                !settings.remindersEnabled,
            })
          }
          className="mt-6 flex w-full items-center justify-between rounded-2xl bg-[var(--background)] p-4"
        >
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {t("financialReminders")}
          </span>

          <span
            className={`relative h-6 w-11 rounded-full ${
              settings.remindersEnabled
                ? "bg-[var(--primary)]"
                : "bg-[var(--border)]"
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

        {(
          [
            ["salaryDay", "salaryDayLabel"],
            ["rentDay", "rentDayLabel"],
          ] as const
        ).map(([field, label]) => (
          <label
            key={field}
            className="mt-4 block"
          >
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {t(label)}
            </span>

            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={31}
              placeholder={t("dayOfMonthHint")}
              value={settings[field] ?? ""}
              onChange={(event) => {
                const value = Number(event.target.value);

                changeSetting({
                  [field]:
                    event.target.value !== "" &&
                    value >= 1 &&
                    value <= 31
                      ? Math.floor(value)
                      : null,
                });
              }}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
            />
          </label>
        ))}

        <CustomRemindersEditor />
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
    {t("passcodeLock")}
  </h2>

  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
    {t("protectAccountWithPasscode")}
  </p>

  {!settings.passcodeEnabled ? (
    <>
      <div className="mt-5 rounded-2xl bg-[var(--background)] p-4">
        <div className="flex items-center gap-3">
          <Lock
            size={20}
            className="text-slate-600 dark:text-slate-300"
          />

          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {t("setupPasscode")}
            </p>

            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {t("useFourToSixDigitPasscode")}
            </p>
          </div>
        </div>
      </div>

      {passcodeStep === "create" ? (
        <>
          <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]">
            {t("createPasscode")}
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
            placeholder={t("enterFourToSixDigits")}
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center text-lg tracking-[0.4em] placeholder:text-sm placeholder:tracking-normal outline-none focus:border-[var(--primary)]"
          />

          <button
            type="button"
            disabled={
              passcodeInput.length < 4
            }
            onClick={() => {
              setPasscodeStep("confirm");
            }}
            className="mt-5 w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("continue")}
          </button>
        </>
      ) : (
        <>
          <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]">
            {t("confirmPasscode")}
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
            placeholder={t("enterPasscodeAgain")}
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center text-lg tracking-[0.4em] placeholder:text-sm placeholder:tracking-normal outline-none focus:border-[var(--primary)]"
          />

          {passcodeConfirm.length > 0 &&
            passcodeConfirm !== passcodeInput && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {t("passcodesDoNotMatch")}
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
            className="mt-5 w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("enablePasscodeLock")}
          </button>
        </>
      )}
    </>
  ) : (
    <>
      <div className="mt-5 rounded-2xl bg-[var(--primary)]/10 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck
            size={21}
            className="text-emerald-600"
          />

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {t("passcodeLockEnabled")}
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              {t("accountProtected")}
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
        {t("disablePasscodeLock")}
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
          {t("sendFeedback")}
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("tellUsHowToImprove")}
        </p>

        <textarea
          rows={5}
          placeholder={t("writeFeedback")}
          className="mt-5 w-full resize-none rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />

        <button
          type="button"
          onClick={() => {
            setFeedbackOpen(false);

            alert(
              t("thankYouForFeedback")
            );
          }}
          className="mt-4 w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white"
        >
          {t("sendFeedback")}
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
          {t("deleteAccountDataQuestion")}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {t("deleteAccountWarning")}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() =>
              setDeleteOpen(false)
            }
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            {t("deleteData")}
          </button>

        </div>
      </Modal>

    </div>

  );
}