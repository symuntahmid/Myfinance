export type UserProfile = {
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  passwordHash: string | null;
};

const STORAGE_KEY = "myfinance-profile";

const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  displayName: "",
  username: "",
  email: "",
  passwordHash: null,
};

/* ==========================================
   GET PROFILE
========================================== */

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return DEFAULT_PROFILE;
  }

  try {
    return {
      ...DEFAULT_PROFILE,
      ...JSON.parse(saved),
    };
  } catch {
    console.error(
      "Failed to load MyFinance profile."
    );

    return DEFAULT_PROFILE;
  }
}

/* ==========================================
   SAVE PROFILE
========================================== */

export function saveProfile(
  profile: UserProfile
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );

  window.dispatchEvent(
    new Event("profileUpdated")
  );
}

/* ==========================================
   UPDATE PROFILE
========================================== */

export function updateProfile(
  updates: Partial<UserProfile>
) {
  const current = getProfile();

  saveProfile({
    ...current,
    ...updates,
  });
}

/* ==========================================
   RESET PROFILE
========================================== */

export function resetProfile() {
  saveProfile(DEFAULT_PROFILE);
}

/* ==========================================
   STORAGE KEY
========================================== */

export {
  STORAGE_KEY as PROFILE_STORAGE_KEY,
};