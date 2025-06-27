import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmLBE4qJsnCf-z4xZRSpfUK44m4_q0rS4",
  authDomain: "passop-66316.firebaseapp.com",
  projectId: "passop-66316",
  storageBucket: "passop-66316.firebasestorage.app",
  messagingSenderId: "898125537178",
  appId: "1:898125537178:web:435d9891ed91cff6d82423",
  measurementId: "G-6TCJM2ZP57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

export { auth, provider, signInWithPopup, signOut };
