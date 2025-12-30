import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTfxnEMB7OBICeQ438pzJ4BvBnQ0Uql_k",
  authDomain: "resqtap-1a60b.firebaseapp.com",
  projectId: "resqtap-1a60b",
  storageBucket: "resqtap-1a60b.firebasestorage.app",
  messagingSenderId: "893294562834",
  appId: "1:893294562834:web:bc140b6beb00be2c2c52cb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
