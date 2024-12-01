import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/operatorRoute/operator');
      // Handle both array and object responses
      const operatorData = response.data;
      if (Array.isArray(operatorData)) {
        setOperators(operatorData);
      } else if (operatorData && typeof operatorData === 'object') {
        setOperators(operatorData.operators || []);
      } else {
        setOperators([]);
      }
    } catch (err) {
      setError('Failed to fetch operators: ' + (err.response?.data?.message || err.message));
      console.error('Fetch operators error:', err);
      setOperators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.name || !formData.email || !formData.contact || !formData.address) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone number (basic validation)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contact)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (editingId) {
        await api.put(`/operatorRoute/operator/${editingId}`, formData);
      } else {
        await api.post('/operatorRoute/operator', formData);
      }
      
      await fetchOperators();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        contact: '',
        address: ''
      });
      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to ${editingId ? 'update' : 'create'} operator: ${errorMessage}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this operator?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/operatorRoute/operator/${id}`);
      await fetchOperators();
    } catch (err) {
      setError('Failed to delete operator: ' + (err.response?.data?.message || err.message));
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (operator) => {
    if (!operator || !operator._id) {
      console.error('Invalid operator data for editing');
      return;
    }

    setFormData({
      name: operator.name || '',
      email: operator.email || '',
      contact: operator.contact || '',
      address: operator.address || ''
    });
    setEditingId(operator._id);
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
        <h1 className="text-2xl font-bold">Operator Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-DarkGreen text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-LightGreen transition-colors"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add Operator'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-DarkGreen text-white px-4 py-2 rounded-lg hover:bg-LightGreen transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update Operator' : 'Add Operator'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(operators) && operators.length > 0 ? (
              operators.map((operator) => (
                <tr key={operator._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{operator.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{operator.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{operator.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{operator.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(operator)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(operator._id)}
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
                  {loading ? 'Loading operators...' : 'No operators found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorManagement;
