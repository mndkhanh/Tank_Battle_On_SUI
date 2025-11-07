import type { FsUser } from "../data/types";

export const getUserFromLocalStorage = (): FsUser | null => {
  const stored = localStorage.getItem("userData");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error("Invalid user data in localStorage");
      return null;
    }
  }
  return null;
};

export const saveUserToLocalStorage = (user: FsUser) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("userData");
};

export const isUserLoggedIn = (): boolean => {
  const stored = localStorage.getItem("userData");
  return stored !== null;
};
