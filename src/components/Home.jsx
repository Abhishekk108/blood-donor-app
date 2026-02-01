import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./Home.css";
import searchImg from "../assets/search.gif";
import { collection, query, where, onSnapshot } from "firebase/firestore";
export default function Home() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [liveDonorCount, setLiveDonorCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "donors"),
      where("availability", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLiveDonorCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);
  // Track authentication state and availability status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user's availability status from Firestore
        try {
          const userDoc = await getDoc(doc(db, "donors", currentUser.uid));
          if (userDoc.exists()) {
            setIsAvailable(userDoc.data().availability || false);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🚪 Logout with Toast (only shown if authenticated)
  const logout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to logout. Try again");
    } finally {
      setLoggingOut(false);
    }
  };

  // Handle Donate Blood click
  const handleDonateClick = () => {
    if (user) {
      navigate("/donate");
    } else {
      navigate("/login");
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
    <div className="home-container">
      {/* NAVBAR */}
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
          {user ? (
            <>
              <div className="availability-indicator">
                <input
                  type="checkbox"
                  id="availabilityToggle"
                  className="availability-toggle"
                  checked={isAvailable}
                  onChange={toggleAvailability}
                  title="Toggle your availability"
                />
                <label htmlFor="availabilityToggle" className="toggle-label">
                  <span className={`status-dot ${isAvailable ? 'available' : 'unavailable'}`}></span>
                  <span className="status-text">{isAvailable ? 'Available' : 'Not Available'}</span>
                </label>
              </div>
              <button
                onClick={logout}
                className="btn btn-logout btn-sm"
                disabled={loggingOut}
              >
                <i className="bi  bi-box-arrow-right"></i> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-danger btn-sm"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="home-content">
        {/* HERO */}
        {/* <div className="hero-section">
          <h2>A few minutes of your time can save a life </h2>
          <p>
            Join BloodConnect and help patients find blood donors faster during
            emergencies.
          </p>
        </div> */}

        {/* CARDS */}
        <div className="hero-red">
          <div className="hero-inner">
            <h1 className="hero-title">
               BloodConnect
            </h1>

            <h2 className="hero-tagline">
              Connecting donors with lives
            </h2>

            <p className="hero-desc">
              Find blood donors near you in emergencies or register yourself
              to help save lives. Fast, reliable, and location-based.
            </p>

            <div className="hero-actions">
              <Link to="/search" className="btn btn-light btn-lg">
                <i className="bi bi-search"></i> Find Blood Donors
              </Link>

              {!user && (
                <button
                  className="btn btn-light become-donor-btn btn-lg"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-heart-fill"></i> Become a Donor
                </button>
              )}
            </div>

            {/* 🔴 Live Donors Badge */}
            <div className="live-donor-hero">
              <span className="badge bg-light text-danger">
                {liveDonorCount} Live Donors Available
              </span>
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="ben-works">
          <div className="section-card">
            <h4 className="section-title text-center">Why BloodConnect?</h4>

            <div className="benefits-grid">
              <div className="benefit-box">
                <span className="icon">
                  <i className="bi bi-lightning-charge"></i>
                </span>{" "}
                <h6>Instant Donor Search</h6>
                <p>Find nearby donors in seconds.</p>
              </div>

              <div className="benefit-box">
                <span className="icon">
                  <i className="bi bi-geo-alt"></i>
                </span>{" "}
                <h6>Location Based Matching</h6>
                <p>Map-based donor discovery.</p>
              </div>

              <div className="benefit-box">
                <span className="icon">
                  <i className="bi bi-shield-lock"></i>
                </span>{" "}
                <h6>Secure & Verified</h6>
                <p>Login with Firebase authentication.</p>
              </div>

              <div className="benefit-box">
                <span className="icon">
                  <i className="bi bi-people"></i>
                </span>{" "}
                <h6>Community Driven</h6>
                <p>Helping society together.</p>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="section-card">
            <h4 className="section-title text-center">How It Works</h4>

            <div className="steps-grid">
              <div className="step-box">
                <span className="icon">
                  <i className="bi bi-pencil-square"></i>
                </span>
                <p>Register as Donor</p>
              </div>
              <div className="step-box">
                <span className="icon">
                  <i className="bi bi-geo"></i>
                </span>
                <p>Mark Location on Map</p>
              </div>
              <div className="step-box">
                <span className="icon">
                  <i className="bi bi-search"></i>
                </span>
                <p>Search Nearby Donors</p>
              </div>
              <div className="step-box">
                <span className="icon">
                  <i className="bi bi-telephone"></i>
                </span>
                <p>Connect & Save Lives</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}

      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h6>BloodConnect</h6>
            <p>
              A student-built platform helping patients find nearby blood donors
              quickly using location-based technology.
            </p>
          </div>

          <div className="footer-col">
            <h6>Quick Links</h6>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/search">Search</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h6>Contact</h6>
            <p> support@bloodconnect.app</p>
            <p>+91 9XXXXXXXXX</p>
            <p> India</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 BloodConnect | Developed by Abhishek Kallimath
        </div>
      </footer>

    </div>
  );
}
