// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrjWvEIiIr190GIvQxCSJmksRiYcKaLqY",
  authDomain: "pineapple-28.firebaseapp.com",
  projectId: "pineapple-28",
  storageBucket: "pineapple-28.appspot.com",
  messagingSenderId: "919022920074",
  appId: "1:919022920074:web:1dec77f80ee7a3e04c2873",
  measurementId: "G-CQJP0C1489",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
