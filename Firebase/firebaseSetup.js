import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_apiKey,
  authDomain: process.env.EXPO_PUBLIC_authDomain,
  projectId: process.env.EXPO_PUBLIC_projectId,
  storageBucket: process.env.EXPO_PUBLIC_storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId,
  appId: process.env.EXPO_PUBLIC_apdId,
  measurementId: process.env.EXPO_PUBLIC_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);