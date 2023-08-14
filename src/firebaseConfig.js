// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp8GHTL-w2OdxOE82ygFYLBbHPh1yPQNs",
  authDomain: "cardcache-287d8.firebaseapp.com",
  projectId: "cardcache-287d8",
  storageBucket: "cardcache-287d8.appspot.com",
  messagingSenderId: "957795434856",
  appId: "1:957795434856:web:1f1510b3ccec96d4f5d6dd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);