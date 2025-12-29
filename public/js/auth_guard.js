import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// 🚨 Immediately hide page to avoid flash
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → go to login
    window.location.replace("login.html");
  } else {
    // Logged in → show page
    document.body.style.display = "block";
  }
});
