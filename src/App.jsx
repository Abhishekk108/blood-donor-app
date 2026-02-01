import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./leafletIcon";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import DonorForm from "./components/DonorForm";
import DonorList from "./components/DonorList";
import Profile from "./components/Profile";
import UpdateAvailability from "./components/UpdateAvailability";
import About from "./components/About";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>

      {/* ✅ Toast must be OUTSIDE Routes */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/search"
          element={<DonorList />}
        />
        <Route
          path="/about"
          element={<About />}
        />

        {/* PRIVATE ROUTES */}
        <Route
          path="/donate"
          element={user ? <DonorForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-availability"
          element={user ? <UpdateAvailability /> : <Navigate to="/login" />}
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
