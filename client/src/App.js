import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BusSearch from './components/BusSearch';
import BusResults from './components/BusResults';
import Header from './components/Header';
import PopularRoutes from './components/PopularRoutes';

function App() {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBuses = async (route) => {
    if (!route.trim()) {
      setError('Please enter a destination');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/buses/route/${encodeURIComponent(route)}`);
      setBusData(response.data);
      setSelectedRoute(route);
    } catch (err) {
      setError('Error fetching bus information. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    searchBuses(route);
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h1>Welcome to Perdoor</h1>
            <p className="hero-subtitle">
              Find the next available bus to your destination
            </p>
          </div>

          <BusSearch 
            onSearch={searchBuses}
            loading={loading}
          />

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {!busData && !loading && (
            <PopularRoutes onRouteSelect={handleRouteSelect} />
          )}

          {busData && (
            <BusResults 
              data={busData}
              onNewSearch={() => {
                setBusData(null);
                setSelectedRoute('');
              }}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Perdoor Bus Timing. Helping travelers since 2024.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;