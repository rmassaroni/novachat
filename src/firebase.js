// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk5hUr6phycsDA36CuMDWGk6BTTYKSQJ0",
  authDomain: "rentalwebsite-67cb8.firebaseapp.com",
  projectId: "rentalwebsite-67cb8",
  storageBucket: "rentalwebsite-67cb8.appspot.com",
  messagingSenderId: "793741902274",
  appId: "1:793741902274:web:581a150162ad137cc3d65b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
