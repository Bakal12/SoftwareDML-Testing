import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "software-dml-testing.firebaseapp.com",
  projectId: "software-dml-testing",
  storageBucket: "software-dml-testing.firebasestorage.app",
  messagingSenderId: "667839627107",
  appId: "1:667839627107:web:7f17e5c26003230018dd56",
  measurementId: "G-FFBPWBW6MV"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth();