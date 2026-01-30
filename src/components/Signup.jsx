import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  // Validation functions
  const isValidName = (v) => /^[a-zA-Z\s]*$/.test(v) && v.length > 0;
  const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);
  const isValidCity = (v) => /^[a-zA-Z\s]+$/.test(v) && v.length > 0;

  const signup = async () => {
    // 🔒 Basic validation
    if (!email || !password || !name || !phone || !bloodGroup || !city) {
      toast.warning("Please fill all fields");
      return;
    }

    if (!isValidName(name)) {
      toast.warning("Name can only contain letters and spaces");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.warning("Phone must be 10 digits and start with 6-9");
      return;
    }

    if (!isValidCity(city)) {
      toast.warning("City can only contain letters and spaces");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save additional user profile info to Firebase
      await setDoc(doc(db, "donors", userId), {
        name: name,
        phone: phone,
        bloodGroup: bloodGroup,
        city: city,
        email: email,
        lat: null,
        lng: null,
        availability: false,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      navigate("/donate");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already registered");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else {
        toast.error("Something went wrong. Try again");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          maxLength="10"
          value={phone}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setPhone(e.target.value);
            }
          }}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => {
            if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
              setCity(e.target.value);
            }
          }}
        />

        <select
          className="signup-select"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <button className="btn btn-danger" onClick={signup}>
          Signup
        </button>

        <p className="signup-link">
          Already have an account?{" "}
          <Link to="/login" className="signup-link-login">
            Login
          </Link>
        </p>
      </div>

      {/* 🔔 Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
