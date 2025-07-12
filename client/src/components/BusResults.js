import React from 'react';
import moment from 'moment';
import { FaBus, FaClock, FaArrowLeft, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

  const nextBus = upcomingBuses[0];
  const otherBuses = upcomingBuses.slice(1, 4); // Show only next 3 additional buses

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

      {/* Next Bus - Prominently Displayed */}
      <div className="next-bus-section">
        <h3 className="next-bus-title">Next Bus</h3>
        <div className="next-bus-card">
          <div className="next-bus-header">
            <div className="next-bus-info">
              <h3 className="bus-name">{nextBus.busName}</h3>
              <span className="bus-number">{nextBus.busNumber}</span>
            </div>
            <div className="next-bus-badge">
              NEXT BUS
            </div>
          </div>

          <div className="next-bus-timing">
            <div className="next-bus-time">
              <FaClock className="time-icon" />
              <div className="time-details">
                <span className="time-label">Departure</span>
                <span className="time-value">{formatTime(nextBus.nextDeparture)}</span>
                <span className="time-until">
                  in {formatTimeUntil(nextBus.timeUntilDeparture)}
                </span>
              </div>
            </div>
            
            <div className="next-bus-arrival">
              <FaMapMarkerAlt className="arrival-icon" />
              <div className="arrival-details">
                <span className="time-label">Arrival</span>
                <span className="time-value">{formatTime(nextBus.arrivalTime)}</span>
              </div>
            </div>
          </div>

          {nextBus.timeUntilDeparture <= 10 && (
            <div className="urgent-alert">
              <FaExclamationTriangle />
              <span>Bus leaving soon!</span>
            </div>
          )}
        </div>
      </div>

      {/* Other Upcoming Buses */}
      {otherBuses.length > 0 && (
        <div className="other-buses-section">
          <h3 className="other-buses-title">More Buses</h3>
          <div className="other-buses-grid">
            {otherBuses.map((bus, index) => (
              <div key={`${bus._id}-${index}`} className="other-bus-card">
                <div className="other-bus-header">
                  <h4 className="bus-name">{bus.busName}</h4>
                  <span className="bus-number">{bus.busNumber}</span>
                </div>

                <div className="other-bus-timing">
                  <div className="timing-item">
                    <FaClock className="time-icon" />
                    <span>{formatTime(bus.nextDeparture)}</span>
                  </div>
                  <div className="timing-item">
                    <FaMapMarkerAlt className="arrival-icon" />
                    <span>{formatTime(bus.arrivalTime)}</span>
                  </div>
                </div>

                <div className="time-until">
                  in {formatTimeUntil(bus.timeUntilDeparture)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingBuses.length > 4 && (
        <div className="more-buses-note">
          <p>+{upcomingBuses.length - 4} more buses available today</p>
        </div>
      )}
    </div>
  );
};

export default BusResults;