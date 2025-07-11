import React from 'react';
import { FaBus, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <FaBus className="logo-icon" />
            <h2>Perdoor Bus Timing</h2>
          </div>
          
          <div className="header-info">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>From: Perdoor</span>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <span id="current-time">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;