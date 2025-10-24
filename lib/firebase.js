// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMCYPR95VNfn10K5CZe8OiQklZGIA4XNc",
  authDomain: "grn-news.firebaseapp.com",
  projectId: "grn-news",
  storageBucket: "grn-news.firebasestorage.app",
  messagingSenderId: "174747062441",
  appId: "1:174747062441:web:862ae6dd29f808d222d90b",
  measurementId: "G-ZMPDV25MFQ",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // <— this line must come AFTER the import above
export const storage = getStorage(app);

// ✅ Analytics (optional)
export let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export default app;
