"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import {
  addCustomReminder,
  deleteCustomReminder,
  getCustomReminders,
  type CustomReminder,
  type ReminderRepeat,
} from "@/app/data/customReminders";
import { todayKey } from "@/app/data/streakFreeze";

export default function CustomRemindersEditor() {
  const { t } = useLanguage();

  const [list, setList] = useState<CustomReminder[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayKey());
  const [repeat, setRepeat] = useState<ReminderRepeat>("once");

  useEffect(() => {
    const refresh = () => setList(getCustomReminders());

    refresh();
    window.addEventListener("remindersUpdated", refresh);

    return () =>
      window.removeEventListener("remindersUpdated", refresh);
  }, []);

  const field =
    "mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]";

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-[var(--foreground)]">
        {t("myRemindersTitle")}
      </h3>

      <input
        value={title}
        maxLength={60}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("reminderTitlePlaceholder")}
        className={`${field} mt-3`}
      />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-[var(--muted)]">
          {t("reminderDateLabel")}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </label>

        <label className="text-xs text-[var(--muted)]">
          {t("repeatLabel")}
          <select
            value={repeat}
            onChange={(e) =>
              setRepeat(e.target.value as ReminderRepeat)
            }
            className={field}
          >
            <option value="once">{t("repeatOnce")}</option>
            <option value="monthly">{t("repeatMonthly")}</option>
            <option value="yearly">{t("repeatYearly")}</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={!title.trim() || !date}
        onClick={() => {
          addCustomReminder({
            title: title.trim(),
            date,
            repeat,
          });
          setTitle("");
          setRepeat("once");
        }}
        className="mt-3 w-full rounded-2xl bg-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        {t("addReminderButton")}
      </button>

      <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {list.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">
            {t("noCustomReminders")}
          </p>
        ) : (
          list.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-black/5 p-3 dark:bg-[var(--card)]/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {item.date} ·{" "}
                  {item.repeat === "once"
                    ? t("repeatOnce")
                    : item.repeat === "monthly"
                    ? t("repeatMonthly")
                    : t("repeatYearly")}
                </p>
              </div>

              <button
                type="button"
                aria-label={t("deleteLabel")}
                onClick={() => deleteCustomReminder(item.id)}
                className="shrink-0 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
