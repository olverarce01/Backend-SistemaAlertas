// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmlMjnPJfjV-Syi9EnlCItv1YPGiVDYxM",
  authDomain: "vigilant-12535.firebaseapp.com",
  projectId: "vigilant-12535",
  storageBucket: "vigilant-12535.appspot.com",
  messagingSenderId: "948931661447",
  appId: "1:948931661447:web:57e681cfe3425dd5f6f222"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export default database;