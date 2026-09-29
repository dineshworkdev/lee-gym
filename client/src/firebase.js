import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCDAfmgp3a5tSAPBekOkIUX6HkaUh3soVg",
    authDomain: "leegym-abe89.firebaseapp.com",
    projectId: "leegym-abe89",
    storageBucket: "leegym-abe89.firebasestorage.app",
    messagingSenderId: "1086551470048",
    appId: "1:1086551470048:web:fb27f035dbc819a4420585",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);