import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import "./Profile.css";
import { toast } from "react-toastify";

export default function Profile() {
  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    bloodGroup: "O+",
    phone: "9876543210",
    city: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    availability: true,
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get current user
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Try to load from Firebase first
        const profileDoc = await getDoc(doc(db, "donors", currentUser.uid));
        if (profileDoc.exists()) {
          const firebaseData = profileDoc.data();
          setProfile(firebaseData);
          setEditData(firebaseData);
        } else {
          // Fallback to user-specific localStorage
          const userStorageKey = `userProfile_${currentUser.uid}`;
          const savedProfile = localStorage.getItem(userStorageKey);
          if (savedProfile) {
            const data = JSON.parse(savedProfile);
            setProfile(data);
            setEditData(data);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Fallback to user-specific localStorage on error
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userStorageKey = `userProfile_${currentUser.uid}`;
          const savedProfile = localStorage.getItem(userStorageKey);
          if (savedProfile) {
            const data = JSON.parse(savedProfile);
            setProfile(data);
            setEditData(data);
          }
        }
      }
    };

    loadProfile();
  }, []);

  // Validation functions
  const isValidName = (v) => /^[a-zA-Z\s]*$/.test(v) && v.length > 0;
  const isValidCity = (v) => /^[a-zA-Z\s]+$/.test(v) && v.length > 0;
  const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);

  // Handle edit mode
  const startEdit = () => {
    setEditData(profile);
    setErrors({});
    setIsEditing(true);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditData(profile);
    setErrors({});
    setIsEditing(false);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!isValidName(editData.name)) newErrors.name = "Valid name required";
    if (!isValidPhone(editData.phone)) newErrors.phone = "Valid phone required (10 digits, starts with 6-9)";
    if (!isValidCity(editData.city)) newErrors.city = "Valid city required";
    if (!editData.bloodGroup) newErrors.bloodGroup = "Select blood group";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const saveProfile = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please login first!");
        setIsSaving(false);
        return;
      }

      // Save to Firebase Firestore in "donors" collection
      await setDoc(doc(db, "donors", currentUser.uid), {
        ...editData,
        userId: currentUser.uid,
        email: currentUser.email,
        updatedAt: new Date().toISOString(),
      });

      // Also save to user-specific localStorage for offline access
      const userStorageKey = `userProfile_${currentUser.uid}`;
      localStorage.setItem(userStorageKey, JSON.stringify(editData));

      setProfile(editData);
      setIsEditing(false);
      toast.success("Profile updated successfully! Other users can now find you.");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === "name" && !isValidName(value) && value !== "") return;
    if (field === "city" && !isValidCity(value) && value !== "") return;
    if (field === "phone" && !/^\d*$/.test(value)) return;
    if (field === "phone" && value.length > 10) return;

    setEditData({
      ...editData,
      [field]: value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-wrapper">
          {/* Profile Header */}
          <div className="profile-header">
            <h2>My Profile</h2>
            {!isEditing && (
              <button
                className="btn btn-danger btn-edit"
                onClick={startEdit}
              >
                <i className="bi bi-pencil"></i> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-content">
            {/* Left Section - Profile Details */}
            <div className="profile-details">
              {isEditing ? (
                // Edit Mode
                <form className="edit-form">
                  {/* Name */}
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  {/* Blood Group */}
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      className="form-select"
                      value={editData.bloodGroup}
                      onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                    >
                      <option value="">Select Blood Group</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                    {errors.bloodGroup && <small className="text-danger">{errors.bloodGroup}</small>}
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editData.phone}
                      maxLength="10"
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                    {errors.city && <small className="text-danger">{errors.city}</small>}
                  </div>

                  {/* Availability */}
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editData.availability}
                        onChange={(e) =>
                          setEditData({ ...editData, availability: e.target.checked })
                        }
                      />
                      Available for donation
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="form-buttons">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={saveProfile}
                      disabled={isSaving}
                    >
                      <i className="bi bi-check-circle"></i> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelEdit}
                    >
                      <i className="bi bi-x-circle"></i> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="profile-cards">
                  {/* Card 1 - Name */}
                  <div className="profile-card">
                    <div className="card-icon">
                      <i className="bi bi-person"></i>
                    </div>
                    <div className="card-content">
                      <p className="card-label">Name</p>
                      <p className="card-value">{profile.name}</p>
                    </div>
                  </div>

                  {/* Card 2 - Blood Group */}
                  <div className="profile-card">
                    <div className="card-icon">
                      <i className="bi bi-droplet"></i>
                    </div>
                    <div className="card-content">
                      <p className="card-label">Blood Group</p>
                      <span className="blood-badge">{profile.bloodGroup}</span>
                    </div>
                  </div>

                  {/* Card 3 - Phone */}
                  <div className="profile-card">
                    <div className="card-icon">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div className="card-content">
                      <p className="card-label">Phone</p>
                      <p className="card-value">{profile.phone}</p>
                    </div>
                  </div>

                  {/* Card 4 - City */}
                  <div className="profile-card">
                    <div className="card-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div className="card-content">
                      <p className="card-label">City</p>
                      <p className="card-value">{profile.city}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
