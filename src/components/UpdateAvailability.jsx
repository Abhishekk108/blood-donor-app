import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateAvailability.css";

export default function UpdateAvailability() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState("available_now");
  const [availableUntil, setAvailableUntil] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [preferredTime, setPreferredTime] = useState("anytime");
  const [errors, setErrors] = useState({});

  // Load current availability data
  useEffect(() => {
    const loadCurrentData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDoc = await getDoc(doc(db, "donors", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAvailability(data.availabilityStatus || "available_now");
          setAvailableUntil(data.availableUntil || "");
          setMaxDistance(data.maxDistance?.toString() || "");
          setPreferredTime(data.preferredTime || "anytime");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load availability data");
      }
    };

    loadCurrentData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!maxDistance) newErrors.maxDistance = "Maximum distance is required";
    else if (isNaN(maxDistance) || maxDistance < 0) newErrors.maxDistance = "Please enter a valid distance";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please login first!");
        return;
      }

      const isAvailable = availability !== "not_available";

      await updateDoc(doc(db, "donors", currentUser.uid), {
        availability: isAvailable,
        availabilityStatus: availability,
        availableUntil: availability === "available_now" ? null : availableUntil,
        maxDistance: Number(maxDistance),
        preferredTime,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Availability updated successfully!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="update-availability-page">
        <div className="update-availability-container">
          <h3>Update Availability</h3>
          <p className="form-description">Update your availability preferences</p>

          <form onSubmit={handleSave} noValidate>
            {/* Availability Status */}
            <div className="form-group">
              <label>Availability Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="availability"
                    value="available_now"
                    checked={availability === "available_now"}
                    onChange={(e) => {
                      setAvailability(e.target.value);
                      setAvailableUntil("");
                    }}
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
                  />
                  <span>Emergency only</span>
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
            </div>

            {/* Available Until */}
            {availability === "available_now" && (
              <div className="form-group">
                <label htmlFor="availableUntil">Available till (Optional)</label>
                <input
                  id="availableUntil"
                  type="date"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="form-control"
                />
              </div>
            )}

            {/* Form Buttons */}
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
