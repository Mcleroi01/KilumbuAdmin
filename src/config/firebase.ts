import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configure these with your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCQ7hYfQGFtJNZe-LO--K8TzFeslC1y9vk",
  authDomain: "kilumbu-dfb99.firebaseapp.com",
  projectId: "kilumbu-dfb99",
  storageBucket: "kilumbu-dfb99.appspot.com", // ✅ corrigé ici
  messagingSenderId: "1035771206342",
  appId: "1:1035771206342:web:3dc91c9052ece7f66e15c7",
  measurementId: "G-FNGL56Q2F8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;