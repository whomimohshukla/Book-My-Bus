import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: { name: '', state: '', cityId: '' },
    destination: { name: '', state: '', cityId: '' },
    distance: '',
    pricePerKm: '',
    viaStops: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchCities();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/busTravelRoute/Travelroutes');
      
      if (Array.isArray(response.data)) {
        setRoutes(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setRoutes(response.data.routes || []);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to fetch routes: ' + (err.response?.data?.message || err.message));
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get('/city/getAllCities');
      if (Array.isArray(response.data)) {
        setCities(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setCities(response.data.cities || []);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // For editing, use the existing cityIds from formData
      const payload = {
        source: editingId ? formData.source : {
          cityId: cities.find(city => city.name === formData.source.name)?._id,
          name: formData.source.name,
          state: formData.source.state
        },
        destination: editingId ? formData.destination : {
          cityId: cities.find(city => city.name === formData.destination.name)?._id,
          name: formData.destination.name,
          state: formData.destination.state
        },
        distance: Number(formData.distance),
        pricePerKm: Number(formData.pricePerKm),
        viaStops: formData.viaStops
      };

      if (!payload.source.cityId || !payload.destination.cityId) {
        throw new Error('Source or destination city not found');
      }

      if (editingId) {
        await api.put(`/busTravelRoute/Travelroutes/${editingId}`, payload);
      } else {
        await api.post('/busTravelRoute/Travelroutes', payload);
      }

      await fetchRoutes();
      setShowForm(false);
      setFormData({
        source: { name: '', state: '', cityId: '' },
        destination: { name: '', state: '', cityId: '' },
        distance: '',
        pricePerKm: '',
        viaStops: []
      });
      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to ${editingId ? 'update' : 'create'} route: ${errorMessage}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/busTravelRoute/Travelroutes/${id}`);
      await fetchRoutes();
    } catch (err) {
      setError('Failed to delete route: ' + (err.response?.data?.message || err.message));
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    if (!route || !route._id) {
      console.error('Invalid route data for editing');
      return;
    }

    // Set form data with complete route information
    setFormData({
      source: {
        name: route.source.name,
        state: route.source.state,
        cityId: route.source.cityId
      },
      destination: {
        name: route.destination.name,
        state: route.destination.state,
        cityId: route.destination.cityId
      },
      distance: route.distance?.toString() || '',
      pricePerKm: route.pricePerKm?.toString() || '',
      viaStops: route.viaStops || []
    });
    setEditingId(route._id);
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
        <h1 className="text-2xl font-bold">Route Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add Route'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source City</label>
              <select
                value={formData.source.name}
                onChange={(e) => {
                  const city = cities.find(c => c.name === e.target.value);
                  setFormData({
                    ...formData,
                    source: {
                      name: city?.name || '',
                      state: city?.state || '',
                      cityId: city?._id || ''
                    }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Source City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.name}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination City</label>
              <select
                value={formData.destination.name}
                onChange={(e) => {
                  const city = cities.find(c => c.name === e.target.value);
                  setFormData({
                    ...formData,
                    destination: {
                      name: city?.name || '',
                      state: city?.state || '',
                      cityId: city?._id || ''
                    }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Destination City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.name}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per km (₹)</label>
              <input
                type="number"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update Route' : 'Add Route'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/km</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.length > 0 ? (
              routes.map((route) => (
                <tr key={route._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {route.source.name}, {route.source.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {route.destination.name}, {route.destination.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {route.distance} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{route.pricePerKm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Loading routes...' : 'No routes found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteManagement;
