import { auth } from "./firebase_init.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
