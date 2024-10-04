// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkvFp7BSGPmoZfcSjzN7RTYHRdb_92e9c",
  authDomain: "studynest4me.firebaseapp.com",
  projectId: "studynest4me",
  storageBucket: "studynest4me.appspot.com",
  messagingSenderId: "1015715353374",
  appId: "1:1015715353374:web:52e373a7c09e86a72aaf0f",
  measurementId: "G-R84RE4HBRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
// provider.adjdScope('https://www.googleapis.com/auth/contacts.readonly');
// const analytics = getAnalytics(app);
