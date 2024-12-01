import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUserTie, FaBus, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import api from '../utils/api';

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalOperators: 0,
    activeBuses: 0,
    totalRoutes: 0
  });

  useEffect(() => {
    fetchOperators();
  }, []);

  // Update stats whenever operators change
  useEffect(() => {
    updateStats();
  }, [operators]);

  const updateStats = () => {
    setStats(prevStats => ({
      ...prevStats,
      totalOperators: operators.length,
      // You might want to fetch these from their respective endpoints
      activeBuses: prevStats.activeBuses,
      totalRoutes: prevStats.totalRoutes
    }));
  };

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/operatorRoute/operator');
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

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.contact.includes(searchTerm)
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Operators</p>
              <h3 className="text-white text-2xl font-bold">{stats.totalOperators}</h3>
            </div>
            <FaUserTie className="text-white text-3xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Active Buses</p>
              <h3 className="text-white text-2xl font-bold">{stats.activeBuses}</h3>
            </div>
            <FaBus className="text-white text-3xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Total Routes</p>
              <h3 className="text-white text-2xl font-bold">{stats.totalRoutes}</h3>
            </div>
            <FaBus className="text-white text-3xl opacity-80" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Operator Management</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Operator'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <FaUserTie className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>{editingId ? 'Update Operator' : 'Add Operator'}</>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 text-green-600 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading operators...
                    </div>
                  </td>
                </tr>
              ) : filteredOperators.length > 0 ? (
                filteredOperators.map((operator) => (
                  <tr key={operator._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{operator.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{operator.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{operator.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{operator.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(operator)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(operator._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No operators found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OperatorManagement;
