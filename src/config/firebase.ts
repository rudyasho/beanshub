import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAX9GQ7icyhcmjhZZRmdw8ysd0H0oAJ2hc",
  authDomain: "beanshub-28a5e.firebaseapp.com",
  projectId: "beanshub-28a5e",
  storageBucket: "beanshub-28a5e.firebasestorage.app",
  messagingSenderId: "835246492153",
  appId: "1:835246492153:web:09e651f39fee736987d528",
  measurementId: "G-4RZM7HWRM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;