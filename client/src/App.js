import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BusSearch from './components/BusSearch';
import BusResults from './components/BusResults';
import Header from './components/Header';
import PopularRoutes from './components/PopularRoutes';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin-login', 'admin-dashboard'
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [adminData, setAdminData] = useState(null);

  // Check if admin is logged in on component mount
  useEffect(() => {
    if (adminToken) {
      verifyAdmin();
    }
  }, [adminToken]);

  // Check URL for admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      if (adminToken) {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('admin-login');
      }
    } else {
      setCurrentView('home');
    }
  }, [adminToken]);

  const verifyAdmin = async () => {
    try {
      const response = await axios.get('/api/admin/profile', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setAdminData(response.data.admin);
    } catch (error) {
      console.error('Admin verification failed:', error);
      handleAdminLogout();
    }
  };

  const handleAdminLogin = (token, admin) => {
    setAdminToken(token);
    setAdminData(admin);
    localStorage.setItem('adminToken', token);
    setCurrentView('admin-dashboard');
    window.history.pushState({}, '', '/admin');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminData(null);
    localStorage.removeItem('adminToken');
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

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

  const renderContent = () => {
    switch (currentView) {
      case 'admin-login':
        return (
          <AdminLogin 
            onLogin={handleAdminLogin}
            onBack={() => {
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          />
        );
      
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            adminData={adminData}
            adminToken={adminToken}
            onLogout={handleAdminLogout}
          />
        );
      
      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div className="App">
      <Header 
        currentView={currentView}
        onHomeClick={() => {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }}
        adminData={adminData}
      />
      
      <main className="main-content">
        <div className="container">
          {renderContent()}
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