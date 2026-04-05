import React, { useState, useEffect } from 'react';
import '../styles/Facilities.css';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/facilities');
      const data = await response.json();
      setFacilities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <main><p>Loading facilities...</p></main>;
  }

  return (
    <main>
      <section className="title">
        <h1>Hospital Facilities</h1>
        <p>Locate important hospital facilities easily</p>
      </section>

      <section className="facilities-container">
        {facilities.map((facility) => (
          <div key={facility.id} className="facility-card">
            <div className="facility-icon">{facility.icon}</div>
            
            <div className="facility-content">
              <h3 className="facility-name">{facility.name}</h3>
              <p className="facility-description">{facility.description}</p>
              
              <div className="location-section">
                <span className="location-icon">📍</span>
                <span className="location-text">{facility.location}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Facilities;
