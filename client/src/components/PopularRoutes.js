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

        const rawRoutes = allRoutesResponse.data.routes || [];

        // Handle both strings and objects
        const uniqueRoutes = Array.isArray(rawRoutes) && typeof rawRoutes[0] === 'object'
          ? [...new Set(rawRoutes.map(bus => bus.route))] // from object array
          : [...new Set(rawRoutes)]; // from string array

        setAllRoutes(uniqueRoutes.sort());
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
          <FaSpinner className="spinner animate-spin text-2xl text-gray-500" />
          <p>Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-routes-section">
      {allRoutes.length > 0 && (
        <div className="all-routes">
          <h3>All Available Routes</h3>
          <div className="routes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {allRoutes.slice(0, 12).map((route, index) => (
              <button
                key={index}
                className="route-card p-3 bg-white shadow-md rounded-lg flex items-center gap-2 hover:bg-blue-100 transition"
                onClick={() => onRouteSelect(route)}
              >
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="route-name font-medium">{route}</span>
              </button>
            ))}
          </div>
          {allRoutes.length > 12 && (
            <p className="more-routes-text mt-2 text-sm text-gray-500">
              And {allRoutes.length - 12} more destinations...
            </p>
          )}
        </div>
      )}

      {allRoutes.length === 0 && (
        <div className="no-routes text-center mt-10">
          <FaMapMarkerAlt className="no-routes-icon text-4xl text-gray-400 mb-2" />
          <h3 className="text-xl font-semibold">No Routes Available</h3>
          <p className="text-gray-500">Please contact administrator to add bus routes.</p>
        </div>
      )}
    </div>
  );
};

export default PopularRoutes;
