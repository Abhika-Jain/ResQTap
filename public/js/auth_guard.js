import { auth } from "./firebase_init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Hide page until auth is resolved */
document.documentElement.style.display = "none";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;

  if (!user) {
    // If NOT logged in and NOT already on login/signup
    if (!path.includes("login.html") && !path.includes("signup.html")) {
      window.location.replace("login.html");
    }
  } else {
    // Logged in → allow page
    document.documentElement.style.display = "block";
  }
});
