import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_FUtOat_2o2RN0sB-gT3srU0jCxJ111I",
    authDomain: "vingo-food-delivery-48cc9.firebaseapp.com",
    projectId: "vingo-food-delivery-48cc9",
    storageBucket: "vingo-food-delivery-48cc9.firebasestorage.app",
    messagingSenderId: "415409184408",
    appId: "1:415409184408:web:7b235e484b387fa2c6baed"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
