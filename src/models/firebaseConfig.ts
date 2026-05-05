import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAU6k3DZ3ORBYvtgYHYULNgabUo0R6nKUk",
    authDomain: "safe-her-cb592.firebaseapp.com",
    projectId: "safe-her-cb592",
    storageBucket: "safe-her-cb592.firebasestorage.app",
    messagingSenderId: "480631612840",
    appId: "1:480631612840:web:c4d7bb3c5bd59fc67ea99d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
