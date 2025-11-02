// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAKL1LhbQHBJFrjpRMGzklUJdIBSTmV-eM",
  authDomain: "fruit-ninja-b77dd.firebaseapp.com",
  projectId: "fruit-ninja-b77dd",
  storageBucket: "fruit-ninja-b77dd.firebasestorage.app",
  messagingSenderId: "542497994117",
  appId: "1:542497994117:web:a4ca8478f280cf60e780ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export needed Firebase objects
export {
  db,
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  onValue
};