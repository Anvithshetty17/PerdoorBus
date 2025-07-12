import React from 'react';
import { FaBus, FaClock, FaMapMarkerAlt, FaUserShield, FaHome, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ currentView, onAdminClick, onHomeClick, adminData }) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={onHomeClick}>
            <FaBus className="logo-icon" />
            <div className="logo-text">
              <h2>Perdoor Bus Timing</h2>
              <span className="logo-subtitle">Live Bus Information</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="header-info">
              
              <div className="info-item">
                <FaClock className="info-icon" />
                <span>{getCurrentTime()}</span>
              </div>
            </div>
            <div  className="header-actions">
            {currentView === 'admin-dashboard' && adminData ? (
              <div className="admin-section">
                <div className="admin-welcome">
                  <FaUserShield className="admin-icon" />
                  <span>Welcome, {adminData.username}</span>
                </div>
              </div>
            ) : (
              <div className="nav-buttons">
                {currentView !== 'home' && (
                  <button className="nav-btn" onClick={onHomeClick}>
                    <FaHome /> Home
                  </button>
                )}
                {currentView === 'home' && (
                  <button className="nav-btn admin-btn" onClick={onAdminClick}>
                    <FaUserShield /> Admin
                  </button>
                )}
              </div>
            )}
          </div>
          </div>

          
        </div>
      </div>
    </header>
  );
};

export default Header;