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

  // Eligibility states
  const [eligibility, setEligibility] = useState({
    ageRange: false,
    weight: false,
    healthy: false,
    donated3Months: false,
    recentFever: false,
    recentTattoo: false,
  });

  // Last donation states
  const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState("");

  // Availability states
  const [availability, setAvailability] = useState("available_now");
  
  const navigate = useNavigate();
  
 

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

  // Check if user is temporarily ineligible
  const isTemporarilyIneligible = () => {
    return (
      !eligibility.ageRange ||
      !eligibility.weight ||
      !eligibility.healthy ||
      eligibility.donated3Months ||
      eligibility.recentFever ||
      eligibility.recentTattoo
    );
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

  const submitDonor = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.error("Please login first!");
        return;
      }

      // Determine if user is available based on availability selection
      const isAvailable = availability !== "not_available";

      // Save donor eligibility and availability details to "donors" collection
      await addDoc(collection(db, "donors"), {
        userId: currentUser.uid,
        lat: Number(lat),
        lng: Number(lng),
        email: currentUser.email || "",
        eligibility,
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
        eligibility,
        hasDonatedBefore,
        lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
        updatedAt: serverTimestamp(),
      });

      toast.success("Donor registration updated successfully!");
      setEligibility({
        ageRange: false,
        weight: false,
        healthy: false,
        donated3Months: false,
        recentFever: false,
        recentTattoo: false,
      });
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
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eligibility.ageRange}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, ageRange: e.target.checked })
                  }
                />
                <span>Are you between 18 and 65 years old?</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eligibility.weight}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, weight: e.target.checked })
                  }
                />
                <span>Is your weight 50 kg or more?</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eligibility.healthy}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, healthy: e.target.checked })
                  }
                />
                <span>Are you feeling healthy today?</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!eligibility.donated3Months}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, donated3Months: !e.target.checked })
                  }
                />
                <span>Have you NOT donated blood in the last 3 months?</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!eligibility.recentFever}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, recentFever: !e.target.checked })
                  }
                />
                <span>Have you NOT had fever, infection, or COVID in the last 14 days?</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!eligibility.recentTattoo}
                  onChange={(e) =>
                    setEligibility({ ...eligibility, recentTattoo: !e.target.checked })
                  }
                />
                <span>Have you NOT had a tattoo or piercing in the last 6 months?</span>
              </label>

              {isTemporarilyIneligible() && (
                <div className="ineligibility-warning">
                  <i className="bi bi-exclamation-circle"></i>
                  <span>You are currently not eligible to donate. Please check back later.</span>
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

              <label className="radio-label">
                <input
                  type="radio"
                  name="availability"
                  value="not_available"
                  checked={availability === "not_available"}
                  onChange={(e) => setAvailability(e.target.value)}
                />
                <span>Not available</span>
              </label>

              
            </div>

            
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
