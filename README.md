🩸 Blood Donor App

A web-based blood donor management system that helps users register as donors, update their availability, and find nearby blood donors during emergencies. Built using React, Firebase, and Vite.

🚀 Live Demo

👉 (Add your deployed link here if available)
Example: https://blood-donor-app.vercel.app

📌 Overview

The Blood Donor App provides a centralized platform for managing blood donor information and availability. It enables donors to keep their status up to date while allowing others to quickly locate eligible donors when needed.

✨ Features
👤 Authentication

Secure user authentication using Firebase

Email & password login system

📝 Donor Registration

Donor profile creation

Donation history tracking

Eligibility validation (e.g. minimum 90-day gap between donations)

⏱ Availability Management

Update availability status:

Available now

Emergency only

Not available

Availability updates handled safely for both new and existing users

🗺 Donor Map

Interactive map to view registered donors

# 🩸 Blood Donor App

A web app to register blood donors, manage availability, and find nearby eligible donors. Built with React, Firebase, and Vite.

---

## Quick Links

- Live demo: (add your deployed link here)

## Overview

Centralized platform for donors to keep availability updated and for recipients to find nearby eligible donors.

## Features (at a glance)

- Firebase Authentication (email/password)
- Donor registration and eligibility checks
- Availability management (Available / Emergency / Not available)
- Interactive map (Leaflet) with search
- Real-time notifications (toasts)

## Tech Stack (by area)

- Build & tooling: Vite, ESLint
- UI & routing: React 19, React Router
- Styling: Bootstrap 5, Bootstrap Icons, component CSS
- Backend: Firebase Auth (auth) and Firestore (data)
- Maps: Leaflet, react-leaflet, leaflet-geosearch
- Notifications: react-toastify

## Project Structure (important files)

- `src/components/` – UI components (DonorForm, DonorMap, DonorList, UpdateAvailability, etc.)
- `src/firebase.js` – Firebase initialization (uses Vite env vars)
- `src/App.jsx` – Routes & app shell
- `src/main.jsx` – App bootstrap

## Quick Setup

1. Clone:

```bash
git clone https://github.com/Abhishekk108/blood-donor-app.git
cd blood-donor-app
```

2. Install:

```bash
npm install
```

3. Add Firebase env (create `.env`):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run:

```bash
npm run dev
```

## Important implementation notes

- Donor data saved in Firestore `donors` collection. Documents include: `bloodGroup`, `phone`, `city`, `lat`, `lng`, `isAvailable`, `availabilityStatus`, `eligibility`, `lastDonationDate`.
- Map UI uses `DonorMap.jsx` with `react-leaflet` and `leaflet-geosearch`.
- Notifications use `react-toastify`.

## Known Limitations

- Desktop-first; mobile UX needs improvement.

## Future ideas

- Distance-based search, PWA support, admin dashboard, SMS/email emergency alerts.

## Author

Abhishek Kallimath — https://github.com/Abhishekk108

---

License: educational / demo
