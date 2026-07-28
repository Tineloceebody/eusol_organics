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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase Auth Instance
 * Use this for user authentication in admin panel and user accounts
 * 
 * Example usage:
 * ```
 * import { auth } from '@/lib/firebase';
 * import { signInWithEmailAndPassword } from 'firebase/auth';
 * 
 * await signInWithEmailAndPassword(auth, email, password);
 * ```
 */
export const auth: Auth = getAuth(app);

/**
 * Firestore Database Instance
 * Use this for storing product data, user information, and orders
 * 
 * Example usage:
 * ```
 * import { db } from '@/lib/firebase';
 * import { collection, getDocs } from 'firebase/firestore';
 * 
 * const productsCollection = collection(db, 'products');
 * const snapshot = await getDocs(productsCollection);
 * ```
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Storage Instance
 * Use this for uploading and managing product images and videos
 * 
 * Example usage:
 * ```
 * import { storage } from '@/lib/firebase';
 * import { ref, uploadBytes } from 'firebase/storage';
 * 
 * const fileRef = ref(storage, 'products/images/my-image.jpg');
 * await uploadBytes(fileRef, file);
 * ```
 */
export const storage: FirebaseStorage = getStorage(app);

export default app;
