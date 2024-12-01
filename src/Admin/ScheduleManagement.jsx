import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    fare: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/scheduleRoute/schedules');
      const scheduleData = response.data;
      
      // Handle different response formats
      if (Array.isArray(scheduleData)) {
        setSchedules(scheduleData);
      } else if (scheduleData && typeof scheduleData === 'object') {
        setSchedules(scheduleData.schedules || scheduleData.data || []);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      setError('Failed to fetch schedules: ' + (err.response?.data?.message || err.message));
      console.error('Fetch schedules error:', err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await api.get('/busRoute/buses');
      const busData = response.data;
      if (Array.isArray(busData)) {
        setBuses(busData);
      } else if (busData && typeof busData === 'object') {
        setBuses(busData.buses || busData.data || []);
      } else {
        setBuses([]);
      }
    } catch (err) {
      console.error('Failed to fetch buses:', err);
      setBuses([]);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routeRoute/routes');
      const routeData = response.data;
      if (Array.isArray(routeData)) {
        setRoutes(routeData);
      } else if (routeData && typeof routeData === 'object') {
        setRoutes(routeData.routes || routeData.data || []);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error('Failed to fetch routes:', err);
      setRoutes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.busId || !formData.routeId || !formData.departureTime || !formData.arrivalTime || !formData.fare) {
        throw new Error('Please fill in all required fields');
      }

      // Validate times
      const departure = new Date(formData.departureTime);
      const arrival = new Date(formData.arrivalTime);
      if (arrival <= departure) {
        throw new Error('Arrival time must be after departure time');
      }

      // Validate fare
      const fare = parseFloat(formData.fare);
      if (isNaN(fare) || fare <= 0) {
        throw new Error('Fare must be a positive number');
      }

      const processedData = {
        ...formData,
        fare: fare
      };

      if (editingId) {
        await api.put(`/scheduleRoute/schedules/${editingId}`, processedData);
      } else {
        await api.post('/scheduleRoute/schedules', processedData);
      }

      await fetchSchedules();
      setShowForm(false);
      setFormData({
        busId: '',
        routeId: '',
        departureTime: '',
        arrivalTime: '',
        fare: ''
      });
      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to ${editingId ? 'update' : 'create'} schedule: ${errorMessage}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/scheduleRoute/schedules/${id}`);
      await fetchSchedules();
    } catch (err) {
      setError('Failed to delete schedule: ' + (err.response?.data?.message || err.message));
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    if (!schedule || !schedule._id) {
      console.error('Invalid schedule data for editing');
      return;
    }

    setFormData({
      busId: schedule.busId || '',
      routeId: schedule.routeId || '',
      departureTime: schedule.departureTime ? new Date(schedule.departureTime).toISOString().slice(0, 16) : '',
      arrivalTime: schedule.arrivalTime ? new Date(schedule.arrivalTime).toISOString().slice(0, 16) : '',
      fare: schedule.fare?.toString() || ''
    });
    setEditingId(schedule._id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-DarkGreen text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-LightGreen transition-colors"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add Schedule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus</label>
              <select
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              >
                <option value="">Select Bus</option>
                {Array.isArray(buses) && buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.busNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Route</label>
              <select
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              >
                <option value="">Select Route</option>
                {Array.isArray(routes) && routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.source} to {route.destination}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departure Time</label>
              <input
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
              <input
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fare</label>
              <input
                type="number"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-DarkGreen text-white px-4 py-2 rounded-lg hover:bg-LightGreen transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(schedules) && schedules.length > 0 ? (
              schedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {buses.find(bus => bus._id === schedule.busId)?.busNumber || 'Unknown Bus'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const route = routes.find(route => route._id === schedule.routeId);
                      return route ? `${route.source} to ${route.destination}` : 'Unknown Route';
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(schedule.departureTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(schedule.arrivalTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{schedule.fare}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Loading schedules...' : 'No schedules found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;
