import { db, auth } from "./firebase_init.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let motionTriggered = false;
let countdownInterval = null;
let remainingSeconds = 300;

// ================= SOS =================

window.startSOS = async function () {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  alert("🚨 SOS triggered. Fetching location...");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        await addDoc(collection(db, "sos_events"), {
          userId: user.uid,
          latitude: lat,
          longitude: lon,
          timestamp: serverTimestamp()
        });

        const contacts = await fetchEmergencyContacts(user.uid);

        alert(
          contacts.length
            ? `🚨 SOS sent to: ${contacts.join(", ")}`
            : "🚨 SOS sent (no contacts found)"
        );
      } catch (err) {
        console.error(err);
        alert("Failed to send SOS");
      }
    },
    () => alert("Location permission denied")
  );
};

// ================= MOTION POPUP =================

window.askUserSafety = function () {
  if (motionTriggered) return;
  motionTriggered = true;

  remainingSeconds = 300;
  updateCountdown();

  document.getElementById("safetyPopup").classList.remove("hidden");

  countdownInterval = setInterval(() => {
    remainingSeconds--;
    updateCountdown();

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      startSOS();
      closePopup();
    }
  }, 1000);
};

window.userIsSafe = function () {
  clearTimers();
  alert("Glad you're safe ❤️");
};

window.userNeedsHelp = function () {
  clearTimers();
  startSOS();
};

function clearTimers() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  motionTriggered = false;
  closePopup();
}

function closePopup() {
  document.getElementById("safetyPopup").classList.add("hidden");
}

function updateCountdown() {
  const m = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const s = String(remainingSeconds % 60).padStart(2, "0");
  document.getElementById("countdown").innerText = `${m}:${s}`;
}

// ================= MOTION =================

const MOTION_THRESHOLD = 25;

window.enableMotionDetection = function () {
  if (!window.DeviceMotionEvent) {
    alert("Motion not supported on this device");
    return;
  }

  window.addEventListener("devicemotion", handleMotion);
  alert("Motion detection enabled (use phone)");
};

function handleMotion(e) {
  if (motionTriggered) return;
  const a = e.accelerationIncludingGravity;
  if (!a) return;

  const total = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
  if (total > MOTION_THRESHOLD) {
    askUserSafety();
  }
}

// ================= CONTACTS =================

async function fetchEmergencyContacts(uid) {
  const q = query(
    collection(db, "emergency_contacts"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);
  const contacts = [];
  snap.forEach(d => contacts.push(d.data().name));
  return contacts;
}
