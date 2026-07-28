import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 * 
 * Add your Firebase credentials from Firebase Console:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project or select an existing one
 * 3. Go to Project Settings > Service Accounts
 * 4. Copy your Web App configuration
 * 5. Paste the values below in your .env.local file:
 * 
 * NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
 * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 * NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 * NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
 * NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyKeyForBuildOnly123456789',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'eusol-organics.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eusol-organics',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'eusol-organics.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:1234567890',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = (() => {
  try {
    return getAuth(app);
  } catch (err) {
    console.warn('Firebase Auth initialization warning:', err);
    return {} as Auth;
  }
})();

export const db: Firestore = (() => {
  try {
    return getFirestore(app);
  } catch (err) {
    console.warn('Firestore initialization warning:', err);
    return {} as Firestore;
  }
})();

export const storage: FirebaseStorage = (() => {
  try {
    return getStorage(app);
  } catch (err) {
    console.warn('Firebase Storage initialization warning:', err);
    return {} as FirebaseStorage;
  }
})();

export default app;
