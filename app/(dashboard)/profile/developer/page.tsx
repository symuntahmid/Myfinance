"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCcw,
  RotateCcw,
  Zap,
} from "lucide-react";
import Link from "next/link";

import {
  completeTask,
  getDailyTasks,
  resetDailyJourney,
} from "@/app/data/dailyJourney";

import {
  addXP,
  getPlayer,
  savePlayer,
} from "@/app/data/player";

type DailyTask = {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
};

export default function DeveloperPage() {
  const [player, setPlayer] = useState<ReturnType<typeof getPlayer> | null>(
    null
  );

  const [tasks, setTasks] = useState<DailyTask[]>([]);

  const [storageData, setStorageData] = useState<string>("");

  const refresh = () => {
    const currentPlayer = getPlayer();
    const currentTasks = getDailyTasks();

    setPlayer(currentPlayer);
    setTasks(currentTasks);

    if (typeof window !== "undefined") {
      const savedPlayer = localStorage.getItem("myfinance-player");
      const savedJourney = localStorage.getItem(
        "myfinance-daily-journey"
      );

      setStorageData(
        JSON.stringify(
          {
            player: savedPlayer
              ? JSON.parse(savedPlayer)
              : null,
            dailyJourney: savedJourney
              ? JSON.parse(savedJourney)
              : null,
          },
          null,
          2
        )
      );
    }
  };

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener("player-updated", handleUpdate);
    window.addEventListener("dailyJourneyUpdated", handleUpdate);
    window.addEventListener("transactionsUpdated", handleUpdate);
    window.addEventListener("investmentsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("player-updated", handleUpdate);
      window.removeEventListener("dailyJourneyUpdated", handleUpdate);
      window.removeEventListener("transactionsUpdated", handleUpdate);
      window.removeEventListener("investmentsUpdated", handleUpdate);
    };
  }, []);

  /*
   * Complete a Daily Journey task manually.
   *
   * completeTask() returns true only when the task
   * was previously incomplete.
   *
   * Therefore XP cannot accidentally be awarded
   * twice for the same task.
   */
  const handleCompleteTask = (task: DailyTask) => {
    const completed = completeTask(task.id);

    if (!completed) {
      return;
    }

    addXP(task.reward);

    window.dispatchEvent(
      new Event("dailyJourneyUpdated")
    );

    refresh();
  };

  /*
   * Add XP manually.
   */
  const handleAddXP = (amount: number) => {
    addXP(amount);
    refresh();
  };

  /*
   * Reset today's Daily Journey.
   *
   * This does NOT remove existing XP.
   */
  const handleResetJourney = () => {
    resetDailyJourney();
    refresh();
  };

  /*
   * Reset XP only.
   *
   * Other player information remains unchanged.
   */
  const handleResetXP = () => {
    if (!player) {
      return;
    }

    savePlayer({
      ...player,
      xp: 0,
      achievements: 0,
    });

    refresh();
  };

  /*
   * Reset both Daily Journey and XP.
   */
  const handleResetAllGamification = () => {
    if (!player) {
      return;
    }

    resetDailyJourney();

    savePlayer({
      ...player,
      xp: 0,
      achievements: 0,
      streak: 1,
    });

    refresh();
  };

  if (!player) {
    return (
      <div className="mx-auto max-w-4xl pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          Loading Developer Mode...
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTaskXP = tasks.reduce(
    (total, task) => total + task.reward,
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">

          <Link
            href="/profile"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Developer Mode
              </h1>

              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                DEV
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Test XP, Daily Journey, rewards, and gamification storage.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* XP STATUS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Zap size={22} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              Current XP
            </p>

            <p className="text-3xl font-bold text-slate-950">
              {player.xp.toLocaleString()} XP
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-400">
              Level
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {Math.floor(player.xp / 100) + 1}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-400">
              Today's tasks
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {completedTasks}/{tasks.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-400">
              Possible task XP
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {totalTaskXP} XP
            </p>
          </div>

        </div>

        {/* MANUAL XP */}
        <div className="mt-5 flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => handleAddXP(10)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
          >
            +10 XP
          </button>

          <button
            type="button"
            onClick={() => handleAddXP(100)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
          >
            +100 XP
          </button>

          <button
            type="button"
            onClick={handleResetXP}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
          >
            <RotateCcw size={14} />
            Reset XP
          </button>

        </div>
      </section>

      {/* DAILY JOURNEY */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Daily Journey
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Manually test each task and its XP reward.
            </p>
          </div>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            {completedTasks}/{tasks.length}
          </span>
        </div>

        <div className="mt-5 space-y-3">

          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                task.completed
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  task.completed
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-400"
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  task.id
                )}
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-bold text-slate-900">
                  {task.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Reward: +{task.reward} XP
                </p>

              </div>

              <button
                type="button"
                disabled={task.completed}
                onClick={() =>
                  handleCompleteTask(task)
                }
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${
                  task.completed
                    ? "cursor-default bg-emerald-100 text-emerald-600"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
              >
                {task.completed
                  ? "Completed"
                  : "Complete +XP"}
              </button>

            </div>
          ))}

        </div>

        <div className="mt-5 flex flex-wrap gap-2">

          <button
            type="button"
            onClick={handleResetJourney}
            className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
          >
            <RotateCcw size={14} />
            Reset Daily Journey
          </button>

          <button
            type="button"
            onClick={handleResetAllGamification}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
          >
            <RotateCcw size={14} />
            Reset All Gamification
          </button>

        </div>

      </section>

      {/* LOCAL STORAGE */}
      <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              LocalStorage
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              This shows exactly what your browser currently stores.
            </p>
          </div>
        </div>

        <pre className="mt-5 max-h-[500px] overflow-auto rounded-2xl bg-slate-900 p-4 text-[11px] leading-5 text-emerald-300">
          {storageData}
        </pre>

      </section>

    </div>
  );
}