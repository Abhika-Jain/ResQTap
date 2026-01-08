# ResQTap
# 🚨 ResQTap – Smart Emergency Response Web App

ResQTap is a lightweight, web-based emergency response application designed to help users quickly alert trusted contacts during critical situations.  
The app combines real-time location sharing, motion detection, and secure authentication to provide fast and reliable assistance.

---

## 🔥 Problem Statement
In emergency situations, users often struggle to quickly notify trusted contacts and share their location. Manual calls or messages may not always be possible during panic, accidents, or sudden threats.

---

## 💡 Solution
ResQTap enables users to:
- Trigger an **SOS alert** with a single tap
- Automatically detect **sudden motion** (fall/impact detection)
- Share **real-time location** securely
- Manage **emergency contacts**
- Use a **countdown-based safety confirmation popup** before auto-triggering SOS

---

## 🛠️ Tech Stack

### Google Technologies Used
- **Firebase Authentication** – Secure user login & signup  
- **Cloud Firestore** – Real-time database for SOS events & contacts  
- **Firebase Hosting** – Secure web hosting (HTTPS by default)  
- **Google Cloud Console** – API key management & monitoring  

### Frontend
- HTML5  
- CSS3  
- JavaScript  

---

## 🔐 Security & Privacy
- User authentication handled via Firebase Authentication  
- Firestore data is **user-scoped** (each user accesses only their own data)  
- Google API keys are managed and secured via **Google Cloud Console**  
- All communication occurs over HTTPS  

---

## ✨ Key Features
- 🔴 One-tap SOS button  
- 📍 Automatic location capture during SOS  
- 📱 Motion detection with safety confirmation popup  
- ⏱️ Countdown-based auto SOS trigger  
- 👥 Emergency contact management  
- 🔐 Login / Logout functionality  

---


## 🧠 Application Architecture (High Level)
1. User interacts with the ResQTap web interface  
2. Firebase Authentication verifies user identity  
3. SOS events and emergency contacts are stored in Cloud Firestore  
4. Location data is captured using the browser’s Geolocation API  
5. Firebase Hosting serves the application securely  

---

## 🚀 Deployment
The application is deployed using **Firebase Hosting** and is accessible via a secure web URL.

---

## 📌 Future Enhancements
- AI-based anomaly detection for smarter emergency prediction  
- SMS / alert integration  
- Progressive Web App (PWA) support  
- Admin dashboard for analytics  

---

## 👩‍💻 Team
Built with as part of a hackathon project to explore secure, real-world emergency response solutions using Google technologies.

---
