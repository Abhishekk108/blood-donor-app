import { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import DonorMap from "./DonorMap";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DonorList.css";

export default function DonorList() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Phone number copied");
    } catch (err) {
      toast.error("Failed to copy number");
    }
  };
  const searchDonors = async () => {
    if (!bloodGroup) {
      toast.warning("Please select a blood group");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "donors"),
        where("bloodGroup", "==", bloodGroup),
        where("availability", "==", true)
      );

      const querySnapshot = await getDocs(q);

      const result = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lat: Number(doc.data().lat),
        lng: Number(doc.data().lng),
      }));

      if (result.length === 0) {
        toast.info("No donors found for this blood group");
      }

      setDonors(result);
    } catch (err) {
      console.error("Error fetching donors:", err);
      toast.error("Failed to fetch donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getAvailabilityBadge = (status) => {
    if (status === "available_now") {
      return <span className="badge badge-available">🟢 Available Now</span>;
    }
    if (status === "emergency_only") {
      return <span className="badge badge-emergency">🚨 Emergency Only</span>;
    }
    return <span className="badge badge-unavailable">❌ Not Available</span>;
  };
  return (
    <>
      <Navbar />

      <div className="main-body">
        <div className="body" style={{ margin: "30px" }}>
          <div className="find-donor">
            <h3>Find Blood Donors</h3>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="form-select mb-3"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
              <option>O+</option><option>O-</option>
            </select>

            <button
              onClick={searchDonors}
              className="btn btn-danger mb-3"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>

            {donors.length > 0 && (
              <div className="map-container">
                <DonorMap donors={donors} enableSearch={true} mapType="list" />
              </div>
            )}
          </div>

          <div className="donor-list">
            <div style={{ marginTop: 20 }}>
              {donors.length === 0 && !loading && (
                <p>No donors found</p>
              )}

              {donors.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-striped table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th className="text-center">Blood Group</th>
                        <th>City</th>
                        <th className="text-center">Status</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((d) => (
                        <tr key={d.id}>
                          <td>{d.name || "Donor"}</td>
                          <td className="text-center">{d.bloodGroup}</td>
                          <td>{d.city}</td>
                          <td className="text-center">{getAvailabilityBadge(d.availabilityStatus)}</td>
                          <td>
                            {d.phone}
                            <i
                              className="bi bi-clipboard ms-2 copy-icon"
                              title="Copy phone number"
                              style={{ cursor: "pointer" }}
                              onClick={() => copyPhone(d.phone)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔔 Toast */}
      <ToastContainer position="top-right" autoClose={2500} theme="light" />
    </>
  );
}
