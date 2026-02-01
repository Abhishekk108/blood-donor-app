import Navbar from "./Navbar";
import "./About.css";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>
              <i className="bi bi-droplet-fill"></i> About BloodConnect
            </h1>
            <p className="hero-subtitle">
              Connecting Blood Donors with Lives in Need
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="about-wrapper">
          {/* What We Do */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-heart-pulse"></i>
              <h2>What is Blood Donor Finder?</h2>
            </div>
            <div className="section-content">
              <p>
                <strong>BloodConnect</strong> is a map-based web application designed to make
                finding blood donors faster and easier during medical emergencies. Our platform connects
                patients in need with nearby willing blood donors in real-time.
              </p>
              <p>
                Traditional blood donation systems rely on centralized blood banks and hospitals.
                BloodConnect bridges the gap by creating a community-driven network where donors
                can register their location and blood group, enabling quick access when needed most.
              </p>
            </div>
          </section>

          {/* The Problem We Solve */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-exclamation-triangle"></i>
              <h2>The Problem We Solve</h2>
            </div>
            <div className="section-content">
              <div className="problem-cards">
                <div className="problem-card">
                  <div className="problem-icon">
                    <i className="bi bi-hourglass-split"></i>
                  </div>
                  <h4>Time Delays</h4>
                  <p>
                    Finding blood donors quickly during emergencies is critical.
                    BloodConnect eliminates unnecessary delays.
                  </p>
                </div>

                <div className="problem-card">
                  <div className="problem-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <h4>Location Challenges</h4>
                  <p>
                    Not knowing where nearby donors are located makes the search
                    difficult and time-consuming.
                  </p>
                </div>

                <div className="problem-card">
                  <div className="problem-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <h4>Limited Donor Pool</h4>
                  <p>
                    Many patients don't have personal connections with potential
                    donors in their area.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Helps */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-lightbulb"></i>
              <h2>How BloodConnect Helps</h2>
            </div>
            <div className="section-content">
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-number">1</div>
                  <h4>Register as Donor</h4>
                  <p>Sign up with your name, blood group, phone, city, and exact location on the map.</p>
                </div>

                <div className="benefit-item">
                  <div className="benefit-number">2</div>
                  <h4>Get Discovered</h4>
                  <p>Patients searching for blood donors can find you using the interactive map.</p>
                </div>

                <div className="benefit-item">
                  <div className="benefit-number">3</div>
                  <h4>Save Lives</h4>
                  <p>Your donation can make a critical difference during medical emergencies.</p>
                </div>

                <div className="benefit-item">
                  <div className="benefit-number">4</div>
                  <h4>Easy Communication</h4>
                  <p>Get contacted directly with your phone number when patients need your blood group.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Map-Based Search */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-map"></i>
              <h2>Why Map-Based Donor Search?</h2>
            </div>
            <div className="section-content">
              <div className="why-cards">
                <div className="why-card">
                  <div className="why-icon">
                    <i className="bi bi-zoom-in"></i>
                  </div>
                  <h4>Visual Proximity</h4>
                  <p>
                    See exactly where donors are located relative to the patient,
                    enabling proximity-based decisions.
                  </p>
                </div>

                <div className="why-card">
                  <div className="why-icon">
                    <i className="bi bi-speedometer2"></i>
                  </div>
                  <h4>Quick Response</h4>
                  <p>
                    Find nearby donors instantly without scrolling through lists.
                    Time is critical in medical emergencies.
                  </p>
                </div>

                <div className="why-card">
                  <div className="why-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h4>Verified Locations</h4>
                  <p>
                    Donors mark their exact location on the map, providing reliable
                    and verified information.
                  </p>
                </div>

                <div className="why-card">
                  <div className="why-icon">
                    <i className="bi bi-binoculars"></i>
                  </div>
                  <h4>Better Overview</h4>
                  <p>
                    Get a clear overview of available donors in your area at a glance,
                    making better informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-gear"></i>
              <h2>How It Works</h2>
            </div>
            <div className="section-content">
              <div className="steps">
                <div className="step">
                  <div className="step-circle">1</div>
                  <h4>User Registration</h4>
                  <p>Create an account using email and password for secure access.</p>
                </div>

                <div className="step-arrow">
                  <i className="bi bi-arrow-right"></i>
                </div>

                <div className="step">
                  <div className="step-circle">2</div>
                  <h4>Donor Registration</h4>
                  <p>Fill in your blood group, phone, city, and mark your location on an interactive map.</p>
                </div>

                <div className="step-arrow">
                  <i className="bi bi-arrow-right"></i>
                </div>

                <div className="step">
                  <div className="step-circle">3</div>
                  <h4>Browse Donors</h4>
                  <p>Search for available donors by location and blood group using the map.</p>
                </div>

                <div className="step-arrow">
                  <i className="bi bi-arrow-right"></i>
                </div>

                <div className="step">
                  <div className="step-circle">4</div>
                  <h4>Direct Contact</h4>
                  <p>Contact donors directly via their phone number for immediate assistance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Future Scope */}
          <section className="about-section">
            <div className="section-header">
              <i className="bi bi-rocket"></i>
              <h2>Future Scope</h2>
            </div>
            <div className="section-content">
              <div className="future-grid">
                <div className="future-item">
                  <i className="bi bi-chat-dots"></i>
                  <h4>In-App Messaging</h4>
                  <p>Direct messaging between donors and patients without sharing phone numbers.</p>
                </div>

                <div className="future-item">
                  <i className="bi bi-bell"></i>
                  <h4>Push Notifications</h4>
                  <p>Real-time alerts when blood donors matching your requirement are nearby.</p>
                </div>

                <div className="future-item">
                  <i className="bi bi-star"></i>
                  <h4>Donor Rating System</h4>
                  <p>Review and rate donors based on responsiveness and reliability.</p>
                </div>

                <div className="future-item">
                  <i className="bi bi-calendar-event"></i>
                  <h4>Donation Schedule</h4>
                  <p>Schedule donation appointments and blood bank integration.</p>
                </div>

                <div className="future-item">
                  <i className="bi bi-bar-chart"></i>
                  <h4>Analytics Dashboard</h4>
                  <p>Track donation history and health statistics for donors.</p>
                </div>

                <div className="future-item">
                  <i className="bi bi-globe"></i>
                  <h4>Multi-City Support</h4>
                  <p>Expand platform to support nationwide blood donor network.</p>
                </div>
              </div>
            </div>
          </section>

          

          {/* Footer Note */}
          <section className="about-footer">
            <p>
              <i className="bi bi-info-circle"></i>
              <strong>Note:</strong> BloodConnect is a demonstration project created for educational
              purposes. In real-world scenarios, blood donations should be coordinated with certified
              blood banks and hospitals.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
