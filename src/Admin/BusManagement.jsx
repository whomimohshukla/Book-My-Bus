import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBus, FaUsers, FaRoute, FaSearch, FaCheck, FaWifi, FaChargingStation, FaTint, FaBed, FaTv } from 'react-icons/fa';
import api from '../utils/api';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    operatorId: '',
    busType: '',
    totalSeats: '',
    amenities: []
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Define bus types as a constant
  const BUS_TYPES = [
    { value: "AC", label: "AC" },
    { value: "Non-AC", label: "Non-AC" },
    { value: "Sleeper", label: "Sleeper" },
    { value: "Semi-Sleeper", label: "Semi-Sleeper" }
  ];

  // Function to get bus type label
  const getBusTypeLabel = (type) => {
    const busType = BUS_TYPES.find(t => t.value === type);
    return busType ? busType.label : type;
  };

  const availableAmenities = [
    { name: 'WiFi', icon: <FaWifi />, description: 'Free WiFi available' },
    { name: 'Charging Point', icon: <FaChargingStation />, description: 'USB charging points available' },
    { name: 'Water Bottle', icon: <FaTint />, description: 'Complimentary water bottle' },
    { name: 'Blanket', icon: <FaBed />, description: 'Blanket available on request' },
    { name: 'Entertainment System', icon: <FaTv />, description: 'Personal entertainment system' }
  ];

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      const amenityExists = currentAmenities.some(a => a.name === amenity.name);
      
      if (amenityExists) {
        return {
          ...prev,
          amenities: currentAmenities.filter(a => a.name !== amenity.name)
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, { ...amenity }]
        };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchBuses();
    fetchOperators();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/busRoute/buses');
      
      // Handle both array and object responses
      const busData = response.data;
      if (Array.isArray(busData)) {
        // Transform the data to ensure operatorId is properly extracted
        const transformedBuses = busData.map(bus => {
          let operatorId = null;
          
          if (bus.operatorId) {
            if (typeof bus.operatorId === 'object') {
              operatorId = bus.operatorId._id;
            } else if (typeof bus.operatorId === 'string') {
              operatorId = bus.operatorId;
            }
          }
          
          const transformed = {
            ...bus,
            operatorId
          };
          return transformed;
        });
        setBuses(transformedBuses);
      } else if (busData && typeof busData === 'object') {
        const buses = busData.buses || [];
        const transformedBuses = buses.map(bus => {
          let operatorId = null;
          
          if (bus.operatorId) {
            if (typeof bus.operatorId === 'object' && bus.operatorId._id) {
              operatorId = bus.operatorId._id;
            } else if (typeof bus.operatorId === 'string') {
              operatorId = bus.operatorId;
            }
          }
          
          const transformed = {
            ...bus,
            operatorId
          };
          return transformed;
        });
        setBuses(transformedBuses);
      } else {
        setBuses([]);
      }
    } catch (err) {
      setError('Failed to fetch buses: ' + (err.response?.data?.message || err.message));
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await api.get('/operatorRoute/operator');
      
      const operatorData = response.data;
      if (Array.isArray(operatorData)) {
        const processedOperators = operatorData.map(op => {
          return {
            _id: op._id,
            name: op.name
          };
        });
        setOperators(processedOperators);
      } else if (operatorData && typeof operatorData === 'object') {
        const operatorArray = operatorData.operators || operatorData.data || [];
        const processedOperators = operatorArray.map(op => {
          return {
            _id: op._id,
            name: op.name
          };
        });
        setOperators(processedOperators);
      } else {
        setOperators([]);
      }
    } catch (err) {
      setOperators([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requiredFields = ['busNumber', 'busName', 'operatorId', 'busType', 'totalSeats'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const totalSeats = parseInt(formData.totalSeats);
      if (isNaN(totalSeats) || totalSeats <= 0) {
        throw new Error('Total seats must be a positive number');
      }

      const requestData = {
        busNumber: formData.busNumber.trim(),
        busName: formData.busName.trim(),
        operatorId: formData.operatorId,
        type: formData.busType,
        totalSeats: totalSeats,
        amenities: formData.amenities.map(amenity => ({
          name: amenity.name,
          description: amenity.description
        })),
        seatLayout: {
          rows: Math.ceil(totalSeats / 4),
          columns: 4,
          seats: Array.from({ length: totalSeats }, (_, index) => ({
            seatNumber: `${String.fromCharCode(65 + Math.floor(index / 4))}${(index % 4) + 1}`,
            type: index % 4 === 0 ? 'Window' : index % 4 === 3 ? 'Window' : 'Aisle',
            deck: 'Lower',
            isAvailable: true,
            price: 500
          }))
        }
      };

      try {
        if (selectedBus) {
          await api.put(`/busRoute/buses/${selectedBus._id}`, requestData);
        } else {
          await api.post('/busRoute/buses', requestData);
        }
        
        await fetchBuses();
        setShowForm(false);
        setFormData({
          busNumber: '',
          busName: '',
          operatorId: '',
          busType: '',
          totalSeats: '',
          amenities: []
        });
        setSelectedBus(null);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           'Failed to save bus';
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message || 'Failed to create bus');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this bus?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/busRoute/buses/${id}`);
      await fetchBuses();
    } catch (err) {
      setError('Failed to delete bus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    if (!bus || !bus._id) {
      return;
    }

    setFormData({
      busNumber: bus.busNumber || '',
      busName: bus.busName || '',
      operatorId: bus.operatorId || '',
      busType: bus.busType || '',
      totalSeats: bus.totalSeats?.toString() || '',
      amenities: Array.isArray(bus.amenities) ? bus.amenities : []
    });
    setSelectedBus(bus);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-[#349E4D] font-poppins">Bus Management</h1>
              <p className="mt-2 text-sm text-gray-600 font-roboto">Manage your bus fleet and services</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
              font-medium text-white bg-[#349E4D] hover:bg-[#2C8440] hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
              transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto"
            >
              <FaPlus className="mr-2 -ml-1 h-5 w-5" />
              Add New Bus
            </button>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-[#E8F5EA] to-[#F7FBF7] overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaBus className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Total Buses</dt>
                      <dd className="text-2xl font-semibold text-[#349E4D] font-poppins">
                        {buses.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5EA] to-[#F7FBF7] overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaUsers className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Total Operators</dt>
                      <dd className="text-2xl font-semibold text-[#349E4D] font-poppins">
                        {operators.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5EA] to-[#F7FBF7] overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaRoute className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Bus Types</dt>
                      <dd className="text-2xl font-semibold text-[#349E4D] font-poppins">
                        {BUS_TYPES.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5EA] to-[#F7FBF7] overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaWifi className="h-6 w-6 text-[#349E4D]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate font-roboto">Available Amenities</dt>
                      <dd className="text-2xl font-semibold text-[#349E4D] font-poppins">
                        {availableAmenities.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
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
                placeholder="Search buses by number, name, or type..."
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">
              {selectedBus ? 'Edit Bus' : 'Add New Bus'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">Bus Number</label>
                  <input
                    type="text"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleInputChange}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
                    hover:border-blue-800 hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                    placeholder="Enter bus number"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">Bus Name</label>
                  <input
                    type="text"
                    name="busName"
                    value={formData.busName}
                    onChange={handleInputChange}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
                    hover:border-blue-800 hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                    placeholder="Enter bus name"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">Operator</label>
                  <select
                    name="operatorId"
                    value={formData.operatorId}
                    onChange={handleInputChange}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
                    hover:border-blue-800 hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                  >
                    <option value="">Select Operator</option>
                    {Array.isArray(operators) && operators.map((operator) => (
                      <option key={operator._id} value={operator._id}>
                        {operator.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">Bus Type</label>
                  <select
                    name="busType"
                    value={formData.busType}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
                    hover:border-blue-800 hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                  >
                    <option value="">Select Bus Type</option>
                    {BUS_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-800 mb-1 font-roboto">Total Seats</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleInputChange}
                    className="h-12 mt-1 block w-full rounded-md border-gray-300 bg-white 
                    shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
                    hover:border-blue-800 hover:shadow-md hover:bg-gray-50
                    transition-all duration-300 ease-in-out text-base font-roboto"
                    required
                    min="1"
                    placeholder="Enter total seats"
                  />
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-800 mb-2 font-roboto">Bus Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity.name}`}
                        checked={formData.amenities?.some(a => a.name === amenity.name)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 
                        rounded transition-all duration-300 ease-in-out cursor-pointer
                        hover:border-blue-800 hover:shadow-sm"
                      />
                      <label htmlFor={`amenity-${amenity.name}`} className="text-sm font-medium text-gray-800 flex items-center font-roboto">
                        {amenity.icon}
                        <span className="ml-2">{amenity.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBus(null);
                    setFormData({
                      busNumber: '',
                      busName: '',
                      operatorId: '',
                      busType: '',
                      totalSeats: '',
                      amenities: []
                    });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm 
                  text-base font-medium rounded-md text-gray-700 bg-white 
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
                  disabled={loading}
                >
                  {loading ? 'Saving...' : selectedBus ? 'Update Bus' : 'Add Bus'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Bus Number</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Bus Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Operator</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Total Seats</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Amenities</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 font-roboto">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(buses) && buses.length > 0 ? (
                  buses.map((bus) => (
                    <tr key={bus._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{bus.busNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bus.busName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          let operatorId = null;
                          if (bus.operatorId) {
                            if (typeof bus.operatorId === 'object') {
                              operatorId = bus.operatorId._id;
                            } else if (typeof bus.operatorId === 'string') {
                              operatorId = bus.operatorId;
                            }
                          }

                          const operator = operators.find(op => op._id === operatorId);
                          return operator ? operator.name : 'Unknown Operator';
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getBusTypeLabel(bus.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bus.totalSeats}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(bus.amenities) && bus.amenities.map((amenity) => (
                            <span
                              key={amenity._id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              title={amenity.description}
                            >
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bus._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      {loading ? 'Loading buses...' : 'No buses found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusManagement;
