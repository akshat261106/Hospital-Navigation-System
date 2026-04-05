import React, { useState } from 'react';
import '../styles/Help.css';

const Help = () => {
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleFaqClick = (index) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your query! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main>
      <section className="title">
        <h1>Help & Support</h1>
        <p>Need assistance? We are here to guide you</p>
      </section>

      <section className="help-container">
        {/* Support Cards */}
        <div className="support-cards-section">
          <div className="support-card">
            <div className="card-icon">☎️</div>
            <h3>Contact Support</h3>
            <p>Call our help desk for navigation assistance.<br/>+91-98765-43200</p>
          </div>

          <div className="support-card">
            <div className="card-icon">🏢</div>
            <h3>Help Desk Location</h3>
            <p>Ground Floor near the Main Entrance.</p>
          </div>

          <div className="support-card">
            <div className="card-icon">🚑</div>
            <h3>Emergency Help</h3>
            <p>Quick route guidance to emergency ward.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-items">
            {[
              {
                q: 'Where can I find my doctor\'s room?',
                a: 'Use the doctor search option on the home page to find the location.'
              },
              {
                q: 'How do I use QR navigation?',
                a: 'Scan QR codes placed in hospital corridors to detect your location.'
              },
              {
                q: 'Where is the pharmacy located?',
                a: 'You can find the pharmacy using the facility locator.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`faq-item ${selectedFaq === index ? 'active' : ''}`}
                onClick={() => handleFaqClick(index)}
              >
                <h3>{faq.q}</h3>
                {selectedFaq === index && <p>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Query Form */}
        <div className="query-section">
          <h2>Send Us Your Query</h2>
          <form className="query-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleFormChange}
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Help;
