import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUserTie, FaBus, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import api from '../utils/api';

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    const totalBuses = operators.reduce((sum, op) => sum + (op.totalBuses || 0), 0);
    const totalRoutes = operators.reduce((sum, op) => sum + (op.activeRoutes || 0), 0);
    
    setStats({
      totalOperators: operators.length,
      activeBuses: totalBuses,
      totalRoutes: totalRoutes
    });
  };

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const response = await api.get('/operatorRoute/operator');
      const operatorData = response.data;
      // console.log('Operator API Response:', operatorData);

      if (operatorData && operatorData.data && Array.isArray(operatorData.data)) {
        const transformedOperators = operatorData.data.map(operator => ({
          _id: operator._id,
          name: operator.name || '',
          email: operator.email || '',
          contact: operator.contact || '',
          address: operator.address || '',
          totalBuses: operator.totalBuses || 0,
          activeRoutes: operator.activeRoutes || 0
        }));
        // console.log('Transformed operators:', transformedOperators);
        setOperators(transformedOperators);
      } else {
        console.error('Unexpected API response structure:', operatorData);
        setOperators([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch operators: ' + errorMessage);
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
      setSuccessMessage(null);

      // Form validation
      const validationErrors = [];
      
      if (!formData.name?.trim()) validationErrors.push('Name is required');
      if (!formData.email?.trim()) validationErrors.push('Email is required');
      if (!formData.contact?.trim()) validationErrors.push('Contact number is required');
      if (!formData.address?.trim()) validationErrors.push('Address is required');

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email.trim())) {
        validationErrors.push('Please enter a valid email address');
      }

      // Phone validation - allow numbers with optional +, -, or spaces
      const phoneRegex = /^[+]?[\s0-9-]{10,}$/;
      const cleanedPhone = formData.contact?.replace(/[\s-]/g, '');
      if (formData.contact && (!phoneRegex.test(formData.contact.trim()) || cleanedPhone.length < 10)) {
        validationErrors.push('Please enter a valid phone number (minimum 10 digits)');
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Clean and format the data
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        contact: cleanedPhone,
        address: formData.address.trim(),
        status: 'Active',
        totalBuses: 0,
        activeRoutes: 0
      };

      // Log the payload for debugging
      // console.log('Submitting operator payload:', payload);

      let response;
      if (editingId) {
        response = await api.put(`/operatorRoute/operator/${editingId}`, payload);
      } else {
        response = await api.post('/operatorRoute/operator', payload);
      }

      // Log the response
      // console.log('API Response:', response.data);
      
      await fetchOperators();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        contact: '',
        address: ''
      });
      setEditingId(null);
      setSuccessMessage(`Operator successfully ${editingId ? 'updated' : 'created'}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to ${editingId ? 'update' : 'create'} operator: ${errorMessage}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Find the operator name for better user feedback
    const operator = operators.find(op => op._id === id);
    if (!id || !operator) {
      setError('Invalid operator selected for deletion');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the operator "${operator.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Check if operator has any buses assigned
      if (operator.totalBuses > 0) {
        throw new Error(`Cannot delete operator "${operator.name}" because they have ${operator.totalBuses} buses assigned. Please reassign or delete the buses first.`);
      }

      await api.delete(`/operatorRoute/operator/${id}`);
      await fetchOperators();
      
      setSuccessMessage(`Operator "${operator.name}" was successfully deleted`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to delete operator "${operator.name}": ${errorMessage}`);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (operator) => {
    if (!operator || !operator._id) {
      // console.error('Invalid operator data for editing');
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
    <div className="min-h-screen bg-gray-50 py-6 mt-20 px-4 sm:px-6 lg:px-8">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-roboto">Total Operators</p>
              <h3 className="text-white text-2xl font-bold font-poppins">{stats.totalOperators}</h3>
            </div>
            <FaUserTie className="text-white text-3xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-roboto">Active Buses</p>
              <h3 className="text-white text-2xl font-bold font-poppins">{stats.activeBuses}</h3>
            </div>
            <FaBus className="text-white text-3xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary-400 to-primary-500 p-4 rounded-lg shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-roboto">Total Routes</p>
              <h3 className="text-white text-2xl font-bold font-poppins">{stats.totalRoutes}</h3>
            </div>
            <FaBus className="text-white text-3xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="block sm:inline font-roboto">{error}</span>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="block sm:inline font-roboto">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 font-poppins">Operator Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10 font-roboto"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors w-full sm:w-auto font-roboto"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Operator'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Name</label>
              <div className="relative">
                <FaUserTie className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-roboto"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-roboto"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Phone</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-roboto"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-roboto"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 font-roboto"
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
            <thead className="bg-primary-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider font-roboto">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider hidden sm:table-cell font-roboto">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider font-roboto">Phone</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider hidden md:table-cell font-roboto">Address</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider font-roboto">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 sm:px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 text-primary-500 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading operators...
                    </div>
                  </td>
                </tr>
              ) : filteredOperators.length > 0 ? (
                filteredOperators.map((operator) => (
                  <tr key={operator._id} className="hover:bg-primary-50 transition-colors duration-150 ease-in-out">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaUserTie className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-roboto">{operator.name}</div>
                          <div className="text-sm text-gray-500 font-roboto sm:hidden">{operator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900 font-roboto">{operator.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-roboto">{operator.contact}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 font-roboto">{operator.address}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleEdit(operator)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 flex items-center gap-1 font-roboto"
                          title="Edit operator"
                        >
                          <FaEdit className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(operator._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 flex items-center gap-1 font-roboto"
                          title="Delete operator"
                        >
                          <FaTrash className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 sm:px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaUserTie className="h-12 w-12 mb-4 text-gray-400" />
                      <p className="text-lg font-medium font-roboto mb-1">
                        {searchTerm ? 'No matching operators found' : 'No operators added yet'}
                      </p>
                      <p className="text-sm text-gray-400 font-roboto">
                        {searchTerm ? 'Try adjusting your search' : 'Click the "Add Operator" button to add one'}
                      </p>
                    </div>
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
