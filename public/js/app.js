import { db, auth } from "./firebase_init.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= STATE ================= */

let motionTriggered = false;
let countdownInterval = null;
let remainingSeconds = 10;

const MOTION_THRESHOLD = 25;

/* ================= SOS CORE ================= */

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

  alert("🚨 SOS activated. Fetching location...");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      // ✅ FORCE DECIMAL DEGREE FORMAT
      const latitude = Number(pos.coords.latitude).toFixed(6);
      const longitude = Number(pos.coords.longitude).toFixed(6);

      try {
        // 🔥 Save SOS event in Firebase (decimal degrees)
        await addDoc(collection(db, "sos_events"), {
          userId: user.uid,
          latitude: Number(latitude),
          longitude: Number(longitude),
          timestamp: serverTimestamp()
        });

        // 📞 Fetch emergency contacts
        const contacts = await fetchEmergencyContacts(user.uid);

        // 📍 Google Maps (decimal degrees)
        const locationLink =
          `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message =
          `🚨 *SOS ALERT* 🚨\n\n` +
          `I may be in danger.\n\n` +
          `📍 Location (Decimal Degrees):\n` +
          `Latitude: ${latitude}\n` +
          `Longitude: ${longitude}\n\n` +
          `🗺️ Open in Maps:\n${locationLink}\n\n` +
          `Please respond immediately.`;

        // 📲 WhatsApp SOS
        if (contacts.length === 0) {
          alert("SOS sent, but no emergency contacts found.");
        } else {
          sendWhatsAppSOS(contacts, message);
          alert(`🚨 WhatsApp SOS sent to ${contacts.length} contact(s)`);
        }

      } catch (err) {
        console.error("SOS error:", err);
        alert("Failed to send SOS");
      }
    },
    () => alert("Location permission denied")
  );
};

/* ================= WHATSAPP ================= */

function sendWhatsAppSOS(contacts, message) {
  contacts.forEach((phone, index) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const url =
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Delay avoids popup blocking
    setTimeout(() => {
      window.open(url, "_blank");
    }, index * 800);
  });
}

/* ================= CONTACTS ================= */

async function fetchEmergencyContacts(uid) {
  const q = query(
    collection(db, "emergency_contacts"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);
  const phones = [];

  snap.forEach(doc => {
    if (doc.data().phone) {
      phones.push(doc.data().phone);
    }
  });

  return phones;
}

/* ================= SAFETY POPUP ================= */

window.askUserSafety = function () {
  if (motionTriggered) return;

  motionTriggered = true;
  remainingSeconds = 10;
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

/* ================= MOTION DETECTION ================= */

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

  const total = Math.sqrt(
    a.x * a.x +
    a.y * a.y +
    a.z * a.z
  );

  if (total > MOTION_THRESHOLD) {
    askUserSafety();
  }
}

/* ================= WEB DEMO ================= */

window.simulateMovement = function () {
  if (motionTriggered) return;

  console.log("🧪 Simulated movement (Web Demo)");
  askUserSafety();
};