// 🔹 IMPORTS (MUST BE FIRST)
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 GLOBAL VARIABLES
let sosTimer = null;
let motionTriggered = false;
let countdownInterval = null;
let remainingSeconds = 300; // 5 minutes

// 🔹 FIREBASE INSTANCES
const db = getFirestore();
const auth = getAuth();

// 🔹 MAIN SOS FUNCTION
window.startSOS = function () {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      try {
        await addDoc(collection(db, "sos_events"), {
          userId: user.uid,
          latitude: lat,
          longitude: lon,
          status: "triggered",
          timestamp: serverTimestamp()
        });

        const contacts = await fetchEmergencyContacts(user.uid);

if (contacts.length > 0) {
  alert(`🚨 SOS sent to: ${contacts.join(", ")}`);
} else {
  alert("🚨 SOS sent (no emergency contacts found)");
}

console.log("SOS sent to contacts:", contacts);


      } catch (error) {
        console.error("❌ Error saving SOS:", error);
        alert("Failed to store SOS");
      }
    },
    () => {
      alert("Location permission denied");
    }
  );
};

// 🔹 MOTION → POPUP + TIMER
window.askUserSafety = function () {
  if (motionTriggered) return;
  motionTriggered = true;

  remainingSeconds = 300;
  updateCountdownUI();

  document.getElementById("safetyPopup").classList.remove("hidden");

  countdownInterval = setInterval(() => {
    remainingSeconds--;
    updateCountdownUI();

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;

      console.log("⏰ No response. Auto SOS sent.");
      startSOS();
      closePopup();
    }
  }, 1000);
};

// 🔹 BUTTON: I'M SAFE
window.userIsSafe = function () {
  clearAllTimers();
  motionTriggered = false;
  closePopup();
  alert("Glad you're safe ❤️");
};

// 🔹 BUTTON: I NEED HELP
window.userNeedsHelp = function () {
  clearAllTimers();
  closePopup();
  startSOS();
};

// 🔹 TIMER HELPERS
function clearAllTimers() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = null;
  remainingSeconds = 300;
}

// 🔹 POPUP CLOSE
function closePopup() {
  document.getElementById("safetyPopup").classList.add("hidden");
}

// 🔹 COUNTDOWN DISPLAY
function updateCountdownUI() {
  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  document.getElementById("countdown").innerText = `${min}:${sec}`;
}

// 🔹 MOTION DETECTION
const MOTION_THRESHOLD = 25;

window.enableMotionDetection = function () {
  if (!window.DeviceMotionEvent) {
    alert("Motion detection not supported");
    return;
  }

  window.addEventListener("devicemotion", handleMotion);
  alert("Motion detection enabled");
};

function handleMotion(event) {
  if (motionTriggered) return;

  const acc = event.accelerationIncludingGravity;
  if (!acc) return;

  const total = Math.sqrt(
    acc.x * acc.x +
    acc.y * acc.y +
    acc.z * acc.z
  );

  if (total > MOTION_THRESHOLD) {
    console.log("🚨 Sudden movement detected:", total);
    askUserSafety();
  }
}
async function fetchEmergencyContacts(userId) {
  const q = query(
    collection(db, "emergency_contacts"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const contacts = [];
  snapshot.forEach(doc => {
    contacts.push(doc.data().name);
  });

  return contacts;
}
