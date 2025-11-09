// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWu81QUUZA2Z8rZT88S9NOZ9ENAIKep-o",
  authDomain: "pfinalnoticias.firebaseapp.com",
  projectId: "pfinalnoticias",
  storageBucket: "pfinalnoticias.firebasestorage.app",
  messagingSenderId: "10305179763",
  appId: "1:10305179763:web:eab2f378b2824bbd959a06",
  measurementId: "G-RKB0E9MENZ"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);