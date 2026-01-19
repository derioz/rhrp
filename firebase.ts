import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
// For this demo, we use placeholders. In a real deployment, these come from environment variables or the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDl3s_yKbxhsjJUJm-HCjQtL-dvRjV9F7o",
  authDomain: "rushhourrp-aec24.firebaseapp.com",
  projectId: "rushhourrp-aec24",
  storageBucket: "rushhourrp-aec24.firebasestorage.app",
  messagingSenderId: "539949574077",
  appId: "1:539949574077:web:92dc4b28c0d12d7d0d54d4",
  measurementId: "G-P078TYSE0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;