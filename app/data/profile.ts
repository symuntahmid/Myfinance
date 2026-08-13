export type UserProfile = {
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  passwordHash: string | null;
};

const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  displayName: "",
  username: "",
  email: "",
  passwordHash: null,
};