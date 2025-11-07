import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBK2nXayWJRIFjfOe-hDKkPDA3f78hY7o8",
  authDomain: "tankgo.firebaseapp.com",
  projectId: "tankgo",
  storageBucket: "tankgo.firebasestorage.app",
  messagingSenderId: "429877988138",
  appId: "1:429877988138:web:374027daf4c7f790956c53",
};
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// in development mode, connect to emulators
if (import.meta.env.VITE_MODE === "development") {
  console.log("Using Firebase Emulators...");

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectDatabaseEmulator(rtdb, "localhost", 9000);
}
