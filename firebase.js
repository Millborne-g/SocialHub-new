// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBu2iUvKDzp0sSKLgLLnmEbk_rIPUDg9fM",
    authDomain: "socialhub-62ffc.firebaseapp.com",
    databaseURL: "https://socialhub-62ffc-default-rtdb.firebaseio.com",
    projectId: "socialhub-62ffc",
    storageBucket: "socialhub-62ffc.appspot.com",
    messagingSenderId: "930411155970",
    appId: "1:930411155970:web:31298bb661e200e36b0d1b",
    measurementId: "G-LKS69Y8TVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app)