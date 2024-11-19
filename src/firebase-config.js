import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from '@firebase/firestore';

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
const db = getFirestore(app);
export const auth = getAuth();

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error("Persistencia falló porque hay múltiples pestañas abiertas.");
  } else if (err.code === 'unimplemented') {
    console.error("El navegador no soporta la persistencia.");
  }
});

export { db };