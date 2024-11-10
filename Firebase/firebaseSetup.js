import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_apiKey,
  authDomain: process.env.EXPO_PUBLIC_authDomain,
  projectId: process.env.EXPO_PUBLIC_projectId,
  storageBucket: process.env.EXPO_PUBLIC_storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId,
  appId: process.env.EXPO_PUBLIC_appId,
  measurementId: process.env.EXPO_PUBLIC_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Storage
export const storage = getStorage(app);