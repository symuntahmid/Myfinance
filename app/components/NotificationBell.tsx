"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import {
  getReminderNotifications,
  ReminderNotification,
} from "@/app/services/transactionScheduler";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<
    ReminderNotification[]
  >([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function refreshNotifications() {
      setNotifications(getReminderNotifications());
    }

    refreshNotifications();

    window.addEventListener(
      "transactionsUpdated",
      refreshNotifications
    );

    return () =>
      window.removeEventListener(
        "transactionsUpdated",
        refreshNotifications
      );
  }, []);

  return (
    <div className="relative">
      {/* Bell */}

      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 transition hover:bg-slate-100"
      >
        <Bell className="h-6 w-6 text-slate-700" />

        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl z-50">

          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-lg font-bold">
              Notifications
            </h3>
          </div>

          {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">
                You're all caught up 🎉
              </p>

              <p className="mt-2 text-sm text-slate-500">
                No reminders today.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">

              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-slate-100 px-6 py-5 transition hover:bg-slate-50"
                >
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {item.date}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>
      )}
    </div>
  );
}