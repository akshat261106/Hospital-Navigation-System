import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleFindLocation = () => {
    navigate('/login');
  };

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Navigate the Hospital Easily</h1>
        <p>Find doctors, departments and facilities quickly.</p>

        <div className="find-location-container">
          <button className="find-location-btn" onClick={handleFindLocation}>
            📍 Find Your Location in the Hospital
          </button>
        </div>
      </section>

      <h2 className="section-title">About Our Hospital</h2>

      <section className="features">
        <div className="card">
          <div className="card-icon">🏥</div>
          <h3>Modern Infrastructure</h3>
          <p>Our hospital is equipped with advanced medical infrastructure, modern operation theatres, and specialized diagnostic centers.</p>
        </div>

        <div className="card">
          <div className="card-icon">👨‍⚕️</div>
          <h3>Experienced Doctors</h3>
          <p>We have a team of highly qualified doctors and medical specialists dedicated to providing the best healthcare services.</p>
        </div>

        <div className="card">
          <div className="card-icon">🕒</div>
          <h3>24/7 Emergency Services</h3>
          <p>Our emergency department operates 24 hours a day to provide immediate medical assistance for critical situations.</p>
        </div>

        <div className="card">
          <div className="card-icon">🧪</div>
          <h3>Advanced Diagnostics</h3>
          <p>Facilities like MRI, CT Scan, X-Ray, and pathology labs are available inside the hospital for fast diagnosis.</p>
        </div>

        <div className="card">
          <div className="card-icon">💙</div>
          <h3>Patient-Centered Care</h3>
          <p>We focus on compassionate care, patient comfort, and clear communication for a better hospital experience.</p>
        </div>

        <div className="card">
          <div className="card-icon">🧭</div>
          <h3>Indoor Navigation Support</h3>
          <p>This system helps patients easily locate departments, doctors, and facilities within the hospital.</p>
        </div>
      </section>

      <h2 className="section-title">Hospital Highlights</h2>

      <section className="info-section">
        <div className="info-box">
          <h3>150+ Beds</h3>
          <p>Spacious wards and private rooms designed for patient comfort and recovery.</p>
        </div>

        <div className="info-box">
          <h3>20+ Departments</h3>
          <p>Specialized departments including cardiology, orthopedics, radiology, and pathology.</p>
        </div>

        <div className="info-box">
          <h3>Experienced Staff</h3>
          <p>Professional nurses, technicians, and support staff available for patient care.</p>
        </div>

        <div className="info-box">
          <h3>Modern Equipment</h3>
          <p>Advanced medical technology to ensure precise diagnosis and effective treatment.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
