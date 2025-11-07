import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import type { FsUser } from "../data/types";

export const getUserById = async (uid: string): Promise<FsUser | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", uid));
    return userDoc.exists() ? (userDoc.data() as FsUser) : null;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

export const saveUserData = async (user: FsUser) => {
  try {
    await setDoc(doc(firestore, "users", user.uid), user, { merge: true });
  } catch (err) {
    console.error("Error saving user:", err);
  }
};
