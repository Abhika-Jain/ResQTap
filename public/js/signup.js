import { auth } from "./firebase_init.js";
import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.replace("index.html");
    })
    .catch(err => alert(err.message));
};
