import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOOa_4kXyQ2Fqsvg9HDpmEDa_QHz7riCY",
    authDomain: "goaldle.firebaseapp.com",
    projectId: "goaldle",
    storageBucket: "goaldle.appspot.com",
    messagingSenderId: "1057267795639",
    appId: "1:1057267795639:web:e8c78acaa7271919762f32",
    measurementId: "G-TX3HQM4DJN"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };