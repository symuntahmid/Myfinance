import {
  getTransactions,
  saveTransactions,
  Transaction,
} from "@/app/data/transactions";

import { sendBrowserNotification } from "@/app/services/browserNotification";

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

function getNextDate(
  date: Date,
  repeat:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "yearly"
) {
  const next = new Date(date);

  switch (repeat) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;

    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/* -------------------------------- */
/* Scheduler                        */
/* -------------------------------- */

export function runTransactionScheduler() {
  const transactions = getTransactions();

  const updatedTransactions: Transaction[] = [...transactions];

  const today = new Date();

  transactions.forEach((transaction) => {
    if (!transaction.autoRepeat) return;

    if (!transaction.repeatFrequency) return;

    let currentDate = new Date(transaction.date);

    let latestGeneratedDate = currentDate;

    while (true) {
      const nextDate = getNextDate(
        currentDate,
        transaction.repeatFrequency
      );

      if (nextDate > today) break;

      const nextDateString =
        nextDate.toISOString().split("T")[0];

      const alreadyExists = updatedTransactions.some(
        (t) =>
          t.type === transaction.type &&
          t.source === transaction.source &&
          t.category === transaction.category &&
          t.amount === transaction.amount &&
          t.date === nextDateString
      );

      if (!alreadyExists) {
        updatedTransactions.unshift({
          ...transaction,
          id: Date.now() + Math.floor(Math.random() * 100000),
          date: nextDateString,
        });
      }

      latestGeneratedDate = nextDate;
      currentDate = nextDate;
    }

    // Move the parent recurring transaction forward
    transaction.date = latestGeneratedDate
      .toISOString()
      .split("T")[0];
  });

  // Update parent recurring transactions
  transactions.forEach((transaction) => {
    const index = updatedTransactions.findIndex(
      (t) => t.id === transaction.id
    );

    if (index !== -1) {
      updatedTransactions[index] = transaction;
    }
  });

  saveTransactions(updatedTransactions);

  return updatedTransactions;
}

/* -------------------------------- */
/* Reminder Types                   */
/* -------------------------------- */

export type ReminderNotification = {
  id: string;
  title: string;
  message: string;
  date: string;
};

/* -------------------------------- */
/* Reminder Generator               */
/* -------------------------------- */

export function getReminderNotifications() {
  const transactions = getTransactions();

  const notifications: ReminderNotification[] = [];

  const today = new Date();

  transactions.forEach((transaction) => {
    if (!transaction.reminder) return;

    const dueDate = new Date(transaction.date);

    let reminderDate = new Date(dueDate);

    switch (transaction.reminderType) {
      case "1day":
        reminderDate.setDate(reminderDate.getDate() - 1);
        break;

      case "3days":
        reminderDate.setDate(reminderDate.getDate() - 3);
        break;

      case "1week":
        reminderDate.setDate(reminderDate.getDate() - 7);
        break;

      case "custom":
        if (transaction.reminderDate) {
          reminderDate = new Date(
            transaction.reminderDate
          );
        }
        break;

      case "due":
      default:
        break;
    }

    if (
      reminderDate.toDateString() ===
      today.toDateString()
    ) {
      const title =
        transaction.source ||
        transaction.category ||
        transaction.type;

      const message =
        transaction.note ||
        `${transaction.category ?? transaction.type} • $${transaction.amount.toLocaleString()}`;

      notifications.push({
        id: String(transaction.id),
        title,
        message,
        date: transaction.date,
      });

      sendBrowserNotification(
        `${transaction.id}-${transaction.date}`,
        title,
        message
      );
    }
  });

  return notifications;
}