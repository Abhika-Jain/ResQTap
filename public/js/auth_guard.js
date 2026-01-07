import { auth } from "./firebase_init.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;

  const isLogin = path.includes("login.html");
  const isSignup = path.includes("signup.html");

  if (!user && !isLogin && !isSignup) {
    window.location.replace("login.html");
  }
});
