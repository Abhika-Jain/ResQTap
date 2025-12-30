import { auth } from "./firebase_init.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* LOGIN */
window.login = function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.replace("index.html");
    })
    .catch(err => alert(err.message));
};

/* LOGOUT — SAFE WAY */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.replace("login.html");
        })
        .catch(err => {
          console.error(err);
          alert("Logout failed");
        });
    });
  }
});