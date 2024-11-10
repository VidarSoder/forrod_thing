import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY_,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID_,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID_,
    appId: process.env.NEXT_PUBLIC_APP_ID_,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID_
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Sign-In Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
