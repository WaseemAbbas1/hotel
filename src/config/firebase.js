// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqsX6O7c1MEgSD6e3o0v5VrDb0lN6LDVI",
  authDomain: "simt-ecommerce.firebaseapp.com",
  projectId: "simt-ecommerce",
  storageBucket: "simt-ecommerce.firebasestorage.app",
  messagingSenderId: "932813920567",
  appId: "1:932813920567:web:47a72f98cf2964783f22b2",
  measurementId: "G-KK72C002DE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app)
export const auth = getAuth(app)
