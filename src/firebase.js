import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyS7tFmVZksKgFXAJ8PKSniWujpjJyeog",
  authDomain: "zerocartadibossarachele.firebaseapp.com",
  projectId: "zerocartadibossarachele",
  storageBucket: "zerocartadibossarachele.firebasestorage.app",
  messagingSenderId: "1064338609528",
  appId: "1:1064338609528:web:1ab5e7e01fa594812fa48d",
  measurementId: "G-NL23HP7LLV"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza e esporta Firestore (Database)
export const db = getFirestore(app);
