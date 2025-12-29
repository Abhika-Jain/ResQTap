import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

window.saveContact = async function () {
  const nameInput = document.getElementById("contactName");
  const phoneInput = document.getElementById("contactPhone");

  // 🔍 SAFETY CHECK (prevents null error)
  if (!nameInput || !phoneInput) {
    alert("Input fields not found");
    return;
  }

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert("Please fill all fields");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    await addDoc(collection(db, "emergency_contacts"), {
      userId: user.uid,
      name: name,
      phone: phone
    });

    alert("✅ Contact saved successfully");

    // Clear fields
    nameInput.value = "";
    phoneInput.value = "";

  } catch (error) {
    console.error("❌ Error saving contact:", error);
    alert("Failed to save contact");
  }
};
