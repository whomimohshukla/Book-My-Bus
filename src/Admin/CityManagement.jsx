import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaStar, FaSearch, FaCheck, FaCity, FaBus, FaMapMarkedAlt } from 'react-icons/fa';
import api from '../utils/api';
// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    isPopular: false
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('city/getAllCities');
      
      if (response.data && Array.isArray(response.data)) {
        setCities(response.data);
      } else if (response.data && response.data.cities && Array.isArray(response.data.cities)) {
        setCities(response.data.cities);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setCities([]);
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      setError('Failed to fetch cities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/city/${editingId}`, formData);
      } else {
        await api.post('/city/createCity', formData);
      }
      setShowForm(false);
      setFormData({
        name: '',
        state: '',
        isPopular: false
      });
      setEditingId(null);
      fetchCities();
    } catch (error) {
      console.error('Error saving city:', error);
      alert('Failed to save city. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        await api.delete(`/city/${id}`);
        fetchCities();
      } catch (error) {
        console.error('Error deleting city:', error);
        alert('Failed to delete city. Please try again.');
      }
    }
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-poppins">City Management</h1>
              <p className="mt-2 text-sm text-gray-600 font-roboto">Manage your bus service cities and popular routes</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
              font-medium text-white bg-[#349E4D] hover:bg-[#2C8440] hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
              transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto"
            >
              <FaPlus className="mr-2 -ml-1 h-5 w-5" />
              Add New City
            </button>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-[#349E4D]/10 to-[#2C8440]/10 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaCity className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Total Cities</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 font-poppins">
                          {cities.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#349E4D]/10 to-[#2C8440]/10 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaStar className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Popular Cities</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 font-poppins">
                          {cities.filter(city => city.isPopular).length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#349E4D]/10 to-[#2C8440]/10 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaBus className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Active Routes</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 font-poppins">
                          {cities.length * 2}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#349E4D]/10 to-[#2C8440]/10 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaMapMarkedAlt className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">States Covered</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 font-poppins">
                          {new Set(cities.map(city => city.state)).size}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar with Info */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h2 className="text-lg font-medium text-gray-800 mb-2 sm:mb-0 font-poppins">Search Cities</h2>
              <p className="text-sm text-gray-600 font-roboto">
                Showing {filteredCities.length} of {cities.length} cities
              </p>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-[#349E4D]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 focus:ring-[#349E4D] focus:border-[#349E4D] block w-full pl-10 pr-12 
                sm:text-sm border-gray-300 rounded-md bg-white shadow-sm 
                transition-all duration-300 ease-in-out
                hover:shadow-md hover:bg-gray-50 hover:border-[#349E4D]
                font-roboto"
                placeholder="Search cities..."
              />
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">
              {editingId ? 'Edit City' : 'Add New City'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">City Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-[#349E4D] focus:border-[#349E4D] 
                    hover:border-[#349E4D] hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                    placeholder="Enter city name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#349E4D] mt-6">
                    {formData.name && <FaCheck className="h-5 w-5" />}
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-[#349E4D] focus:border-[#349E4D] 
                    hover:border-[#349E4D] hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                    placeholder="Enter state name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#349E4D] mt-6">
                    {formData.state && <FaCheck className="h-5 w-5" />}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="h-5 w-5 text-[#349E4D] focus:ring-[#349E4D] border-gray-300 
                    rounded transition-all duration-300 ease-in-out cursor-pointer
                    hover:border-[#349E4D] hover:shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-800 flex items-center font-roboto">
                    <FaStar className="h-4 w-4 text-[#349E4D] mr-2" />
                    Mark as Popular City
                  </span>
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', state: '', isPopular: false });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm 
                  text-base font-medium rounded-md text-gray-800 bg-white 
                  hover:bg-gray-50 hover:shadow-md hover:border-[#349E4D]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
                  transition-all duration-300 ease-in-out font-roboto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md 
                  shadow-sm text-base font-medium text-white bg-[#349E4D] 
                  hover:bg-[#2C8440] hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
                  transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto"
                >
                  {editingId ? 'Update City' : 'Add City'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider font-roboto">
                    City Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider font-roboto">
                    State
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider font-roboto">
                    Popular
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider font-roboto">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#349E4D]"></div>
                        <span>Loading cities...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-red-600">{error}</td>
                  </tr>
                ) : filteredCities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-600">
                      {searchTerm ? 'No cities found matching your search' : 'No cities available'}
                    </td>
                  </tr>
                ) : (
                  filteredCities.map((city) => (
                    <tr key={city._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins">{city.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-roboto">{city.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-roboto">
                        {city.isPopular && (
                          <FaStar className="h-5 w-5 text-[#349E4D]" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-roboto">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => {
                              setFormData({
                                name: city.name,
                                state: city.state,
                                isPopular: city.isPopular
                              });
                              setEditingId(city._id);
                              setShowForm(true);
                            }}
                            className="text-[#349E4D] hover:text-[#2C8440] transition-colors duration-200"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(city._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityManagement;
