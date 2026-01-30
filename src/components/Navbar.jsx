import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Track user authentication and availability status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user's availability status from Firestore
        try {
          const userDoc = await getDoc(doc(db, "donors", currentUser.uid));
          if (userDoc.exists()) {
            setIsAvailable(userDoc.data().availability || false);
            // Check if user has submitted the form (has availabilityStatus)
            setFormSubmitted(!!userDoc.data().availabilityStatus);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const newStatus = !isAvailable;
      await updateDoc(doc(db, "donors", currentUser.uid), {
        availability: newStatus,
        availabilityStatus: newStatus ? "available_now" : "not_available",
        updatedAt: new Date().toISOString(),
      });

      setIsAvailable(newStatus);
      toast.success(
        newStatus
          ? "You are now available for donation"
          : "Your availability has been paused"
      );
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <nav className="home-navbar sticky-top">

      <div className="nav-left">
        <h4>
          <i className="bi bi-droplet-fill"></i> BloodConnect
        </h4>
        <span className="tagline">Connecting donors with lives</span>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-item">
          <i className="bi bi-house-fill"></i> Home
        </Link>
        {user && (
          <>
            {isAvailable ? (
              <Link to="/update-availability" className="nav-item">
                <i className="bi bi-pencil"></i> Update Availability
              </Link>
            ) : (
              <Link to="/donate" className="nav-item">
                <i className="bi bi-heart-fill"></i> Mark Availability
              </Link>
            )}
            <Link to="/profile" className="nav-item">
              <i className="bi bi-person-circle"></i> Profile
            </Link>
          </>
        )}
        <Link to="/search" className="nav-item">
          <i className="bi bi-search"></i> Find
        </Link>
        <Link to="/about" className="nav-item">
          <i className="bi bi-info-circle-fill"></i> About
        </Link>
      </div>
      <div className="nav-right">
        {user && (
          <div className="availability-indicator">
            <input
              type="checkbox"
              id="availabilityToggle"
              className="availability-toggle"
              checked={isAvailable}
              disabled
              title="Toggle your availability"
            />
            <label htmlFor="availabilityToggle" className="toggle-label">
              <span className={`status-dot ${isAvailable ? 'available' : 'unavailable'}`}></span>
              <span className="status-text">{isAvailable ? 'Available' : 'Not Available'}</span>
            </label>
          </div>
        )}
        {user ? (
          <button className="btn btn-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        ) : (
          <button className="btn btn-logout" onClick={() => navigate("/login")}>
            <i className="bi bi-box-arrow-in-right"></i> Login
          </button>
        )}
      </div>

    </nav>
  );
}
