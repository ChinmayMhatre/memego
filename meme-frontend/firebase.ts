import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
    DocumentData,
    getFirestore,
    collection,
    CollectionReference,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgu1D3Px1DpS-33_gUy93wFcm5wIMyx0c",
    authDomain: "bgc-inside-out.firebaseapp.com",
    projectId: "bgc-inside-out",
    storageBucket: "bgc-inside-out.appspot.com",
    messagingSenderId: "791838606044",
    appId: "1:791838606044:web:b63c35a976ef11ac4dea19",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);



