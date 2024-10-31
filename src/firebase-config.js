import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_FIREBASE_KEY,
    authDomain: "software-dml-testing.firebaseapp.com",
    projectId: "software-dml-testing",
    storageBucket: "software-dml-testing.appspot.com",
    messagingSenderId: "667839627107",
    appId: "1:667839627107:web:5ab78e679d988fa018dd56",
    measurementId: "G-T3JK6S3Q00"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);