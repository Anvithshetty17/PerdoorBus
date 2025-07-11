import React from 'react';
import moment from 'moment';
import { FaBus, FaClock, FaRupeeSign, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';

const BusResults = ({ data, onNewSearch }) => {
  const { route, upcomingBuses, currentTime } = data;

  const formatTimeUntil = (minutes) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  const getBusTypeColor = (busType) => {
    const colors = {
      'Ordinary': '#28a745',
      'Deluxe': '#007bff',
      'AC': '#17a2b8',
      'Volvo': '#6f42c1',
      'Private': '#fd7e14'
    };
    return colors[busType] || '#6c757d';
  };

  if (!upcomingBuses || upcomingBuses.length === 0) {
    return (
      <div className="results-section">
        <div className="results-header">
          <button onClick={onNewSearch} className="back-btn">
            <FaArrowLeft /> Back to Search
          </button>
          <h2>No Buses Found</h2>
        </div>
        <div className="no-buses">
          <FaBus className="no-buses-icon" />
          <p>Sorry, no buses found for route: <strong>{route}</strong></p>
          <p>Please check the route name or try searching for a different destination.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section">
      <div className="results-header">
        <button onClick={onNewSearch} className="back-btn">
          <FaArrowLeft /> Back to Search
        </button>
        <div className="route-info">
          <h2>
            <FaMapMarkerAlt className="route-icon" />
            Perdoor → {route}
          </h2>
          <p className="current-time">Current Time: {currentTime}</p>
        </div>
      </div>

      <div className="buses-grid">
        {upcomingBuses.map((bus, index) => (
          <div key={`${bus._id}-${index}`} className="bus-card">
            <div className="bus-card-header">
              <div className="bus-info">
                <h3 className="bus-name">{bus.busName}</h3>
                <span className="bus-number">{bus.busNumber}</span>
              </div>
              <div 
                className="bus-type-badge"
                style={{ backgroundColor: getBusTypeColor(bus.busType) }}
              >
                {bus.busType}
              </div>
            </div>

            <div className="bus-timing">
              <div className="departure-time">
                <FaClock className="time-icon" />
                <div>
                  <span className="next-departure">{bus.nextDeparture}</span>
                  <span className="time-until">
                    in {formatTimeUntil(bus.timeUntilDeparture)}
                  </span>
                </div>
              </div>
              
              {index === 0 && (
                <div className="next-bus-indicator">
                  NEXT BUS
                </div>
              )}
            </div>

            <div className="bus-details">
              <div className="detail-item">
                <FaRupeeSign className="detail-icon" />
                <span>₹{bus.fare}</span>
              </div>
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <span>{bus.duration}</span>
              </div>
              {bus.frequency && (
                <div className="detail-item">
                  <span className="frequency-text">
                    Every {bus.frequency} mins
                  </span>
                </div>
              )}
            </div>

            {bus.timeUntilDeparture <= 10 && (
              <div className="urgent-alert">
                ⚠️ Bus leaving soon!
              </div>
            )}
          </div>
        ))}
      </div>

      {upcomingBuses.length >= 10 && (
        <div className="more-buses-note">
          <p>Showing next 10 buses. More buses may be available throughout the day.</p>
        </div>
      )}
    </div>
  );
};

export default BusResults;