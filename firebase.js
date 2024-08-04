// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_uy2IjArCvkKI3I28CC0RR8A-EXqF_Dw",
  authDomain: "inventory-management-e486d.firebaseapp.com",
  projectId: "inventory-management-e486d",
  storageBucket: "inventory-management-e486d.appspot.com",
  messagingSenderId: "925846769542",
  appId: "1:925846769542:web:de35624cbcfcd5e1a6e607",
  measurementId: "G-5L8CBS6GNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}