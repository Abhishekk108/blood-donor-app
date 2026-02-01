🩸 Blood Donor App(BloodConnect)

A web-based blood donor management system that helps users register as donors, manage their availability, and find nearby eligible blood donors during emergencies.

🔗 Live Demo:
https://blood-donor-app-psi.vercel.app/

📌 Overview

The Blood Donor App provides a centralized platform where blood donors can register and keep their availability updated, while patients or hospitals can quickly find eligible donors during urgent situations.
The system ensures donor eligibility and real-time availability using Firebase services.

✨ Key Features
🔐 Authentication

Secure user authentication using Firebase Authentication

Email & password-based login/signup

📝 Donor Registration

Create and manage donor profiles

Store blood group, contact details, and location

Donation history tracking

Eligibility validation (e.g. minimum 90-day gap between donations)

⏱ Availability Management

Update donor availability status:

✅ Available now

🚨 Emergency only

❌ Not available

Works safely for both new and existing users

🗺 Donor Map

Interactive map showing registered donors

Location-based visualization using Leaflet

Helps quickly locate nearby donors

🔔 Notifications

Real-time feedback using toast notifications

Success and error handling for user actions

🛠 Tech Stack
Frontend

React 19

React Router

Bootstrap 5, Bootstrap Icons

Custom CSS

Backend & Services

Firebase Authentication

Firestore Database

Maps & Utilities

Leaflet

react-leaflet

leaflet-geosearch

Tooling

Vite

ESLint

react-toastify

📂 Project Structure
src/
├── components/
│   ├── DonorForm.jsx        # Donor registration & eligibility logic
│   ├── DonorMap.jsx         # Map view with donor markers
│   ├── DonorList.jsx        # List of available donors
│   ├── UpdateAvailability.jsx # Update donor availability
│   └── Navbar.jsx           # Navigation bar
│
├── firebase.js              # Firebase initialization
├── App.jsx                  # App routes & layout
├── main.jsx                 # App bootstrap
└── App.css                  # Global styles


🚀 Getting Started (Local Setup)
1️⃣ Clone the repository
git clone https://github.com/Abhishekk108/blood-donor-app.git
cd blood-donor-app

2️⃣ Install dependencies
npm install

3️⃣ Configure Firebase environment variables

Create a .env file in the root directory:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

4️⃣ Run the development server
npm run dev

🧠 Implementation Notes

Donor data is stored in the Firestore donors collection

Each donor document includes:

bloodGroup

phone

city

lat, lng

isAvailable

availabilityStatus

eligibility

lastDonationDate

Map functionality is implemented in DonorMap.jsx

Notifications handled using react-toastify

⚠ Known Limitations

Desktop-first design

Mobile responsiveness needs improvement

🚧 Future Enhancements

Distance-based donor search

Progressive Web App (PWA) support

Admin dashboard for verification

SMS / Email alerts during emergencies

Advanced filtering by blood group and city

👤 Author

Abhishek Kallimath
GitHub: https://github.com/Abhishekk108

📄 License

This project is intended for educational and demo purposes.
