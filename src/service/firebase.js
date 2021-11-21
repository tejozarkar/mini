import { getDatabase } from '@firebase/database';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebase = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});

export const auth = getAuth(firebase);
export const db = getDatabase(firebase);
export const firestore = getFirestore(firebase);
export const storage = getStorage(firebase);
export default firebase;