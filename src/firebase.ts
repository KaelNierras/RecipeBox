// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9j65pvtk2ryPJgOVlpUMvU20vO8LwuTk",
  authDomain: "recipe-box-3b169.firebaseapp.com",
  projectId: "recipe-box-3b169",
  storageBucket: "recipe-box-3b169.appspot.com",
  messagingSenderId: "81012834219",
  appId: "1:81012834219:web:1bd8bd98f5be1ab7a31cee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);