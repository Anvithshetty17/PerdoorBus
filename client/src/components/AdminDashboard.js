import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBus, 
  FaSignOutAlt, 
  FaSpinner,
  FaSave,
  FaTimes,
  FaClock,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const AdminDashboard = ({ adminData, adminToken, onLogout }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [busForm, setBusForm] = useState({
    busName: '',
    route: '',
    arrivalTime: '',
    isActive: true
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/buses', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setBuses(response.data.buses);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setError('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBusForm({
      busName: '',
      route: '',
      arrivalTime: '',
      isActive: true
    });
    setShowAddForm(false);
    setEditingBus(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBusForm({
      ...busForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingBus) {
        await axios.put(`/api/admin/buses/${editingBus._id}`, busForm, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setSuccess('Bus updated successfully!');
      } else {
        await axios.post('/api/admin/buses', busForm, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setSuccess('Bus added successfully!');
      }
      
      fetchBuses();
      resetForm();
    } catch (error) {
      console.error('Error saving bus:', error);
      setError(error.response?.data?.message || 'Failed to save bus');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setBusForm({
      busName: bus.busName,
      route: bus.route,
      arrivalTime: bus.arrivalTime,
      isActive: bus.isActive
    });
    setEditingBus(bus);
    setShowAddForm(true);
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/buses/${busId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSuccess('Bus deleted successfully!');
      fetchBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      setError('Failed to delete bus');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <FaBus className="dashboard-icon" />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage bus routes and schedules</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus /> Add New Bus
          </button>
          <button 
            className="btn-secondary"
            onClick={onLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError('')}><FaTimes /></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <p>{success}</p>
          <button onClick={() => setSuccess('')}><FaTimes /></button>
        </div>
      )}

      {(showAddForm || editingBus) && (
        <div className="modal-overlay">
          <div className="bus-form-modal">
            <div className="modal-header">
              <h3>
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h3>
              <button 
                className="modal-close"
                onClick={resetForm}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bus-form">
              <div className="form-group">
                <label>Bus Name *</label>
                <input
                  type="text"
                  name="busName"
                  value={busForm.busName}
                  onChange={handleInputChange}
                  placeholder="e.g., Perdoor Express"
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination Route *</label>
                <input
                  type="text"
                  name="route"
                  value={busForm.route}
                  onChange={handleInputChange}
                  placeholder="e.g., Thiruvananthapuram"
                  required
                />
              </div>

              <div className="form-group">
                <label>Arrival Time *</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={busForm.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={busForm.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Active Bus
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingBus ? 'Update Bus' : 'Add Bus'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="buses-section">
        <div className="section-header">
          <h2>All Buses ({buses.length})</h2>
        </div>

        {loading && !showAddForm ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading buses...</p>
          </div>
        ) : (
          <div className="buses-grid">
            {buses.map((bus) => (
              <div key={bus._id} className="bus-admin-card">
                <div className="bus-card-header">
                  <div className="bus-main-info">
                    <h3>{bus.busName}</h3>
                  </div>
                  <div className="bus-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(bus)}
                      title="Edit Bus"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(bus._id)}
                      title="Delete Bus"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="bus-route">
                  <FaMapMarkerAlt className="route-icon" />
                  <span>Perdoor → {bus.route}</span>
                </div>

                <div className="bus-timing">
                  <div className="time-info">
                    <FaClock className="time-icon" />
                    <div className="times">
                      <span className="arrival">
                        Arrival: {formatTime(bus.arrivalTime)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bus-status">
                  <span className={`status-badge ${bus.isActive ? 'active' : 'inactive'}`}>
                    {bus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}

            {buses.length === 0 && (
              <div className="empty-state">
                <FaBus className="empty-icon" />
                <h3>No buses found</h3>
                <p>Add your first bus to get started</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddForm(true)}
                >
                  <FaPlus /> Add Bus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;