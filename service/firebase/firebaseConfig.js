// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGz2dyxBZ888YPQbCTohwcu9LtBCWqqjs",
  authDomain: "syska-df9c1.firebaseapp.com",
  projectId: "syska-df9c1",
  storageBucket: "syska-df9c1.firebasestorage.app",
  messagingSenderId: "509498700014",
  appId: "1:509498700014:web:6fd61855c0203c314ac3ff",
  measurementId: "G-RFKB00C4TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);