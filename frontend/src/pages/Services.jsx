import React, { useState, useEffect } from 'react';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <main><p>Loading services...</p></main>;
  }

  return (
    <main>
      <section className="title">
        <h1>Medical Services</h1>
        <p>Advanced medical services available for patients</p>
      </section>

      <section className="services-container">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            
            <div className="service-content">
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
              
              <div className="doctor-section">
                <span className="doctor-icon">👨‍⚕️</span>
                <span className="doctor-name">{service.doctor}</span>
              </div>
              
              <div className="location-section">
                <span className="location-icon">🏥</span>
                <span className="location-name">{service.location}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Services;
