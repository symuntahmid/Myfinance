const READ_KEY = "myfinance-read-notifications";

// NEW
const CACHE_DAY_KEY = "myfinance-notification-day";

function getReadNotifications(): string[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(READ_KEY);

  return data ? JSON.parse(data) : [];
}

function saveReadNotifications(ids: string[]) {
  localStorage.setItem(
    READ_KEY,
    JSON.stringify(ids)
  );
}

/* ---------------------------- */
/* NEW - Clear yesterday cache   */
/* ---------------------------- */

export function resetNotificationCacheIfNewDay() {
  if (typeof window === "undefined") return;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const lastDay = localStorage.getItem(CACHE_DAY_KEY);

  if (lastDay === today) return;

  // New day → remove yesterday's notification history
  localStorage.removeItem(READ_KEY);

  // Save today's date
  localStorage.setItem(CACHE_DAY_KEY, today);
}

/* ---------------------------- */

export function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

/* ---------------------------- */

export function sendBrowserNotification(
  id: string,
  title: string,
  body: string
) {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const notificationKey = `${today}-${id}`;

  const read = getReadNotifications();

  if (read.includes(notificationKey)) return;

  new Notification(title, {
    body,
    icon: "/favicon.ico",
  });

  read.push(notificationKey);

  saveReadNotifications(read);
}

/* ---------------------------- */

export function markAllNotificationsRead(
  ids: string[]
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const read = getReadNotifications();

  ids.forEach((id) => {
    const key = `${today}-${id}`;

    if (!read.includes(key)) {
      read.push(key);
    }
  });

  saveReadNotifications(read);
}

/* ---------------------------- */

export function isNotificationRead(
  id: string
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const read = getReadNotifications();

  return read.includes(`${today}-${id}`);
}