// import functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, onAuthStateChanged, User, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJkUMfNRWq6_gmLuSyVFu-ykJ3ue7q488",
    authDomain: "yt-clone-62c2c.firebaseapp.com",
    projectId: "yt-clone-62c2c",
    storageBucket: "yt-clone-62c2c.firebasestorage.app",
    messagingSenderId: "1077049586487",
    appId: "1:1077049586487:web:e54822ad42fe3b0ad460b2",
    measurementId: "G-Q4CWN7ERYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// wrapper functions to not expose auth variable to other components
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutWithGoogle() {
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}
