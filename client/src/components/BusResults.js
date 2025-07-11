import React from 'react';
import moment from 'moment';
import { FaBus, FaClock, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';

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
              {index === 0 && (
                <div className="next-bus-badge">
                  NEXT BUS
                </div>
              )}
            </div>

            <div className="bus-timing">
              <div className="timing-info">
                <div className="departure-info">
                  <FaClock className="time-icon" />
                  <div>
                    <span className="time-label">Departure</span>
                    <span className="time-value">{formatTime(bus.nextDeparture)}</span>
                    <span className="time-until">
                      in {formatTimeUntil(bus.timeUntilDeparture)}
                    </span>
                  </div>
                </div>
                
                <div className="arrival-info">
                  <FaMapMarkerAlt className="arrival-icon" />
                  <div>
                    <span className="time-label">Arrival</span>
                    <span className="time-value">{formatTime(bus.arrivalTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bus-route-info">
              <span className="route-text">
                Perdoor → {bus.route}
              </span>
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