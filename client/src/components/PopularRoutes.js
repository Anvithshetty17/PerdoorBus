import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaStar, FaSpinner } from 'react-icons/fa';

const PopularRoutes = ({ onRouteSelect }) => {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const [popularResponse, allRoutesResponse] = await Promise.all([
          axios.get('/api/routes/popular'),
          axios.get('/api/buses/routes')
        ]);
        
        setPopularRoutes(popularResponse.data.popularRoutes || []);
        setAllRoutes(allRoutesResponse.data.routes || []);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="popular-routes-section">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-routes-section">
      {popularRoutes.length > 0 && (
        <div className="popular-routes">
          <h3>
            <FaStar className="star-icon" />
            Popular Destinations
          </h3>
          <div className="routes-grid">
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                className="route-card popular"
                onClick={() => onRouteSelect(route.route)}
              >
                <FaMapMarkerAlt className="route-icon" />
                <span className="route-name">{route.route}</span>
                <span className="bus-count">{route.busCount} buses</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {allRoutes.length > 0 && (
        <div className="all-routes">
          <h3>All Available Routes</h3>
          <div className="routes-grid">
            {allRoutes.slice(0, 12).map((route, index) => (
              <button
                key={index}
                className="route-card"
                onClick={() => onRouteSelect(route)}
              >
                <FaMapMarkerAlt className="route-icon" />
                <span className="route-name">{route}</span>
              </button>
            ))}
          </div>
          {allRoutes.length > 12 && (
            <p className="more-routes-text">
              And {allRoutes.length - 12} more destinations...
            </p>
          )}
        </div>
      )}

      {allRoutes.length === 0 && (
        <div className="no-routes">
          <FaMapMarkerAlt className="no-routes-icon" />
          <h3>No Routes Available</h3>
          <p>Please contact administrator to add bus routes.</p>
        </div>
      )}
    </div>
  );
};

export default PopularRoutes;