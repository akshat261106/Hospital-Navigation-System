import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h2>Hospital Navigation</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/facilities">Facilities</Link>
        <Link to="/help">Help</Link>
      </nav>
    </header>
  );
};

export default Header;
