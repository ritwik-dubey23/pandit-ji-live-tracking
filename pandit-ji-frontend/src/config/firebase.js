import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDAvAnG7KBdr4XOkmVXn5DBdSb-XaTZxzs",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "panditji-f5483.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "panditji-f5483",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "panditji-f5483.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "83005243119",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:83005243119:web:dc5e837007dd2bbec7a51a",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1PFCQ5BH17"
};

// Singleton pattern to prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Safe Analytics Initialization for browser environments
let analytics = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    }).catch((err) => {
        console.warn("Firebase Analytics not supported in this environment:", err?.message);
    });
}

export { app, auth, googleProvider, analytics };
