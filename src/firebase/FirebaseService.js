// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb3L50Z5Te5gT8RzDQ7d8clekvNcTPAoU",
  authDomain: "mona-fashions.firebaseapp.com",
  projectId: "mona-fashions",
  storageBucket: "mona-fashions.firebasestorage.app",
  messagingSenderId: "720285611010",
  appId: "1:720285611010:web:2c6ec1d38bd1a13f38231b",
  measurementId: "G-93CCWTFTZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export { firestore, };