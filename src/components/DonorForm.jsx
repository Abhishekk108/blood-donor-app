import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import DonorMap from "./DonorMap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DonorForm.css";
import { useNavigate } from "react-router-dom";
export default function DonorForm() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Eligibility rules: each rule has a key, checked (passes), and a failure reason
  const initialEligibilityRules = [
    { key: "ageRange", checked: false, label: "Are you between 18 and 65 years old?", reason: "Age must be between 18 and 65" },
    { key: "weight", checked: false, label: "Is your weight 50 kg or more?", reason: "Weight must be at least 50kg" },
    { key: "healthy", checked: false, label: "Are you feeling healthy today?", reason: "You must be feeling healthy today" },
    { key: "donated3Months", checked: false, label: "Have you NOT donated blood in the last 3 months?", reason: "You must wait 3 months between donations" },
    { key: "recentFever", checked: false, label: "Have you NOT had fever, infection, or COVID in the last 14 days?", reason: "You must be free from fever/infection/COVID for 14 days" },
    { key: "recentTattoo", checked: false, label: "Have you NOT had a tattoo or piercing in the last 6 months?", reason: "You must wait 6 months after tattoo/piercing" },
  ];

  const [eligibilityRules, setEligibilityRules] = useState(initialEligibilityRules);

  // Derive legacy-shaped eligibility object for Firestore (keeps existing keys):
  // note: donated3Months/recentFever/recentTattoo in the legacy schema represented the "bad" condition (true = failing),
  // so we invert those three when producing the legacy object.
  const dbEligibility = (() => {
    const map = {};
    eligibilityRules.forEach((r) => {
      if (["donated3Months", "recentFever", "recentTattoo"].includes(r.key)) {
        map[r.key] = !r.checked; // legacy: true means failing
      } else {
        map[r.key] = r.checked;
      }
    });
    return map;
  })();

  // Last donation states
  const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState("");

  // Availability states
  const [availability, setAvailability] = useState("available_now");
  
  const navigate = useNavigate();
  
  // Travel preference (removed)

  // Consent
  const [consent, setConsent] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        () => toast.warn("Location permission denied. Select location on map.")
      );
    }
  }, []);

  // Check if user is temporarily ineligible (any rule failing)
  const isTemporarilyIneligible = () => {
    return eligibilityRules.some((r) => !r.checked);
  };

  // Validation functions
  const isValidCity = (v) => /^[a-zA-Z\s]+$/.test(v);
  const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);

  const validate = () => {
    const newErrors = {};
    if (lat === null || lng === null) newErrors.location = "Select location on map";
    if (!consent) newErrors.consent = "You must consent to be contacted";
    if (hasDonatedBefore && !lastDonationDate) newErrors.lastDonationDate = "Please select last donation date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper: return full days elapsed between given date string and today
  const daysSince = (dateString) => {
    const selected = new Date(dateString);
    const today = new Date();
    const utcSelected = Date.UTC(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.floor((utcToday - utcSelected) / (1000 * 60 * 60 * 24));
  };

  const submitDonor = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // If user has donated before, ensure last donation was at least 90 days ago
    if (hasDonatedBefore) {
      const days = daysSince(lastDonationDate);
      if (days < 90) {
        const msg = "You are not eligible to donate blood again within 90 days of your last donation.";
        toast.error(msg);
        setErrors((prev) => ({ ...prev, lastDonationDate: msg }));
        return; // do not proceed to Firestore writes
      } else {
        // clear lastDonationDate error if previously set
        setErrors((prev) => {
          const { lastDonationDate, ...rest } = prev;
          return rest;
        });
      }
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.error("Please login first!");
        return;
      }

      // Determine if user is available based on availability selection
      const isAvailable = availability === "available_now" || availability === "emergency_only";

      // Save donor eligibility and availability details to "donors" collection
      await addDoc(collection(db, "donors"), {
        userId: currentUser.uid,
        lat: Number(lat),
        lng: Number(lng),
        email: currentUser.email || "",
        eligibility: dbEligibility,
        hasDonatedBefore,
        lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
        availability,
        consent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update user's profile with availability status
      await updateDoc(doc(db, "donors", currentUser.uid), {
        lat: Number(lat),
        lng: Number(lng),
        availability: isAvailable,
        availabilityStatus: availability,
        eligibility: dbEligibility,
        hasDonatedBefore,
        lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
        updatedAt: serverTimestamp(),
      });

      toast.success("Donor registration updated successfully!");
      setEligibilityRules(initialEligibilityRules);
      setHasDonatedBefore(false);
      setLastDonationDate("");
      setAvailability("available_now");
      setConsent(false);
      setErrors({});
      setTimeout(() => {
        navigate("/");
        }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="donor-page">
        <div className="donor-form-container">
          <h3>Donor Eligibility & Availability</h3>

          <form onSubmit={submitDonor} noValidate>

            {/* DONATION ELIGIBILITY SECTION */}
            <div className="section-divider">
              <h5>Donation Eligibility</h5>
              <p className="section-description">Please answer the following questions</p>
            </div>

            <div className="eligibility-group">
              {eligibilityRules.map((rule) => (
                <label className="checkbox-label" key={rule.key}>
                  <input
                    type="checkbox"
                    checked={rule.checked}
                    onChange={(e) =>
                      setEligibilityRules((prev) =>
                        prev.map((r) => (r.key === rule.key ? { ...r, checked: e.target.checked } : r))
                      )
                    }
                  />
                  <span>{rule.label}</span>
                </label>
              ))}

              {isTemporarilyIneligible() && (
                <div className="ineligibility-warning">
                  <i className="bi bi-exclamation-circle"></i>
                  <span>You are currently not eligible to donate. Please check back later.</span>
                  <ul className="ineligibility-reasons">
                    {eligibilityRules
                      .filter((r) => !r.checked)
                      .map((r) => (
                        <li key={r.key}>{r.reason}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* LAST DONATION SECTION */}
            <div className="section-divider">
              <h5>Donation History</h5>
            </div>

            <div className="donation-history">
              <label className="radio-label">
                <input
                  type="radio"
                  name="donated_before"
                  checked={hasDonatedBefore}
                  onChange={() => {
                    setHasDonatedBefore(true);
                    setLastDonationDate("");
                  }}
                />
                <span>Yes, I have donated blood before</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="donated_before"
                  checked={!hasDonatedBefore}
                  onChange={() => {
                    setHasDonatedBefore(false);
                    setLastDonationDate("");
                  }}
                />
                <span>No, this is my first donation</span>
              </label>

              {hasDonatedBefore && (
                <div className="date-input-group">
                  <label htmlFor="lastDonationDate">Last Donation Date</label>
                  <input
                    id="lastDonationDate"
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="form-control"
                  />
                  {errors.lastDonationDate && (
                    <small className="text-danger">{errors.lastDonationDate}</small>
                  )}
                </div>
              )}
            </div>

            {/* AVAILABILITY SECTION */}
            <div className="section-divider">
              <h5>Availability</h5>
            </div>

            <div className="availability-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="availability"
                  value="available_now"
                  checked={availability === "available_now"}
                  onChange={(e) => {
                    setAvailability(e.target.value);
                  }}
                  disabled={isTemporarilyIneligible()}
                />
                <span>Available now</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="availability"
                  value="emergency_only"
                  checked={availability === "emergency_only"}
                  onChange={(e) => setAvailability(e.target.value)}
                  disabled={isTemporarilyIneligible()}
                />
                <span>Available in emergency only</span>
              </label>

              {/* Removed 'Not available' option; only 'Available now' and 'Emergency only' remain */}

              {/* Removed available-till date input */}
            </div>

            {/* Travel preference removed */}

            

            {/* LOCATION SECTION */}
            <div className="section-divider">
              <h5>Your Location</h5>
              <p className="section-description">Search a location or click on map to select your exact location</p>
            </div>

            <div className="map-container">
              {lat && lng ? (
                <DonorMap
                  donors={[{ id: "me", lat, lng }]}
                  mapType="form"
                  enableSearch={true}
                  setSearchPos={({ lat, lng }) => {
                    setLat(lat);
                    setLng(lng);
                  }}
                />

              ) : (
                <p>Loading map...</p>
              )}
            </div>
            {errors.location && (
              <small className="text-danger d-block mb-2">{errors.location}</small>
            )}
            {/* CONSENT SECTION */}
            <div className="consent-group">
              <label className="checkbox-label checkbox-label-large">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>I consent to be contacted for blood donation in case of emergency.</span>
              </label>
              {errors.consent && (
                <small className="text-danger">{errors.consent}</small>
              )}
            </div>

            <button type="submit" className="btn btn-danger w-100" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
