"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  getProfile,
  updateProfile,
  type UserProfile,
} from "@/app/data/profile";

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    displayName: "",
    username: "",
    email: "",
    passwordHash: null,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function handleChange(
    field: keyof UserProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    updateProfile({
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      displayName: profile.displayName.trim(),
      username: profile.username.trim(),
      email: profile.email.trim(),
    });

    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">

      {/* HEADER */}
      <div className="mb-7 flex items-center gap-3">

        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Edit Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your personal information.
          </p>
        </div>

      </div>

      {/* FORM */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* FIRST NAME */}
        <div>
          <label className="text-sm font-semibold text-slate-800">
            First name
          </label>

          <input
            type="text"
            value={profile.firstName}
            onChange={(event) =>
              handleChange(
                "firstName",
                event.target.value
              )
            }
            placeholder="Your first name"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        {/* LAST NAME */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-800">
            Last name
          </label>

          <input
            type="text"
            value={profile.lastName}
            onChange={(event) =>
              handleChange(
                "lastName",
                event.target.value
              )
            }
            placeholder="Your last name"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        {/* DISPLAY NAME */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-800">
            Display name
          </label>

          <input
            type="text"
            value={profile.displayName}
            onChange={(event) =>
              handleChange(
                "displayName",
                event.target.value
              )
            }
            placeholder="How you want to appear"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        {/* USERNAME */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-800">
            Username
          </label>

          <input
            type="text"
            value={profile.username}
            onChange={(event) =>
              handleChange(
                "username",
                event.target.value
              )
            }
            placeholder="@username"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        {/* EMAIL */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-800">
            Email
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(event) =>
              handleChange(
                "email",
                event.target.value
              )
            }
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        {/* PASSWORD */}
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">

          <p className="text-sm font-semibold text-slate-800">
            Password
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Password changes will be connected when
            MyFinance authentication is implemented.
          </p>

        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex gap-3">

          <Link
            href="/profile"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Save Changes
          </button>

        </div>

        {/* SUCCESS */}
        {saved && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
            Profile updated successfully.
          </div>
        )}

      </div>

    </div>
  );
}