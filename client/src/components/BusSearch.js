import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';

const BusSearch = ({ onSearch, loading }) => {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.length > 1) {
        try {
          const response = await axios.get(`/api/routes/search/${destination}`);
          setSuggestions(response.data.routes);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [destination]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDestination(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="destination-input-container">
            <div className="input-icon">
              <FaMapMarkerAlt />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              className="destination-input"
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FaMapMarkerAlt className="suggestion-icon" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="search-btn"
            disabled={loading || !destination.trim()}
          >
            {loading ? (
              <FaSpinner className="spinner" />
            ) : (
              <FaSearch />
            )}
            {loading ? 'Searching...' : 'Find Buses'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusSearch;